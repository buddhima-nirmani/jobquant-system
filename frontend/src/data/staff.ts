export interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "Manager" | "Receptionist" | "Designer";
  assignedJobs: number;
}

export const staff: Staff[] = [
  {
    id: 1,
    name: "John Perera",
    email: "john@jobquant.com",
    phone: "+94 77 123 4567",
    role: "Manager",
    assignedJobs: 12,
  },
  {
    id: 2,
    name: "Sarah Fernando",
    email: "sarah@jobquant.com",
    phone: "+94 71 458 9652",
    role: "Receptionist",
    assignedJobs: 8,
  },
  {
    id: 3,
    name: "Kasun Silva",
    email: "kasun@jobquant.com",
    phone: "+94 75 998 2214",
    role: "Designer",
    assignedJobs: 15,
  },
  {
    id: 4,
    name: "Nimali Perera",
    email: "nimali@jobquant.com",
    phone: "+94 76 654 7891",
    role: "Designer",
    assignedJobs: 11,
  },
  {
    id: 5,
    name: "Dilshan Jayasuriya",
    email: "dilshan@jobquant.com",
    phone: "+94 70 365 7412",
    role: "Receptionist",
    assignedJobs: 6,
  },
];