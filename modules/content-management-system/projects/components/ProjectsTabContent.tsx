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
import DeleteConfirmationDialog from "@/components/shared/DeleteConfirmationDialog";
import { toast } from "sonner";
import { Pagination, Stack } from "@mui/material";

export default function ProjectsTabContent() {
    const t = useTranslations("content-management-system.projects");
    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    // Get projects list from API (re-fetches when page/limit changes)
    const {
        data: projectsList,
        isLoading: isLoadingProjectsList,
        isError: isErrorProjectsList,
        error: projectsError,
        refetch: refetchProjectsList
    } = useProjects(page, limit);
    const projects = useMemo(() => projectsList?.data?.payload || [], [projectsList]);
    const totalPages = useMemo(() => projectsList?.data?.pagination?.last_page || 1, [projectsList]);


    const OnEditProject = (id: string) => {
        setEditingProjectId(id);
    }
    const OnDeleteProject = (id: string) => {
        setDeletingProjectId(id);
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
                        dialogProps={{ onSuccess: () => { refetchProjectsList() } }}
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
                <ProjectsGrid OnEditProject={OnEditProject} OnDeleteProject={OnDeleteProject} projects={projects} />
                {/* MUI Pagination - supports RTL automatically */}
                <Stack direction="row" justifyContent="center" mt={3}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, newPage) => setPage(newPage)}
                        color="primary"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Stack>
            </Can>
        </div>
        <Can check={[PERMISSIONS.CMS.projects.update]}>
            <SetProjectDialog
                open={Boolean(editingProjectId)}
                onClose={() => setEditingProjectId(null)}
                projectId={editingProjectId || undefined}
                onSuccess={() => { refetchProjectsList() }}
            />
        </Can>
        <Can check={[PERMISSIONS.CMS.projects.delete]}>
            <DeleteConfirmationDialog
                open={Boolean(deletingProjectId)}
                onClose={() => setDeletingProjectId(null)}
                deleteUrl={`website-projects/${deletingProjectId}`}
                onSuccess={() => {
                    toast.success(t("deleteSuccess"));
                    refetchProjectsList()
                }}
            />
        </Can>
    </>
}
