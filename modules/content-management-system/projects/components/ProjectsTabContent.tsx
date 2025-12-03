import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import ProjectsGrid from "./ProjectsGrid";
import DialogTrigger from "@/components/headless/dialog-trigger";
import SetProjectDialog from "./setProjectDialog.tsx";
import { useMemo, useState } from "react";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import useProjects from "../hooks/useProjects";
import { StateLoading, StateError } from "@/components/shared/states";

export default function ProjectsTabContent() {
    const t = useTranslations("content-management-system.projects");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    // Get projects list from API
    const {
        data: projectsList,
        isLoading: isLoadingProjectsList,
        isError: isErrorProjectsList,
        error: projectsError,
        refetch: refetchProjectsList
    } = useProjects();
    const projects = useMemo(() => projectsList?.data?.payload || [], [projectsList]);
    
    const OnEditProject = (id: string) => {
        setEditingProjectId(id);
    }


    // Handle loading and error states
    if (isLoadingProjectsList) {
        return <StateLoading />;
    }
    // handle error
    if (isErrorProjectsList) {
        return <StateError message={projectsError?.message} onRetry={refetchProjectsList} />;
    }
    
    // normal flow
    return <>
        <div className="flex flex-col gap-4">
            {/*  add project button & title */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{t("title")}</h1>
                <Can check={[PERMISSIONS.CMS.projects.create]}>
                    <DialogTrigger
                        component={SetProjectDialog}
                        dialogProps={{ onSuccess: () => { } }}
                        render={({ onOpen }) => (
                            <Button onClick={onOpen}>
                                <PlusIcon />
                                {t("addProject")}
                            </Button>
                        )}
                    />
                </Can>
            </div>
            {/* projects grid */}
            <Can check={[PERMISSIONS.CMS.projects.list]}>
                <ProjectsGrid OnEditProject={OnEditProject} projects={projects} />
            </Can>
        </div>
        <Can check={[PERMISSIONS.CMS.projects.update]}>
            <SetProjectDialog
                open={Boolean(editingProjectId)}
                onClose={() => setEditingProjectId(null)}
                projectId={editingProjectId || undefined}
                onSuccess={() => { }}
            />
        </Can>
    </>
}
