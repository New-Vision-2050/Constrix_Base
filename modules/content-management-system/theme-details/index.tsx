import { ThemeData } from "../themes/types";

interface PropsT {
    initialData: ThemeData;
}
export default function ThemeDetailView({ initialData: ThemeDetailData }: PropsT) {
    return (
        <div>
            <h1>{ThemeDetailData.title}</h1>
            <p>{ThemeDetailData.description}</p>
            <p>{ThemeDetailData.about}</p>
            <p>{ThemeDetailData.is_default}</p>
            <p>{ThemeDetailData.status}</p>
            <p>{ThemeDetailData.main_image}</p>
            <p>{ThemeDetailData.created_at}</p>
            <p>{ThemeDetailData.updated_at}</p>
            <p>{ThemeDetailData.departments?.map((department) => department.name).join(", ")}</p>
        </div>
    );
}