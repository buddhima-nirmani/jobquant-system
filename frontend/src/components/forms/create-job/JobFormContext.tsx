"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  ClientSummary,
  JobCreatePayload,
  JobDetail,
  StaffSummary,
  createJob,
  getNextJobNumber,
  listClients,
  listStaff,
  predictCost as predictCostRequest,
} from "@/lib/api";
import { CurrentUser, getCurrentUser } from "@/lib/auth";

export type OrderItem = {
  productCategory: string;
  productName: string;
  width: string;
  height: string;
  area: string;
  unit: string;
  quantity: string;
  material: string;
  specification: string;
  printType: string;
  lamination: string;
  installation: string;
  predictedCost: number | null;
  saved: boolean;
};

const emptyItem: OrderItem = {
  productCategory: "",
  productName: "",
  width: "",
  height: "",
  area: "",
  unit: "",
  quantity: "",
  material: "",
  specification: "",
  printType: "",
  lamination: "",
  installation: "",
  predictedCost: null,
  saved: false,
};

type JobFormContextType = {
  currentUser: CurrentUser | null;

  jobNumber: string;
  setJobNumber: (value: string) => void;
  jobNumberLoading: boolean;

  jobName: string;
  setJobName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  jobType: string;
  setJobType: (value: string) => void;
  orderDate: string;
  setOrderDate: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  priority: string;
  setPriority: (value: string) => void;

  clients: ClientSummary[];
  clientsLoading: boolean;
  clientId: number | null;
  setClientId: (value: number | null) => void;
  selectedClient: ClientSummary | null;

  staffMembers: StaffSummary[];
  staffLoading: boolean;
  assignedStaffId: number | null;
  setAssignedStaffId: (value: number | null) => void;

  items: OrderItem[];
  transportation: boolean;
  distance: string;

  estimatedCost: number | null;
  isPredicting: boolean;
  predictionError: string;
  hasPredicted: boolean;

  finalCost: string;
  setFinalCost: (value: string) => void;

  notes: string;
  setNotes: (value: string) => void;

  isSubmitting: boolean;
  submitError: string;

  setItems: React.Dispatch<React.SetStateAction<OrderItem[]>>;
  setTransportation: React.Dispatch<React.SetStateAction<boolean>>;
  setDistance: React.Dispatch<React.SetStateAction<string>>;

  predictCost: () => Promise<void>;
  submitJob: () => Promise<JobDetail>;
};

const JobFormContext = createContext<JobFormContextType | null>(null);

