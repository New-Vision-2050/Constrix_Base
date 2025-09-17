import { Button } from "@/components/ui/button";
import { REGISTRATION_FORMS } from "@/constants/registration-forms";
import {
  GetCompanyUserFormConfig,
  SheetFormBuilder,
  useSheetForm,
} from "@/modules/form-builder";
import { useTableStore } from "@/modules/table/store/useTableStore";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ModelsTypes } from "./constants/ModelsTypes";
import UsersSubEntityFormClientModel from "./client-model";
import UsersSubEntityFormBrokerModel from "./broker-model";

type PropsT = {
  tableId: string;
  sub_entity_id?: string;
  slug?: string;
  registrationFormSlug?: string;
};

export default function UsersSubEntityForm({
  tableId,
  sub_entity_id,
  slug,
  registrationFormSlug,
}: PropsT) {
  // declare and define component state and vars
  const t = useTranslations("Companies");

  // define final form config
  const finalFormConfig = useMemo(() => {
    const registrationFromConfig = registrationFormSlug
      ? REGISTRATION_FORMS[registrationFormSlug]
      : GetCompanyUserFormConfig;

    return Boolean(registrationFromConfig)
      ? registrationFromConfig
      : GetCompanyUserFormConfig;
  }, [registrationFormSlug, slug]);

  // define sheet form
  const { closeSheet } = useSheetForm({
    config: finalFormConfig(t),
  });

  // define handle close form
  const handleCloseForm = () => {
    closeSheet();
    const tableStore = useTableStore.getState();
    tableStore.reloadTable(tableId);
    setTimeout(() => {
      tableStore.setLoading(tableId, false);
    }, 100);
  };

  // client model
  if (registrationFormSlug === ModelsTypes.CLIENT) {
    return <UsersSubEntityFormClientModel />;
  }

  // broker model
  if (registrationFormSlug === ModelsTypes.BROKER) {
    return <UsersSubEntityFormBrokerModel />;
  }

  // define sheet form
  return (
    <>
      <SheetFormBuilder
        config={{
          ...finalFormConfig(t, handleCloseForm),
          apiParams: {
            sub_entity_id: sub_entity_id as string,
          },
          onSuccess: () => {
            const tableStore = useTableStore.getState();
            tableStore.reloadTable(tableId);
            setTimeout(() => {
              tableStore.setLoading(tableId, false);
            }, 100);
          },
        }}
        trigger={<Button>اضافة</Button>}
        onSuccess={(values) => {
          console.log("Form submitted successfully:", values);
        }}
      />
    </>
  );
}
