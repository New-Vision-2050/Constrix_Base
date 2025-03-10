import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SetCompanyModule from "../../../set-company";
import { useCreateCompanyUserCxt } from "../../context/CreateCompanyUserCxt";

import { CircleCheck } from "lucide-react";
import SetUserModule from "@/modules/users/components/set-user";

export default function CreateCompanyUserModuleEntryPoint() {
  const { isCompanyCreated, handleSetCompanyCreated } =
    useCreateCompanyUserCxt();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="create-company">
        <AccordionTrigger>
          {isCompanyCreated && (
            <div>
              <CircleCheck />
            </div>
          )}
          <h4 className="text-lg font-bold text-white">بيانات الشركة</h4>
        </AccordionTrigger>
        <AccordionContent>
          <SetCompanyModule />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="create-user">
        <AccordionTrigger>
          <h4 className="text-lg font-bold text-white">
            بيانات مستخدم الشركة الرئيسي
          </h4>
        </AccordionTrigger>
        <AccordionContent>
          <SetUserModule />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
