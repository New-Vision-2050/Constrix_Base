import { DropdownButton } from "@/components/shared/dropdown-button";
import CardImage from "./CardImage";
import CardTitleAndActions from "./CardTitleAndActions";

type PropsT = {
    OnEdit: (id: string) => void;
}
export default function ProjectCard({ OnEdit }: PropsT) {
    return (
        <div className="bg-sidebar shadow-md rounded-lg p-4 flex flex-col gap-4 w-[400px] h-[350px]">
            {/* card image */}
            <CardImage />
            {/* card title & actions */}
            <CardTitleAndActions OnEditProject={OnEdit} />
            {/* card description */}
            <p className="text-sm text-muted-foreground">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem odit quasi excepturi, enim quibusdam consequuntur beatae omnis facere. Error asperiores laudantium reiciendis blanditiis autem provident a aliquid fugiat libero tempora!
            </p>
        </div>
    );
}