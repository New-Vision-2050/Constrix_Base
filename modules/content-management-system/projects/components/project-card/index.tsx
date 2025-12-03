import { DropdownButton } from "@/components/shared/dropdown-button";
import { Card, CardContent } from "@/components/ui/card";
import CardImage from "./CardImage";
import CardTitleAndActions from "./CardTitleAndActions";
import { CompanyDashboardIcon } from "@/services/api/company-dashboard/icons/types/response";
import type { MenuItem } from "@/app/[locale]/(main)/companies/cells/execution";

type PropsT = {
    id: string;
    src: string;
    title: string;
    description?: string;
    actions?: MenuItem[];
}
export default function ProjectCard({ id, src, title, description, actions }: PropsT) {
    return (
        <Card className="bg-sidebar border-gray-700 flex flex-col min-h-[320px]">
            <CardContent className="p-4 flex flex-col gap-4">
                {/* card image */}
                <CardImage src={src || ""} />
                {/* card title & actions */}
                <CardTitleAndActions id={id} title={title} actions={actions} />
                {/* card description */}
                <p className="text-sm text-muted-foreground break-words line-clamp-3">
                    {description || ""}
                </p>
            </CardContent>
        </Card>
    );
}