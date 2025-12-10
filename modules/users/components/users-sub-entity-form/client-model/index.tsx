import CreateClientSheet from "@/modules/clients/components/create-client/CreateClientSheet";

type PropsT = {
  sub_entity_id?: string;
  handleRefreshWidgetsData?: () => void;
};

export default function UsersSubEntityFormClientModel({
  sub_entity_id,
  handleRefreshWidgetsData,
}: PropsT) {
  return <CreateClientSheet sub_entity_id={sub_entity_id} handleRefreshWidgetsData={handleRefreshWidgetsData} />;
}
