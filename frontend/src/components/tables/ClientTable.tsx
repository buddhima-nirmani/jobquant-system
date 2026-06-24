import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  activeJobs: number;
  joined: string;
}

interface ClientTableProps {
  clients: Client[];
}

export default function ClientTable({
  clients,
}: ClientTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Clients</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3">Client</th>
                <th className="text-left py-3">Email</th>
                <th className="text-left py-3">Phone</th>
                <th className="text-left py-3">Active Jobs</th>
                <th className="text-left py-3">Joined</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b hover:bg-muted/40"
                >
                  <td className="py-4 font-medium">
                    {client.name}
                  </td>

                  <td>{client.email}</td>

                  <td>{client.phone}</td>

                  <td>{client.activeJobs}</td>

                  <td>{client.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}