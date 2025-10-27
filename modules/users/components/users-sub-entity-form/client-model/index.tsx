import CreateClientSheet from "@/modules/clients/components/create-client/CreateClientSheet";

type PropsT = {
  sub_entity_id?: string;
};

export default function UsersSubEntityFormClientModel({
  sub_entity_id,
}: PropsT) {
  return <CreateClientSheet sub_entity_id={sub_entity_id} />;
}
