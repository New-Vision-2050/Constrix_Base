"use client";

import {useParams, useSearchParams} from "next/navigation";
import { CreateClientCxtProvider, useCreateClientCxt } from "@/modules/clients/context/CreateClientCxt";
import { ClientsDataCxtProvider } from "@/modules/clients/context/ClientsDataCxt";
import { useEffect, useState } from "react";
import UsersSubEntityTable from "@/modules/users/components/users-sub-entity-table";
import { SUPER_ENTITY_SLUG } from "@/constants/super-entity-slug";
import { useGetSubEntity } from "@/hooks/useGetSubEntity";

function CreateClientPageContent() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const { slug } = useParams();
  const { subEntity } = useGetSubEntity(SUPER_ENTITY_SLUG.CRM, slug);
  const [shouldOpenForm, setShouldOpenForm] = useState(false);

  useEffect(() => {
    console.log("Action parameter:", action);
    console.log("Slug:", slug);
    
    if (action === "create") {
      console.log(`Action 'create' detected for ${slug}. Setting shouldOpenForm to true.`);
      setShouldOpenForm(true);
    }
  }, [action, slug]);

  const tableId = `${subEntity?.slug}-users`;
  const sub_entity_id = subEntity?.id;
  const registration_form_id = subEntity?.registration_form?.id;

  return (
    <CreateClientCxtProvider tableId={tableId}>
      <UsersSubEntityTable 
        programName={SUPER_ENTITY_SLUG.CRM} 
        forceOpenCreateForm={shouldOpenForm}
        currentSlug={slug}
      />
    </CreateClientCxtProvider>
  );
}

export default function CreateClientPage() {
  return (
    <ClientsDataCxtProvider>
      <CreateClientPageContent />
    </ClientsDataCxtProvider>
  );
}