export function JobFormProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const [jobNumber, setJobNumber] = useState("");
  const [jobNumberLoading, setJobNumberLoading] = useState(true);

  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [jobType, setJobType] = useState("");
  const [orderDate, setOrderDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientId, setClientId] = useState<number | null>(null);

  const [staffMembers, setStaffMembers] = useState<StaffSummary[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [assignedStaffId, setAssignedStaffId] = useState<number | null>(null);

  const [items, setItems] = useState<OrderItem[]>([{ ...emptyItem }]);
  const [transportation, setTransportation] = useState(false);
  const [distance, setDistance] = useState("");

  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionError, setPredictionError] = useState("");
  const [hasPredicted, setHasPredicted] = useState(false);

  const [finalCost, setFinalCost] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    getCurrentUser().then(setCurrentUser);

    getNextJobNumber()
      .then((result) => setJobNumber(result.job_number))
      .catch(() => setJobNumber(""))
      .finally(() => setJobNumberLoading(false));

    listClients()
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setClientsLoading(false));

    listStaff()
      .then(setStaffMembers)
      .catch(() => setStaffMembers([]))
      .finally(() => setStaffLoading(false));
  }, []);

  const selectedClient = clients.find((client) => client.id === clientId) ?? null;

  const predictCost = async () => {
    const savedItems = items.filter((item) => item.saved);

    if (savedItems.length === 0) {
      setPredictionError("Please save at least one order item before predicting the cost.");
      return;
    }

    setIsPredicting(true);
    setPredictionError("");

    try {
      const predictions = await Promise.all(
        savedItems.map((item) =>
          predictCostRequest({
            product_category: item.productCategory,
            product_name: item.productName,
            width: Number(item.width),
            height: Number(item.height),
            area: Number(item.area),
            unit: item.unit,
            quantity: Number(item.quantity),
            material: item.material,
            specification: item.specification,
            print_type: item.printType,
            lamination: item.lamination,
            installation: item.installation,
            transport: transportation ? "Yes" : "No",
          })
        )
      );

      let predictionIndex = 0;
      const updatedItems = items.map((item) => {
        if (!item.saved) {
          return item;
        }
        const result = predictions[predictionIndex];
        predictionIndex += 1;
        return { ...item, predictedCost: result.predicted_total_cost };
      });

      setItems(updatedItems);

      const total = predictions.reduce(
        (sum, result) => sum + result.predicted_total_cost,
        0
      );

      setEstimatedCost(total);
      setHasPredicted(true);
    } catch (error) {
      setPredictionError(
        error instanceof Error ? error.message : "Prediction failed."
      );
    } finally {
      setIsPredicting(false);
    }
  };

  const submitJob = async (): Promise<JobDetail> => {
    setSubmitError("");

    const fail = (message: string): never => {
      setSubmitError(message);
      throw new Error(message);
    };

    if (!jobNumber.trim()) {
      fail("Please enter a Job ID.");
    }

    if (!jobName.trim()) {
      fail("Job name is required.");
    }

    if (!orderDate) {
      fail("Order date is required.");
    }

    if (!clientId) {
      fail("Please select a client.");
    }

    if (!assignedStaffId) {
      fail("Please assign a staff member.");
    }

    const savedItems = items.filter((item) => item.saved);
    const unsavedItems = items.filter((item) => !item.saved);

    if (savedItems.length === 0) {
      fail("Please save at least one order item.");
    }

    if (unsavedItems.length > 0) {
      fail(
        "You have an unsaved order item. Click \"Save Item\" before creating the job, or remove it."
      );
    }

    if (transportation && (!distance || Number(distance) <= 0)) {
      fail(
        "Transport distance is required when transportation is enabled."
      );
    }

    const finalCostValue = Number(finalCost);

    if (!finalCost || Number.isNaN(finalCostValue) || finalCostValue < 0) {
      fail("Please enter a valid Final Approved Cost.");
    }

    const payload: JobCreatePayload = {
      job_number: jobNumber.trim(),
      job_name: jobName.trim(),
      description: description.trim() || null,
      job_type: jobType.trim() || null,
      // Validated non-null above via fail("Please select a client.").
      client_id: clientId as number,
      assigned_staff_id: assignedStaffId,
      order_date: orderDate,
      due_date: dueDate || null,
      priority,
      transportation_required: transportation,
      transport_distance: transportation ? Number(distance) : null,
      predicted_cost: estimatedCost,
      final_cost: finalCostValue,
      notes: notes.trim() || null,
      items: savedItems.map((item) => ({
        product_category: item.productCategory,
        product_name: item.productName,
        width: Number(item.width),
        height: Number(item.height),
        area: Number(item.area),
        unit: item.unit,
        quantity: Number(item.quantity),
        material: item.material,
        specification: item.specification,
        print_type: item.printType,
        lamination: item.lamination,
        installation: item.installation,
        predicted_cost: item.predictedCost,
      })),
    };

    setIsSubmitting(true);

    try {
      return await createJob(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to create job.";
      setSubmitError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <JobFormContext.Provider
      value={{
        currentUser,
        jobNumber,
        setJobNumber,
        jobNumberLoading,
        jobName,
        setJobName,
        description,
        setDescription,
        jobType,
        setJobType,
        orderDate,
        setOrderDate,
        dueDate,
        setDueDate,
        priority,
        setPriority,
        clients,
        clientsLoading,
        clientId,
        setClientId,
        selectedClient,
        staffMembers,
        staffLoading,
        assignedStaffId,
        setAssignedStaffId,
        items,
        transportation,
        distance,
        estimatedCost,
        isPredicting,
        predictionError,
        hasPredicted,
        finalCost,
        setFinalCost,
        notes,
        setNotes,
        isSubmitting,
        submitError,
        setItems,
        setTransportation,
        setDistance,
        predictCost,
        submitJob,
      }}
    >
      {children}
    </JobFormContext.Provider>
  );
}

export function useJobForm() {
  const context = useContext(JobFormContext);

  if (!context) {
    throw new Error("useJobForm must be used inside JobFormProvider");
  }

  return context;
}
