import { PageHeader, Panel } from "@/components/dashboard/page-header";
import RequestTable from "@/components/dashboard/landlord/request-table";
import { getLandlordRequests } from "../_actions/requestActions";
import { ILandlordRentalRequest } from "@/lib/types";

export default async function LandlordRequestsPage() {
  const result = await getLandlordRequests();
  const requests: ILandlordRentalRequest[] = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Rental requests" description="Manage incoming requests for your properties." />
      <Panel>
        <RequestTable requests={requests} />
      </Panel>
    </div>
  );
}