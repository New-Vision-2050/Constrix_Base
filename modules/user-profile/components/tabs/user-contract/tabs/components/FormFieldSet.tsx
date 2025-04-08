type PropsT = {
  title: string;
  children: React.ReactNode;
};

export default function FormFieldSet(props: PropsT) {
  const { title, children } = props;
  return (
    <fieldset className="border border-gray-300 rounded-2xl p-6 shadow-sm">
      <legend className="text-lg font-semibold  px-2">{title}</legend>
      {children}
    </fieldset>
  );
}
