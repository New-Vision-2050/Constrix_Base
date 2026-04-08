import type { PendingShareInvitation } from "@/services/api/projects/project-sharing/types/response";

/**
 * Local toggle: set to `true` to load mock rows without env vars. Set back to `false`
 * before committing.
 */
export const INBOX_FORCE_MOCK = false;

export function inboxUsesMockData(): boolean {
  if (INBOX_FORCE_MOCK) return true;
  if (typeof process === "undefined") return false;
  const v = process.env.NEXT_PUBLIC_INBOX_MOCK;
  return v === "true" || v === "1";
}

/** Sample invitations for UI / widget / dialog testing (accept/reject still hit the real API). */
export function getMockPendingInvitations(): PendingShareInvitation[] {
  return [
    {
      id: "mock-inv-1",
      status: "pending",
      created_at: "2024-06-15T10:00:00.000Z",
      shareable_type: "App\\Models\\Project",
      shareable_id: "p-100",
      schema_ids: [1, 3, 6],
      notes:
        "طلب مشاركة لمتابعة أقسام المشروع. تم اعتماد المستند والموافقة على التعليمات الأولية.",
      owner_company: { id: "c1", name: "شركة نيو فيجن" },
      shared_by: { id: "u1", name: "أحمد محمد" },
      project: {
        id: 100,
        serial_number: "NV-fdsf",
        ref_number: "REF-2024-001",
        name: "مشروع العقد الموحد لشركة الكهرباء",
        client_name: "شركة الكهرباء",
        responsible_employee_name: "سارة علي",
        manager_name: "خالد حسن",
      },
    },
    {
      id: "mock-inv-2",
      status: "pending",
      created_at: "2024-05-22T08:30:00.000Z",
      shareable_type: "attachment",
      shareable_id: "att-55",
      schema_ids: [2, 4],
      notes: "مرفقات إضافية للعقد.",
      owner_company: { id: "c2", name: "مؤسسة البناء الحديث" },
      shared_by: { id: "u2", name: "ليلى عمر" },
      project: {
        id: 55,
        serial_number: "MB-8821",
        ref_number: "REF-8821",
        name: "طلب تمديد عقد مقابلة",
        client_name: "عميل داخلي",
        responsible_employee_name: "محمود كمال",
      },
    },
    {
      id: "mock-inv-3",
      status: "accepted",
      created_at: "2024-04-01T12:00:00.000Z",
      shareable_type: "App\\Models\\Project",
      shareable_id: "p-77",
      schema_ids: [1, 2, 7, 8],
      notes: null,
      owner_company: { id: "c3", name: "شركة التوريدات" },
      shared_by: { id: "u3", name: "نورا سعيد" },
      project: {
        id: 77,
        serial_number: "TS-100",
        ref_number: "REF-100",
        name: "مشروع صيانة دوري",
        responsible_employee_name: "هشام فؤاد",
      },
    },
    {
      id: "mock-inv-4",
      status: "rejected",
      created_at: "2024-03-10T09:15:00.000Z",
      shareable_type: "quote",
      shareable_id: "q-12",
      schema_ids: [3],
      notes: "عرض سعر قديم.",
      owner_company: { id: "c4", name: "مكتب الاستشارات" },
      shared_by: { id: "u4", name: "ياسر إبراهيم" },
      project: {
        id: 12,
        serial_number: "Q-12",
        ref_number: "REF-Q12",
        name: "عرض سعر توريد معدات",
        responsible_employee_name: "دينا محمود",
      },
    },
    {
      id: "mock-inv-5",
      status: "sent",
      created_at: "2024-06-20T14:45:00.000Z",
      shareable_type: "request",
      shareable_id: "req-3",
      schema_ids: [5, 6],
      notes: "طلب الوصول إلى أوامر العمل والكادر.",
      owner_company: { id: "c5", name: "جهة خارجية" },
      shared_by: { id: "u5", name: "منى رشاد" },
      project: {
        id: 3,
        serial_number: "RQ-003",
        ref_number: "REF-RQ3",
        name: "طلب صلاحيات إضافية",
        responsible_employee_name: "عمر الصفتي",
      },
    },
  ];
}
