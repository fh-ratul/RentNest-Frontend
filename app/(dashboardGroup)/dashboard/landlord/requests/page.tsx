import { Card } from "@/components/ui/card";
import RequestTable from "@/components/dashboard/landlord/request-table";
import { getLandlordRequests } from "../_actions/requestActions";
import { ILandlordRentalRequest } from "@/lib/types";

export default async function LandlordRequestsPage() {
  const result = await getLandlordRequests();
  const requests: ILandlordRentalRequest[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Rental Requests</h1>
        <p className="text-muted-foreground">Manage incoming requests for your properties.</p>
      </div>
      <Card className="overflow-hidden py-0">
        <RequestTable requests={requests} />
      </Card>
    </div>
  );
}