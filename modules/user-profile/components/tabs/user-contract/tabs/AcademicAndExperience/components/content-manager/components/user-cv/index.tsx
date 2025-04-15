import { Button } from "@/components/ui/button";
import FormFieldSet from "../../../../../components/FormFieldSet";
import PencilLineIcon from "@/public/icons/pencil-line";
import PdfViewer from "./PdfViewer";

export default function UserCV() {
  return (
    <div className="flex flex-col gap-6">
      <p className="text-lg font-bold text-gray-700">
        البيانات الوظيفية والتعاقدية
      </p>
      <FormFieldSet
        title={"السيرة الذاتية"}
        secondTitle={
          <Button variant={"ghost"}>
            <PencilLineIcon additionalClass="text-pink-600" />
          </Button>
        }
      >
        <PdfViewer src="https://www.orimi.com/pdf-test.pdf" />
      </FormFieldSet>
    </div>
  );
}
