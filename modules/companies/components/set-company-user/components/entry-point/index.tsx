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
import { Company } from "@/modules/companies/types/Company";

export default function CreateCompanyUserModuleEntryPoint() {
  const {
    isCompanyCreated,
    companyId,
    handleSetCompanyCreated,
    handleSetCompanyId,
  } = useCreateCompanyUserCxt();

  const handleCloseCompanyModule = (com?: Company) => {
    handleSetCompanyId(com?.id ?? "");
    handleSetCompanyCreated(true);
  };

  return (
    <Accordion
      type="single"
      collapsible
      value={!isCompanyCreated ? "create-company" : "create-user"}
    >
      <AccordionItem value={"create-company"}>
        <AccordionTrigger>
          {isCompanyCreated && (
            <div>
              <CircleCheck />
            </div>
          )}
          <h4 className="text-lg font-bold text-white">بيانات الشركة</h4>
        </AccordionTrigger>
        <AccordionContent>
          <SetCompanyModule onModuleClose={handleCloseCompanyModule} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="create-user">
        <AccordionTrigger>
          <h4 className="text-lg font-bold text-white">
            بيانات مستخدم الشركة الرئيسي
          </h4>
        </AccordionTrigger>
        <AccordionContent>
          <SetUserModule companyId={companyId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
