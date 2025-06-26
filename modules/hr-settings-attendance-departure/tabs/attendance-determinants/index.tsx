import AttendanceDeterminantsContent from "../../components/AttendanceDeterminantsContent";

export default function AttendanceDeterminantsTab() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[20%_80%] gap-2 md:gap-6">
            <div className="px-2">
                <AttendanceDeterminantsContent />
            </div>
            <div className="p-4 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">محتوى المحددات</h2>
                <p>هنا يمكن عرض تفاصيل المحدد المختار</p>
            </div>
        </div>
    );
}