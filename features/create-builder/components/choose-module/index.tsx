import { useCreateBuilderStore } from "../../store/useCreateBuilderStore";

export default function ChooseModule() {
  const { modules, setModuleId } = useCreateBuilderStore();

  return (
    <div className="grid my-3 gap-4">
      {modules?.map((module) => (
        <button
          key={module.id}
          onClick={() => setModuleId(module.id)}
          className="border-2 rounded px-4 py-2 hover:bg-gray-100"
        >
          {module.title}
        </button>
      ))}
    </div>
  );
}
