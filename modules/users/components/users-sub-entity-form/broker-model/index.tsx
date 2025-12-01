import CreateBrokerSheet from "@/modules/brokers/components/create-broker/CreateBrokerSheet";

export default function UsersSubEntityFormBrokerModel({
  sub_entity_id,
  handleRefreshWidgetsData,
}: {
  handleRefreshWidgetsData?: () => void;
  sub_entity_id?: string;
}) {
  return <CreateBrokerSheet sub_entity_id={sub_entity_id} handleRefreshWidgetsData={handleRefreshWidgetsData} />;
}
