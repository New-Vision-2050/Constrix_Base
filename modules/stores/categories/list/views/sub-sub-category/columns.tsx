import TheStatus from "../../../component/the-status";

export type CategoryRow = {
  id: string;
  name: string;
  priority?: number | string | null;
  is_active: "active" | "inActive";
};

export const getSubSubCategoryColumns = (t: (key: string) => string) => [
  {
    key: "name",
    name: "القسم",
    sortable: true,
    render: (row: CategoryRow) => <strong>{row.name}</strong>,
  },
  {
    key: "priority",
    name: "أولوية",
    sortable: false,
    render: (row: CategoryRow) => <span>{row.priority || "-"}</span>,
  },
  {
    key: "is_active",
    name: "الحالة",
    sortable: false,
    render: (row: CategoryRow) => (
      <TheStatus theStatus={row.is_active} id={row.id} />
    ),
  },
];
