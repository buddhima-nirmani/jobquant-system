// IMPORTANT: use the same hostname ("localhost") the frontend itself is
// served from. The backend's auth cookie is SameSite=Lax; browsers treat
// "localhost" and "127.0.0.1" as different sites, so mixing them silently
// drops the cookie on every fetch() call after login.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong.");
  }

  return data as T;
}

async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  method: string = "POST"
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    credentials: "include",
    body: formData,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Something went wrong.");
  }

  return data as T;
}

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export type Role = "admin" | "staff" | "client";

export type PersonSummary = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
};

export type JobItemPayload = {
  product_category: string;
  product_name: string;
  width: number;
  height: number;
  area: number;
  unit: string;
  quantity: number;
  material: string;
  specification: string;
  print_type: string;
  lamination: string;
  installation: string;
  predicted_cost: number | null;
};

export type JobItemResponse = JobItemPayload & { id: number };

export type JobProgressEntry = {
  id: number;
  status: string;
  note: string | null;
  updated_by: number;
  updated_by_name: string;
  created_at: string;
};

export type JobListItem = {
  id: number;
  job_number: string;
  job_name: string;
  client_name: string;
  assigned_staff_name: string | null;
  order_date: string;
  due_date: string | null;
  final_cost: number | null;
  predicted_cost: number | null;
  paid_amount: number;
  outstanding_amount: number | null;
  status: string;
  priority: string;
};

export type JobDetail = {
  id: number;
  job_number: string;
  job_name: string;
  description: string | null;
  job_type: string | null;
  status: string;
  priority: string;
  client: PersonSummary;
  assigned_staff: PersonSummary | null;
  created_by: PersonSummary;
  order_date: string;
  due_date: string | null;
  transportation_required: boolean;
  transport_distance: number | null;
  predicted_cost: number | null;
  final_cost: number | null;
  notes: string | null;
  items: JobItemResponse[];
  progress_history: JobProgressEntry[];
  paid_amount: number;
  outstanding_amount: number | null;
  created_at: string;
  updated_at: string | null;
};

export type JobCreatePayload = {
  job_number?: string | null;
  job_name: string;
  description?: string | null;
  job_type?: string | null;
  client_id: number;
  assigned_staff_id?: number | null;
  order_date: string;
  due_date?: string | null;
  priority: string;
  transportation_required: boolean;
  transport_distance?: number | null;
  predicted_cost?: number | null;
  final_cost: number;
  notes?: string | null;
  items: JobItemPayload[];
};

export type ClientSummary = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  is_active: boolean;
  active_jobs: number;
  created_at: string;
};

export type StaffSummary = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  is_active: boolean;
  assigned_jobs: number;
  created_at: string;
};

export type DesignVersionResponse = {
  id: number;
  job_id: number;
  version_number: number;
  status: string;
  uploaded_by: number;
  uploaded_by_name: string;
  uploaded_at: string;
  approved_at: string | null;
  has_original_access: boolean;
};

export type DesignCommentResponse = {
  id: number;
  design_version_id: number;
  user_id: number;
  user_name: string;
  user_role: string;
  comment: string;
  is_revision_request: boolean;
  created_at: string;
  updated_at: string | null;
  can_edit: boolean;
  can_delete: boolean;
};

export type PaymentResponse = {
  id: number;
  job_id: number;
  job_number: string;
  client_id: number;
  client_name: string;
  uploaded_by: number;
  uploaded_by_name: string;
  amount: number;
  payment_method: string | null;
  status: string;
  rejection_reason: string | null;
  verified_by: number | null;
  verified_at: string | null;
  created_at: string;
};

export type InvoiceResponse = {
  id: number;
  job_id: number;
  uploaded_by: number;
  uploaded_by_name: string;
  uploaded_at: string;
};

export type PredictionRequest = {
  product_category: string;
  product_name: string;
  width: number;
  height: number;
  area: number;
  unit: string;
  quantity: number;
  material: string;
  specification: string;
  print_type: string;
  lamination: string;
  installation: string;
  transport: "Yes" | "No";
};

export type PredictionResponse = {
  predicted_unit_price: number;
  predicted_total_cost: number;
};

