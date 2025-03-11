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
        <AccordionTrigger className="text-white bg-[#2D174D] p-2 px-3 rounded-lg my-3">
          <div className="flex flex-row items-center justify-between h-[56px]">
            <div className="flex items-center gap-2">
              {isCompanyCreated && (
                <div className="text-green-600">
                  <CircleCheck />
                </div>
              )}
              <h4 className="text-lg font-bold text-white">بيانات الشركة</h4>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <SetCompanyModule onModuleClose={handleCloseCompanyModule} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="create-user">
        <AccordionTrigger className="text-white bg-[#2D174D] p-2 px-3 rounded-lg my-3">
          <div className="flex flex-row items-center justify-between h-[56px]">
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-white">
                بيانات مستخدم الشركة الرئيسي
              </h4>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <SetUserModule companyId={companyId} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
