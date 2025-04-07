import UserProfileTableDataMainLayout from "../../UserProfileTableDataMainLayout";
import pdfImg from "@/assets/icons/PDF.png";
import TimeLineItem from "./time-line-item";

export default function UserProfileActivityTimeline() {
  return (
    <UserProfileTableDataMainLayout title="سجل الانشطة">
      <div>
        {/* Timeline Item 1 */}
        <TimeLineItem
          title="تم دفع 12 فاتورة"
          time="منذ 12 دقيقة"
          description="تم دفع الفواتير للشركة."
          pointBgColorClass="bg-pink-500"
          descriptionContent={
            <>
              <img height={20} alt="invoice.pdf" src={pdfImg?.src} />
              <span className="font-medium">invoices.pdf</span>
            </>
          }
        />
        {/* Timeline Item 2 */}
        <TimeLineItem
          title="تم اضافة مستخدم جديد الى الشركة"
          time="منذ 12 دقيقة"
          description="تم تحويل الفاتورة بنجاح"
          pointBgColorClass="bg-green-500"
          descriptionContent={
            <>
              <img height={20} alt="invoice.pdf" src={pdfImg?.src} />
              <span className="font-medium">employee-data.pdf</span>
            </>
          }
        />

        {/* Timeline Item 3 */}
        <TimeLineItem
          title="تم اضافة مستخدم جديد الى الشركة"
          time="منذ 12 دقيقة"
          description="تم تحويل الفاتورة بنجاح"
          pointBgColorClass="bg-blue-500"
          descriptionContent={
            <>
              <img height={20} alt="invoice.pdf" src={pdfImg?.src} />
              <span className="font-medium">employee-data.pdf</span>
            </>
          }
        />

        {/* Timeline Item 4 */}
        <TimeLineItem
          title="تم اضافة مستخدم جديد الى الشركة"
          time="منذ 12 دقيقة"
          description="تم تحويل الفاتورة بنجاح"
          pointBgColorClass="bg-yellow-500"
          descriptionContent={
            <>
              <img height={20} alt="invoice.pdf" src={pdfImg?.src} />
              <span className="font-medium">employee-data.pdf</span>
            </>
          }
        />

        {/* Timeline Item 5 */}
        <TimeLineItem
          title="تم اضافة مستخدم جديد الى الشركة"
          time="منذ 12 دقيقة"
          description="تم تحويل الفاتورة بنجاح"
          pointBgColorClass="bg-red-500"
          descriptionContent={
            <>
              <img height={20} alt="invoice.pdf" src={pdfImg?.src} />
              <span className="font-medium">employee-data.pdf</span>
            </>
          }
        />
      </div>
    </UserProfileTableDataMainLayout>
  );
}
