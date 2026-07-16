import PageHeader from "@/components/layouts/PageHeader";
import ClientsTable from "@/components/tables/ClientsTable";

const clients = [
  {
    id: "CL-001",
    company: "ABC Holdings",
    contactPerson: "John Silva",
    email: "contact@abcholdings.com",
    phone: "+94 71 234 5678",
    status: "Active",
  },
  {
    id: "CL-002",
    company: "Vision Tech",
    contactPerson: "Sarah Fernando",
    email: "info@visiontech.com",
    phone: "+94 77 987 6543",
    status: "Active",
  },
  {
    id: "CL-003",
    company: "AutoCare",
    contactPerson: "Nuwan Perera",
    email: "sales@autocare.lk",
    phone: "+94 76 123 4567",
    status: "Inactive",
  },
  {
    id: "CL-004",
    company: "Creative Studio",
    contactPerson: "Kasun Jayasinghe",
    email: "hello@creative.lk",
    phone: "+94 70 888 1212",
    status: "Active",
  },
];

export default function StaffClientsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Clients"
        description="View all registered clients."
        date="Monday, 30 June 2026"
      />

      <ClientsTable clients={clients} />
    </div>
  );
}