export type AdminDashboard = {
  total_jobs: number;
  pending_jobs: number;
  jobs_in_progress: number;
  completed_jobs: number;
  total_clients: number;
  active_staff: number;
  pending_payments: number;
  verified_revenue: number;
  recent_jobs: {
    id: number;
    job_number: string;
    job_name: string;
    client_name: string;
    assigned_staff_name: string | null;
    due_date: string | null;
    status: string;
    final_cost: number | null;
  }[];
  recent_activity: { id: string; type: string; title: string; created_at: string }[];
};

export type StaffDashboard = {
  assigned_jobs: number;
  active_jobs: number;
  pending_design_reviews: number;
  jobs_due_soon: number;
  completed_jobs: number;
  recent_jobs: AdminDashboard["recent_jobs"];
};

export type ClientDashboard = {
  active_orders: number;
  completed_orders: number;
  pending_design_approvals: number;
  outstanding_payments: number;
};

// ---------------------------------------------------------------------------
// Prediction
// ---------------------------------------------------------------------------

export function predictCost(payload: PredictionRequest) {
  return apiRequest<PredictionResponse>("/api/prediction/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

export function listClients(q?: string) {
  const query = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiRequest<ClientSummary[]>(`/api/clients${query}`);
}

export function updateClient(
  id: number,
  payload: Partial<{
    name: string;
    phone: string | null;
    company: string | null;
    is_active: boolean;
  }>
) {
  return apiRequest<ClientSummary>(`/api/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Staff
// ---------------------------------------------------------------------------

export function listStaff(q?: string) {
  const query = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiRequest<StaffSummary[]>(`/api/staff${query}`);
}

export function createStaff(payload: {
  name: string;
  email: string;
  phone?: string | null;
  password: string;
}) {
  return apiRequest<StaffSummary>("/api/staff", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateStaff(
  id: number,
  payload: Partial<{ name: string; phone: string | null; is_active: boolean }>
) {
  return apiRequest<StaffSummary>(`/api/staff/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function resetStaffPassword(id: number, newPassword: string) {
  return apiRequest<{ message: string }>(`/api/staff/${id}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ new_password: newPassword }),
  });
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export type JobListFilters = {
  q?: string;
  status?: string;
  priority?: string;
  staff_id?: number;
  date_from?: string;
  date_to?: string;
};

export function listJobs(filters: JobListFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<JobListItem[]>(`/api/jobs${query}`);
}

export function getJob(id: number) {
  return apiRequest<JobDetail>(`/api/jobs/${id}`);
}

export function createJob(payload: JobCreatePayload) {
  return apiRequest<JobDetail>("/api/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateJob(
  id: number,
  payload: Partial<{
    job_number: string;
    job_name: string;
    description: string | null;
    job_type: string | null;
    assigned_staff_id: number | null;
    due_date: string | null;
    priority: string;
    final_cost: number;
    notes: string | null;
  }>
) {
  return apiRequest<JobDetail>(`/api/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function getNextJobNumber() {
  return apiRequest<{ job_number: string }>("/api/jobs/next-number");
}

export function updateJobItems(jobId: number, items: JobItemPayload[]) {
  return apiRequest<JobDetail>(`/api/jobs/${jobId}/items`, {
    method: "PUT",
    body: JSON.stringify(items),
  });
}

export function deleteJob(id: number) {
  return apiRequest<{ message: string }>(`/api/jobs/${id}`, {
    method: "DELETE",
  });
}

export function updateJobProgress(
  id: number,
  payload: { status: string; note?: string | null }
) {
  return apiRequest<JobDetail>(`/api/jobs/${id}/progress`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------------------------------------------------------------------------
// Designs
// ---------------------------------------------------------------------------

export function listDesignVersions(jobId: number) {
  return apiRequest<DesignVersionResponse[]>(`/api/jobs/${jobId}/designs`);
}

export function uploadDesignVersion(
  jobId: number,
  file: File,
  applyWatermark: boolean
) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("apply_watermark", String(applyWatermark));
  return apiUpload<DesignVersionResponse>(`/api/jobs/${jobId}/designs`, formData);
}

export function designFileUrl(
  versionId: number,
  type: "original" | "watermarked"
) {
  return `${API_URL}/api/designs/${versionId}/file?type=${type}`;
}

export function approveDesign(versionId: number) {
  return apiRequest<DesignVersionResponse>(`/api/designs/${versionId}/approve`, {
    method: "POST",
  });
}

export function requestDesignRevision(versionId: number, comment: string) {
  return apiRequest<DesignVersionResponse>(`/api/designs/${versionId}/revision`, {
    method: "POST",
    body: JSON.stringify({ comment, is_revision_request: true }),
  });
}

export function listDesignComments(versionId: number) {
  return apiRequest<DesignCommentResponse[]>(`/api/designs/${versionId}/comments`);
}

export function addDesignComment(versionId: number, comment: string) {
  return apiRequest<DesignCommentResponse>(`/api/designs/${versionId}/comments`, {
    method: "POST",
    body: JSON.stringify({ comment, is_revision_request: false }),
  });
}

export function editDesignComment(commentId: number, comment: string) {
  return apiRequest<DesignCommentResponse>(`/api/designs/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify({ comment }),
  });
}

export function deleteDesignComment(commentId: number) {
  return apiRequest<{ message: string }>(`/api/designs/comments/${commentId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

export function listPayments(filters: { status?: string; jobId?: number } = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status_filter", filters.status);
  if (filters.jobId) params.set("job_id", String(filters.jobId));
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest<PaymentResponse[]>(`/api/payments${query}`);
}

export function uploadPaymentSlip(
  jobId: number,
  amount: number,
  paymentMethod: string | null,
  slip: File | null
) {
  const formData = new FormData();
  formData.append("amount", String(amount));
  if (paymentMethod) {
    formData.append("payment_method", paymentMethod);
  }
  if (slip) {
    formData.append("slip", slip);
  }
  return apiUpload<PaymentResponse>(`/api/jobs/${jobId}/payments`, formData);
}

export function paymentSlipUrl(paymentId: number) {
  return `${API_URL}/api/payments/${paymentId}/slip`;
}

export function verifyPayment(paymentId: number) {
  return apiRequest<PaymentResponse>(`/api/payments/${paymentId}/verify`, {
    method: "POST",
  });
}

export function rejectPayment(paymentId: number, reason: string) {
  return apiRequest<PaymentResponse>(`/api/payments/${paymentId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function deletePayment(paymentId: number) {
  return apiRequest<{ message: string }>(`/api/payments/${paymentId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------

export function listInvoices(jobId: number) {
  return apiRequest<InvoiceResponse[]>(`/api/jobs/${jobId}/invoice`);
}

export function uploadInvoice(jobId: number, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return apiUpload<InvoiceResponse>(`/api/jobs/${jobId}/invoice`, formData);
}

export function invoiceFileUrl(invoiceId: number) {
  return `${API_URL}/api/invoices/${invoiceId}/file`;
}

export function deleteInvoice(invoiceId: number) {
  return apiRequest<{ message: string }>(`/api/invoices/${invoiceId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Dashboards
// ---------------------------------------------------------------------------

export function getAdminDashboard() {
  return apiRequest<AdminDashboard>("/api/dashboard/admin");
}

export function getStaffDashboard() {
  return apiRequest<StaffDashboard>("/api/dashboard/staff");
}

export function getClientDashboard() {
  return apiRequest<ClientDashboard>("/api/dashboard/client");
}

export type TrendPoint = { label: string; created: number; completed: number };

export function getAdminTrend() {
  return apiRequest<TrendPoint[]>("/api/dashboard/admin/trend");
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export type NotificationResponse = {
  id: number;
  type: string;
  title: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export function listNotifications() {
  return apiRequest<NotificationResponse[]>("/api/notifications");
}

export function unreadNotificationCount() {
  return apiRequest<{ count: number }>("/api/notifications/unread-count");
}

export function markNotificationRead(id: number) {
  return apiRequest<NotificationResponse>(`/api/notifications/${id}/read`, {
    method: "POST",
  });
}

export function markAllNotificationsRead() {
  return apiRequest<{ message: string }>("/api/notifications/mark-all-read", {
    method: "POST",
  });
}

// ---------------------------------------------------------------------------
// Password reset / profile
// ---------------------------------------------------------------------------

export function forgotPassword(email: string) {
  return apiRequest<{ message: string; reset_token: string | null; reset_url: string | null }>(
    "/api/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    }
  );
}

export function resetPassword(token: string, newPassword: string) {
  return apiRequest<{ message: string }>("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

export type ProfileResponse = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: Role;
  is_active: boolean;
};

export function changePassword(currentPassword: string, newPassword: string) {
  return apiRequest<{ message: string }>("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}

export function updateProfile(payload: {
  name?: string;
  phone?: string | null;
  company?: string | null;
}) {
  return apiRequest<ProfileResponse>("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
