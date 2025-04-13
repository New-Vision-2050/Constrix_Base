import { Button } from "@/components/ui/button";
import SingleQualificationData from "./SingleQualificationData";

export default function UserQualificationData() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">المؤهل</p>
        <Button>اضافة مؤهل</Button>
      </div>
      <SingleQualificationData title="مؤهل 1"/>
      <SingleQualificationData title="مؤهل 2"/>
      <SingleQualificationData title="مؤهل 3"/>
    </div>
  );
}
