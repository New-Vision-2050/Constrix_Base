import { useCreateBuilderCxt } from "../../context/create-builder-cxt";

export default function ChooseModule() {
  const { modules, handleChangeModuleId } = useCreateBuilderCxt();

  return (
    <div className="grid my-3 gap-4">
      {modules?.map((module) => (
        <button
          key={module.id}
          onClick={() => handleChangeModuleId(module.id)}
          className="border-2 rounded px-4 py-2 hover:bg-gray-100"
        >
          {module.title}
        </button>
      ))}
    </div>
  );
}
