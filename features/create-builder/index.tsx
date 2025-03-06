import CreateBuilderViewsEndPoint from "./components/end-point";
import CreateBuilderCxtProvider from "./context/create-builder-cxt";

type PropsT = {
  btnLabel: string;
  moduleId?: string;
};

export default function CreateBuilderModule({ btnLabel, moduleId }: PropsT) {
  return (
    <CreateBuilderCxtProvider btnLabel={btnLabel} moduleId={moduleId}>
      <CreateBuilderViewsEndPoint />
    </CreateBuilderCxtProvider>
  );
}
