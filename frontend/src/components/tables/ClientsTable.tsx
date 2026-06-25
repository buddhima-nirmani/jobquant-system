import {
  MoreHorizontal,
  Mail,
  Phone,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import StatusBadge from "@/components/ui/StatusBadge";

type Client = {
  id: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: string;
};

type ClientsTableProps = {
  clients: Client[];
};

export default function ClientsTable({
  clients,
}: ClientsTableProps) {
  return (
    <Card className="rounded-2xl border-[#EAEAEA] shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-bold">
          All Clients
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="border-b bg-[#F8FAFC] text-left">

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Client ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Company
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Contact
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Email
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Phone
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                  Status
                </th>

                <th className="w-16"></th>

              </tr>
            </thead>

            <tbody>

              {clients.map((client) => (

                <tr
                  key={client.id}
                  className="border-b transition hover:bg-[#FAFAFA]"
                >

                  <td className="px-6 py-5 font-semibold text-[#FF6B00]">
                    {client.id}
                  </td>

                  <td className="px-6 py-5">
                    <div>

                      <p className="font-semibold text-[#0F172A]">
                        {client.company}
                      </p>

                      <p className="text-sm text-[#64748B]">
                        {client.contactPerson}
                      </p>

                    </div>
                  </td>

                  <td className="px-6 py-5">
                    {client.contactPerson}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">

                      <Mail className="h-4 w-4" />

                      {client.email}

                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">

                      <Phone className="h-4 w-4" />

                      {client.phone}

                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge
                      status={client.status}
                    />
                  </td>

                  <td className="px-6 py-5 text-right">

                    <button
                      type="button"
                      title="More actions"
                      aria-label="More actions"
                      className="rounded-lg p-2 transition hover:bg-[#F4F4F5]"
                    >
                      <MoreHorizontal className="h-5 w-5 text-[#64748B]" />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>
      </CardContent>
    </Card>
  );
}