import { Checkbox } from "@/components/ui/checkbox";

export default function PermissionItem({ item }: { item: string }) {
  return (
    <tr>
      <td className="p-2">{item}</td>
      <td className="p-2">
        <Checkbox />
      </td>
      <td className="p-2">
        <Checkbox />
      </td>
      <td className="p-2">
        <Checkbox />
      </td>
      <td className="p-2">
        <Checkbox />
      </td>
    </tr>
  );
}
