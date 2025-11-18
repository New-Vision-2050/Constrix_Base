import { DropdownButton } from "@/components/shared/dropdown-button";
import { Card, CardContent } from "@/components/ui/card";
import CardImage from "./CardImage";
import CardTitleAndActions from "./CardTitleAndActions";

type PropsT = {
    OnEdit: (id: string) => void;
}
export default function ProjectCard({ OnEdit }: PropsT) {
    return (
        <Card className="bg-sidebar border-gray-700 flex flex-col min-h-[320px]">
            <CardContent className="p-4 flex flex-col gap-4">
                {/* card image */}
                <CardImage />
                {/* card title & actions */}
                <CardTitleAndActions OnEditProject={OnEdit} />
                {/* card description */}
                <p className="text-sm text-muted-foreground">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem odit quasi excepturi, enim quibusdam consequuntur beatae omnis facere. Error asperiores laudantium reiciendis blanditiis autem provident a aliquid fugiat libero tempora!
                </p>
            </CardContent>
        </Card>
    );
}