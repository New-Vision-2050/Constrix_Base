import ClientRequestsList from "@/modules/crm-settings/client-requests/views/list";

export default function CrmInboxPage() {
  return <ClientRequestsList initialStatusFilter="pending" />;
}
