import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import StatusBadge from "@/components/ui/StatusBadge";

interface Payment {
  id: string;
  jobId: string;
  amount: string;
  status: string;
  uploaded: string;
}

interface PaymentsTableProps {
  payments: Payment[];
}

export default function PaymentsTable({
  payments,
}: PaymentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Payments</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left">Payment ID</th>
                <th className="py-3 text-left">Job ID</th>
                <th className="py-3 text-left">Amount</th>
                <th className="py-3 text-left">Status</th>
                <th className="py-3 text-left">Uploaded</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b hover:bg-muted/40"
                >
                  <td className="py-4 font-medium">
                    {payment.id}
                  </td>

                  <td>{payment.jobId}</td>

                  <td>{payment.amount}</td>

                  <td>
                    <StatusBadge
                      status={payment.status}
                    />
                  </td>

                  <td>{payment.uploaded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}