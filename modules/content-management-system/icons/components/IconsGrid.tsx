import ProjectCard from "../../projects/components/project-card";
import { CompanyDashboardIcon } from "@/services/api/company-dashboard/icons/types/response";
import { Card, CardContent } from "@/components/ui/card";
import type { MenuItem } from "@/app/[locale]/(main)/companies/cells/execution";
import { EditIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type PropsT = {
    OnEdit: (id: string) => void;
    OnDelete: (id: string) => void;
    icons: CompanyDashboardIcon[]
    isLoading: boolean
}

// Skeleton Card Component with shimmer effect
const IconCardSkeleton = () => {
    return (
        <Card className="bg-sidebar border-gray-700 flex flex-col min-h-[320px] shadow-lg overflow-hidden relative">
            <CardContent className="p-4 flex flex-col gap-4">
                {/* Image skeleton with shimmer */}
                <div className="w-full h-[150px] relative overflow-hidden rounded-lg bg-gray-800/30">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-700/30 to-transparent"
                        style={{
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s infinite linear'
                        }}
                    />
                </div>

                {/* Title & Actions skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-8 w-48 bg-gray-700/40 rounded-md relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent"
                            style={{
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite linear',
                                animationDelay: '0.2s'
                            }}
                        />
                    </div>
                    <div className="h-10 w-20 bg-gray-700/40 rounded-md relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent"
                            style={{
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite linear',
                                animationDelay: '0.4s'
                            }}
                        />
                    </div>
                </div>

                {/* Description skeleton */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-700/40 rounded-md relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent"
                            style={{
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite linear',
                                animationDelay: '0.6s'
                            }}
                        />
                    </div>
                    <div className="h-4 w-full bg-gray-700/40 rounded-md relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent"
                            style={{
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite linear',
                                animationDelay: '0.8s'
                            }}
                        />
                    </div>
                    <div className="h-4 w-3/4 bg-gray-700/40 rounded-md relative overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent"
                            style={{
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite linear',
                                animationDelay: '1s'
                            }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};


const IconsGridLoader = () => {
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
                <IconCardSkeleton key={`skeleton-${index}`} />
            ))}
        </div>
    );
};

export default function IconsGrid({ OnEdit, OnDelete, icons, isLoading }: PropsT) {
    const t = useTranslations("content-management-system.icons");

    const iconActions: MenuItem[] = [
        {
            label: "Edit",
            icon: <EditIcon className="w-4 h-4" />,
            disabled: true,
            action: (row: { id: string }) => {
                OnEdit(row.id);
            },
        },
        {
            label: "Delete",
            icon: <TrashIcon className="w-4 h-4" />,
            disabled: true,
            action: (row: { id: string }) => {
                OnDelete(row.id);
            },
        },
    ];

    if (isLoading) {
        return <IconsGridLoader />;
    }

    if (icons.length === 0 && !isLoading) {
        return (
            <div className="w-full flex items-center justify-center py-20">
                <p className="text-gray-400 text-center text-lg">
                    {t("noIconsFound")}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {icons.map((icon) => {
                return (
                    <ProjectCard
                        key={icon.id}
                        id={icon.id}
                        title={icon.name_ar}
                        src={icon.icon}
                        actions={iconActions}
                    />
                );
            })}
        </div>
    );
}