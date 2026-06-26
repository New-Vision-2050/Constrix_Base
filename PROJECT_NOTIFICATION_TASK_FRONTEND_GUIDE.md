# Project Notification / Task — Frontend Integration Guide

> **Version**: 1.2 (aligned with backend plan v1.3; added mobile engineer APIs and Postman collection Mobile folder)  
> **Scope**: Frontend integration guide for the new **الصيانة والطوارئ** (Maintenance & Emergencies) project-detail tab and its first sub-view **الإشعارات** (Notifications), including the **Add Notification** 5-step wizard.  
> **Backend API reference**: `PROJECT_NOTIFICATION_TASK_IMPLEMENTATION_PLAN.md` (v1.3)  
> **Language**: Arabic UI (RTL) with English translation keys.

> ### How this integrates with our backend (read first)
> - All endpoints live in the **same route group** as the rest of `/api/v1/projects/*` → middleware `auth:api` + `InitializeTenancyByRequestData`. **Your existing API client already sends the Bearer token and tenant context** for project endpoints, so no new auth/tenant wiring is needed — just call the new paths.
> - **Every response uses our standard envelope** (`BasePackage\Shared\Presenters\Json`): single objects come back as `payload: [ {...} ]` (an **array with one element** — read `payload[0]`), lists come back as `payload: [...]` plus a `pagination` object. **There is no `data` key and no `current_page`.** See §3A.
> - The notification's runtime task is a normal `EmployeeTaskRequest`, surfaced to the assigned engineer under **مهام العمل المسندة** (Assigned Work Tasks). Approvals flow through the existing EmployeeTask / ProcedureSetting workflow; the dashboard only mirrors the status. See §10A.

---

## 1. Session Notes

This guide captures the frontend design decisions, reconciled with the backend implementation:

- The tab is **schema-driven and setting-controlled**; the top-level tab **الصيانة والطوارئ** appears only when the backend returns schema `12` for the project's type **and** the project-type setting `is_shown` is `true`. **الإشعارات** is its first sub-view (المخالفات / التقارير / المؤشرات are placeholders for v1).
- The wizard is a **5-step side-modal**: Notification Info → Contractor Info → Location → Assign to Employee → Confirm & Send.
- Step 1 includes a **severity** field (`منخفض` / `متوسط` / `عالي`) rendered as a colored badge in the list.
- **Live employee locations** come from the Attendance module's GPS tracking. The backend returns employees with their latest location, distance (computed server-side via Haversine, in **meters**), and availability status — the frontend only formats/displays.
- **Map integration** is required in steps 3 and 4: step 3 picks the notification location and radius; step 4 shows employee markers with status colors (green = available, orange = busy, red = no location, gray = offline).
- **Distance display** is in meters for < 1 km and kilometers for ≥ 1 km, sorted ascending by default.
- **Single employee selection** (radio). The selected employee and distance are included in the final submission.
- **RTL Arabic UI**; all labels/statuses/validation messages use Arabic with English translation keys.
- **Permissions** (`PROJECT_NOTIFICATION_*`) control visibility of Add, Edit, Delete, Approve, Reject.

---

## 2. Overview

The feature adds a new tab inside the project detail page called **الصيانة والطوارئ** (Maintenance & Emergencies), whose first sub-view is **الإشعارات** (Notifications). This guide covers:

- Adding the schema-driven tab.
- Building the notifications list (against our real response envelope).
- Building the 5-step wizard.
- Integrating maps and live employee locations.
- Formatting and displaying distance.
- Connecting to the backend APIs, real-time events, and the workflow approval flow.

---

## 3. Backend APIs You Will Use

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/project-types/{id}/schemas` | GET | Determine if the project type has schema 12. |
| `/api/v1/project-types/{id}/maintenance-emergency-settings` | GET | Determine if the schema 12 tab is enabled (`is_shown`). |
| `/api/v1/projects/notifications?project_id={id}` | GET | List project notifications. |
| `/api/v1/projects/notifications` | POST | Create a notification (full wizard payload). |
| `/api/v1/projects/notifications/{id}` | GET | Notification detail. |
| `/api/v1/projects/notifications/{id}` | PUT | Update notification (only while pending). |
| `/api/v1/projects/notifications/{id}` | DELETE | Delete notification. |
| `/api/v1/projects/notifications/{id}/approve` | POST | Approve notification. |
| `/api/v1/projects/notifications/{id}/reject` | POST | Reject notification. |
| `/api/v1/projects/notifications/export` | POST | Export notifications. |
| `/api/v1/projects/notifications/employees-with-locations?project_id={id}&latitude={lat}&longitude={lng}` | GET | Load employees with live locations and distances. |
| `/api/v1/projects/employees/project/{id}` | GET | Load assigned project employees (fallback). |
| `/api/v1/employee-tasks/types` | GET | Load employee task types to find `project_notification`. |
| `/api/v1/procedure-settings/approval-responsibles?type=employee_task&form=createProjectNotificationTask` | GET | Preview approvers / auto-approve status. |
| `/api/v1/projects/notifications/my-tasks` | GET | Mobile: list notifications assigned to the current employee (with filters). |
| `/api/v1/projects/notifications/{id}/available-actions` | GET | Mobile: list currently available internal procedure actions (e.g. تأكيد التواجد, تحديث). |
| `/api/v1/projects/notifications/{id}/start` | POST | Mobile: start task / تأكيد استلام. Sends `latitude`, `longitude`, `internal_procedure_setting_id`, `notes`. |
| `/api/v1/projects/notifications/{id}/take-action` | POST | Mobile: record any available internal procedure action (Confirm Presence / Update). Sends `internal_procedure_setting_id`, optional `latitude`, `longitude`, `notes`. |
| `/api/v1/projects/notifications/{id}/end` | POST | Mobile: end task / إنهاء المهمة. Sends `latitude`, `longitude`, `internal_procedure_setting_id`, `notes`. |

> All paths are relative to your existing axios/fetch base (the same client used for `/api/v1/projects`). Do **not** add new auth or tenant handling — the route group already enforces `auth:api` + `InitializeTenancyByRequestData`, and your client already supplies both for project endpoints.
>
> **Postman collection**: `ProjectNotification_API.postman_collection.json` in the project root. It contains 5 folders with working request/response examples: CRUD, Procedure Settings, Internal Procedures & Steps, Employee Task Lifecycle, and Mobile (Employee). Use it as the live API reference when building the frontend.

---

## 3A. Response Envelope & Error Contract (IMPORTANT)

Our backend does **not** return `{ data, meta }`. It uses `BasePackage\Shared\Presenters\Json`. Build your parsing around these exact shapes.

### 3A.1 Single item (`Json::item` / `Json::created`)

`GET /{id}`, `POST` create, `PUT` update, approve/reject all return:

```json
{
  "code": "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
  "message": null,
  "payload": [
    { "id": "uuid", "notification_number": "NTF-2026-00001", "status": "pending", "...": "..." }
  ]
}
```

> ⚠️ `payload` is an **array containing one object**. Read it as `response.data.payload[0]`. Create returns HTTP **201**.

### 3A.2 List (`Json::items`)

`GET /` (list) returns:

```json
{
  "code": "SUCCESS_WITH_LIST_PAYLOAD_OBJECTS",
  "message": null,
  "pagination": {
    "page": 1,
    "next_page": 2,
    "last_page": 5,
    "result_count": 48
  },
  "payload": [ { "...": "..." }, { "...": "..." } ]
}
```

> Pagination keys are `page`, `next_page`, `last_page`, `result_count` — **not** `current_page`/`per_page`. A `X-TOTAL-COUNT` response header also carries `result_count`. `pagination` is omitted when the endpoint returns an unpaginated collection (e.g. employees-with-locations).

### 3A.3 Validation errors (HTTP 422)

```json
{
  "status": "validation_error",
  "message": {
    "type": "validation_errors",
    "code": "...",
    "name": "...",
    "description": "بيانات غير صحيحة",
    "validations": [
      { "field": "magdy_number", "errors": ["حقل رقم المغذي مطلوب"] },
      { "field": "assigned_user_id", "errors": ["..."] }
    ]
  }
}
```

> Map `message.validations[].field` → wizard field, `message.validations[].errors[0]` → the inline error string. (Some endpoints may instead return `payload` with the same `{field, errors}` array shape — handle both.)

### 3A.4 Generic error / delete

- Errors: `{ "status": "error", "message": { "type": "error", "code", "name", "description" } }` — show `message.description`.
- `DELETE` success returns HTTP **204** with empty body.

### 3A.5 A tiny response helper

```javascript
// utils/apiPayload.js
export const one  = (res) => res?.data?.payload?.[0] ?? null;
export const many = (res) => res?.data?.payload ?? [];
export const pagination = (res) => res?.data?.pagination ?? null;

export function fieldErrors(error) {
  const v = error?.response?.data?.message?.validations
         ?? error?.response?.data?.payload
         ?? [];
  return Object.fromEntries(v.map(({ field, errors }) => [field, errors?.[0]]));
}
```

---

## 4. Tab Integration

### 4.1 Schema-Driven Tab

The project detail page already renders tabs from the `ProjectType` schemas endpoint. After the backend seeder adds schema `12 => 'الصيانة والطوارئ'`, the backend returns it in the standard envelope (`payload`, not `data`):

```json
GET /api/v1/project-types/{project_type_id}/schemas
{
  "code": "SUCCESS_WITH_LIST_PAYLOAD_OBJECTS",
  "payload": [
    { "id": 3,  "name": "المرفقات" },
    { "id": 5,  "name": "المعنيين" },
    { "id": 9,  "name": "دورة الوثائق" },
    { "id": 12, "name": "الصيانة والطوارئ" }
  ]
}
```

Additionally, the frontend must call the project-type setting endpoint to know whether the tab is currently enabled:

```json
GET /api/v1/project-types/{project_type_id}/maintenance-emergency-settings
{
  "code": "SUCCESS_WITH_SINGLE_PAYLOAD_OBJECT",
  "payload": [
    { "id": 1, "project_type_id": 123, "is_shown": 1, "created_at": "...", "updated_at": "..." }
  ]
}
```

The endpoint auto-creates the setting with `is_shown = 1` if it does not exist.

### 4.2 Add the Tab

In the project detail page component (e.g., `ProjectDetailPage.vue`):

```vue
<template>
  <Tabs v-model="activeTab">
    <Tab
      v-for="schema in projectSchemas"
      :key="schema.id"
      :name="schema.name"
      :value="schema.id"
      v-if="canShowSchema(schema.id)"
    />
  </Tabs>
</template>

<script setup>
// schemas come from payload[] (see §3A)
const projectSchemas = computed(() => store.projectTypeSchemas);

const MAINTENANCE_SCHEMA_ID = 12;

const maintenanceSetting = ref(null); // load from GET /project-types/{id}/maintenance-emergency-settings

function canShowSchema(schemaId) {
  if (schemaId === MAINTENANCE_SCHEMA_ID) {
    const isEnabled = maintenanceSetting.value?.is_shown === 1 || maintenanceSetting.value?.is_shown === true;
    return isEnabled && hasPermission('PROJECT_NOTIFICATION_LIST');
  }
  return true;
}
</script>
```

### 4.3 Tab Content

When `activeTab === 12`, render the maintenance tab shell with sub-tabs; only the Notifications sub-view is implemented in v1:

```vue
<MaintenanceEmergencyTab :project-id="projectId">
  <!-- v1: Notifications only. Others are placeholders. -->
  <ProjectNotificationsView :project-id="projectId" />
</MaintenanceEmergencyTab>
```

---

## 5. Notifications List View

### 5.1 Component

`resources/js/Pages/Project/Notifications/ProjectNotificationsView.vue`

### 5.2 Layout

- **RTL** layout (Arabic labels on the right, actions on the left).
- Dark theme matching the existing project detail tables.
- Top action bar: Add, Export, Search, Filters, Columns.
- Data table below.

### 5.3 Columns

| Arabic | English Key | Data Field |
|--------|-------------|------------|
| الإجراءات | actions | action buttons |
| عدد المخالفات | violations_count | `violations_count` — **always `0` in v1** (violations entity not built yet; render placeholder) |
| مستوى الجهد / الأهمية | severity | `severity` (badge: `منخفض`/`متوسط`/`عالي`) |
| مشرف المقاول | contractor_supervisor | `contractor_category` |
| المهندس المكلف | assigned_engineer | `assigned_user.name` |
| حالة العطل | issue_type | `notification_type` |
| الموقع | location | `repair_point` |
| المقاول | contractor | `contractor_name` |
| جهة الإسناد | assignment_party | `assignment_party` (branch/management) |
| رقم المغذي | magdy_number | `magdy_number` (electrical **feeder** number, e.g. `FDR-102`) |
| نوع العمل | work_type | `work_type` |
| نوع الإشعار | notification_type | `notification_type` |
| رقم الإشعار | notification_number | `notification_number` |
| المسافة | distance | `selected_distance_meters` → format via `distance_label` if backend provides it |
| حالة الإشعار | status | `status` (badge) |

### 5.4 Status Badges

```vue
const statusConfig = {
  pending:    { label: 'بانتظار الرد', color: 'yellow' },
  approved:   { label: 'مقبول', color: 'green' },
  rejected:   { label: 'مرفوض', color: 'red' },
  in_progress:{ label: 'قيد التنفيذ', color: 'blue' },
  completed:  { label: 'مكتمل', color: 'teal' },
  cancelled:  { label: 'ملغي', color: 'gray' },
};

const severityConfig = {
  'منخفض': { color: 'green'  },
  'متوسط': { color: 'orange' },
  'عالي':  { color: 'red'    },
};
```

### 5.5 Actions

- **View** — always visible.
- **Edit** — only when `status === 'pending'` and user has `PROJECT_NOTIFICATION_UPDATE`.
- **Delete** — only when `status === 'pending'` and user has `PROJECT_NOTIFICATION_DELETE`.
- **Approve / Reject** — only when `status === 'pending'` and user has `PROJECT_NOTIFICATION_UPDATE` **and** is in the workflow responsibles list returned by the approval-responsibles preview endpoint (see §10A).

### 5.6 Filters

- Status dropdown: all, pending, approved, rejected, in_progress, completed, cancelled.
- Notification type dropdown.
- Work type dropdown.
- Date range picker.
- Employee dropdown (assigned user).
- Search text: notification number, contractor name, engineer name.

---

## 6. Wizard Form

### 6.1 Component

`resources/js/Pages/Project/Notifications/CreateProjectNotificationWizard.vue`

### 6.2 State Shape

```javascript
const wizardState = reactive({
  step: 1,
  isSubmitting: false,
  data: {
    // Step 1
    notification_type: '',
    severity: '',            // منخفض / متوسط / عالي
    notification_number: '', // auto-generated by backend, read-only
    magdy_number: '',        // feeder number
    work_type: '',
    work_description: '',

    // Step 2
    contractor_name: '',
    contractor_number: '',
    contractor_technical_number: '',
    contractor_category: '',
    contractor_notes: '',
    contractor_mobile: '',

    // Step 3
    task_latitude: null,
    task_longitude: null,
    location_radius: 250,
    location_link: '',
    repair_point: '',

    // Step 4
    assigned_user_id: null,
    selected_distance_meters: null,
    employees: [], // loaded from API

    // Common
    project_id: props.projectId,
    task_date: new Date().toISOString().split('T')[0],
    duration_hours: 4,
    notes: '',
  },
  errors: {},
  confirmed: {
    dataReviewed: false,
    readyToSend: false,
  },
});
```

### 6.3 Stepper Header

Display 5 steps with Arabic labels and icons:

1. بيانات الإشعار
2. بيانات المقاول
3. الموقع
4. الإسناد لموظف
5. تأكيد الإرسال

Disable future steps until previous steps are valid. Allow going back freely.

### 6.4 Step 1 — Notification Info

Fields:
- **نوع الإشعار** (Notification Type): dropdown, required.
  - Options: `صيانة`, `طوارئ`, `إصلاح عطل`, `فحص`, `تركيب`, `إزالة`.
  - Store in a config file or fetch from backend.
- **مستوى الجهد / الأهمية** (Severity): dropdown, required. Options: `منخفض`, `متوسط`, `عالي`. Maps to `severity`.
- **رقم الإشعار** (Notification Number): **leave empty** — the backend auto-generates it (`NTF-{YEAR}-{seq}`) on create. Do not send it in the payload; show it read-only after creation.
- **رقم المغذي** (Feeder Number): text, required. Maps to `magdy_number`.
- **نوع العمل** (Work Type): text or dropdown, required.
- **وصف العمل** (Work Description): textarea, required.

Validation before Next:
- All required fields filled (`notification_type`, `severity`, `magdy_number`, `work_type`, `work_description`).
- Work description min length 10.

> The notification number is **not** entered by the user and **not** part of the POST payload — the backend generates it via a counter table (see plan §5.5.5). Display it only after the create response returns `payload[0].notification_number`.

### 6.5 Step 2 — Contractor Info

Fields:
- **اسم المقاول** (Contractor Name): text, required.
- **رقم المقاول** (Contractor Number): text, optional.
- **رقم فني المقاول** (Contractor Technical Number): text, optional.
- **فني المقاول** (Contractor Category): text/select, optional.
- **ملاحظات المقاول** (Contractor Notes): textarea, optional.
- **رقم الجوال** (Mobile Number): text with regex validation.

### 6.6 Step 3 — Location

Layout: split screen with map on top and form below (or side-by-side on desktop).

Map component: `ProjectNotificationMap.vue`

Fields:
- **نقطة الإصلاح** (Repair Point): text, required.
- **خط العرض** (Latitude): decimal, required.
- **خط الطول** (Longitude): decimal, required.
- **نطاق الإصلاح** (Repair Radius): integer meters, default 250.
- **رابط الموقع** (Location Link): text, optional.

Map behavior:
- Center on project default location if known.
- On map click, drop a pin and update lat/lng.
- On pin drag, update lat/lng.
- Draw a circle around the pin with radius = `location_radius`.
- Buttons:
  - **نقطة على الخريطة** — drop pin at map center.
  - **رابط من جوال** — parse a Google Maps URL into lat/lng.
- Show success message: **تم تحديد الموقع بنجاح**.

Validation before Next:
- lat/lng within valid ranges.
- radius > 0.
- repair point filled.

### 6.7 Step 4 — Assign to Employee

Layout: split screen — map on left, employee list on right.

Map behavior:
- Center on the notification location pin.
- Show radius circle.
- Load employees via `GET /api/v1/projects/notifications/employees-with-locations?project_id={id}&latitude={lat}&longitude={lng}`. Pass the **step-3 coordinates** so the backend computes per-employee distance. Read the list from `res.data.payload` (no `pagination` on this endpoint — see §3A.2). Each item shape is in plan §7.3: `{ user_id, name, status, status_label, distance_meters, distance_label, last_update, location: {latitude, longitude, accuracy, source}, attendance: {...} }`.
- Render employee markers with status colors:
  - Green: available
  - Orange: busy
  - Red/Pink: no_location
  - Gray: offline
- Click marker to select employee.
- Optional: draw polyline from selected employee to notification location.

Employee list:
- Columns: إسناد (radio), اسم المهندس, الحالة, المسافة, آخر تحديث.
- Sort by distance ascending.
- Filter by status and name.
- Top filters: branch dropdown, status dropdown, search field.
- Status badge with color dot.
- Distance format:
  - < 1000 m: `350 م`
  - >= 1000 m: `1.2 كم`
- Selection: single radio. Store `assigned_user_id` and `selected_distance_meters`.

Validation before Next:
- One employee selected.

Polling: refresh employee locations every 30-60 seconds while step 4 is open.

### 6.8 Step 5 — Confirm & Send

Display summary cards:

```vue
<SummaryCard title="بيانات الإشعار" :fields="[
  { label: 'نوع الإشعار', value: data.notification_type },
  { label: 'الأهمية', value: data.severity },
  { label: 'رقم المغذي', value: data.magdy_number },
  { label: 'وصف العمل', value: data.work_description },
]" />
<!-- رقم الإشعار is shown only AFTER creation (payload[0].notification_number); omit here -->

<SummaryCard title="بيانات المقاول" :fields="[...]" />

<SummaryCard title="الموقع">
  <MiniMap :lat="data.task_latitude" :lng="data.task_longitude" :radius="data.location_radius" />
  <Field label="الإحداثيات" value="{{ data.task_latitude }}, {{ data.task_longitude }}" />
  <Field label="نقطة الإصلاح" value="{{ data.repair_point }}" />
</SummaryCard>

<SummaryCard title="الإسناد" :fields="[
  { label: 'المهندس', value: selectedEmployee.name },
  { label: 'الحالة', value: selectedEmployee.status_label },
  { label: 'المسافة', value: selectedEmployee.distance_label },
]" />
```

Checkboxes:
- **تمت مراجعة البيانات والتأكد من صحتها** (Data reviewed and confirmed).
- **جاهز للإرسال** (Ready to send).

Buttons:
- **السابق** (Previous) — back to step 4.
- **إرسال الإشعار** (Send Notification) — primary, disabled until both checkboxes checked.
- **إلغاء** (Cancel) — close wizard.

On submit:
- Build the payload **without** `notification_number` (backend generates it). Include `severity`. See the full payload in `PROJECT_NOTIFICATION_TASK_IMPLEMENTATION_PLAN.md` §7.1.
- Call `POST /api/v1/projects/notifications`. Expect HTTP **201**.
- Read the created record from `res.data.payload[0]` (see §3A.1) — it contains `id`, `notification_number`, and `status` (`pending` or `approved` depending on the procedure's auto-approve result).
- Show loading state on the button.
- On success: close wizard, show toast, refresh list, optionally open the new notification.
- On **422**: call `fieldErrors(error)` (§3A.5), assign to `wizardState.errors`, and jump to the earliest step that has an error.
- On other errors: show `error.response.data.message.description`.

```javascript
async function submit() {
  try {
    state.isSubmitting = true;
    const { severity, notification_type, magdy_number, work_type, work_description,
            contractor_name, contractor_number, contractor_technical_number,
            contractor_category, contractor_notes, contractor_mobile,
            task_latitude, task_longitude, location_radius, location_link, repair_point,
            assigned_user_id, selected_distance_meters,
            project_id, task_date, duration_hours, notes } = state.data;

    const res = await api.post('/projects/notifications', {
      project_id, notification_type, severity, magdy_number, work_type, work_description,
      contractor_name, contractor_number, contractor_technical_number, contractor_category,
      contractor_notes, contractor_mobile,
      task_latitude, task_longitude, location_radius, location_link, repair_point,
      assigned_user_id, selected_distance_meters,
      task_date, duration_hours, notes,
      // notification_number intentionally omitted — backend generates it
    });

    const created = res.data.payload[0];
    emit('created', created);
  } catch (e) {
    if (e?.response?.status === 422) {
      state.errors = fieldErrors(e);
    } else {
      toast.error(e?.response?.data?.message?.description ?? 'حدث خطأ غير متوقع');
    }
  } finally {
    state.isSubmitting = false;
  }
}
```

---

## 7. Map Components

### 7.1 `ProjectNotificationMap.vue`

Props:
- `latitude`: number
- `longitude`: number
- `radius`: number
- `employees`: array (optional, for step 4)
- `selectedUserId`: string (optional)
- `showEmployees`: boolean

Events:
- `pin-moved`: `{ lat, lng }`
- `employee-selected`: `{ userId }`

Responsibilities:
- Render map using the project's map library (Google Maps / Leaflet).
- Render notification pin and radius circle.
- Render employee markers when `showEmployees` is true.
- Emit events on user interaction.

### 7.2 `EmployeeLocationMarker.vue`

Props:
- `employee`: object with `location`, `status`, `distance_label`, `name`
- `isSelected`: boolean

Render:
- Marker icon colored by status.
- Popup with name, status, distance, last update.

### 7.3 `ProjectNotificationRadiusCircle.vue`

Props:
- `center`: `{ lat, lng }`
- `radius`: number (meters)

Render a circle on the map.

### 7.4 Coordinate Sync

Use two-way binding or watchers:

```javascript
watch(() => [form.task_latitude, form.task_longitude], ([lat, lng]) => {
  mapCenter.value = { lat, lng };
});

function onPinMoved(lat, lng) {
  form.task_latitude = lat;
  form.task_longitude = lng;
  updateLocationLink();
}

function updateLocationLink() {
  form.location_link = `https://maps.google.com/?q=${form.task_latitude},${form.task_longitude}`;
}
```

### 7.5 Parse Google Maps URL

```javascript
function parseGoogleMapsLink(url) {
  const regex = /q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = url.match(regex);
  if (match) {
    form.task_latitude = parseFloat(match[1]);
    form.task_longitude = parseFloat(match[2]);
  }
}
```

---

## 8. Composables / State Management

### 8.1 `useProjectNotifications.js`

Encapsulate list loading, filters, pagination, export, and CRUD operations.

```javascript
import { many, pagination as pag, one } from '@/utils/apiPayload';

export function useProjectNotifications(projectId) {
  const notifications = ref([]);
  // backend pagination keys: page, next_page, last_page, result_count
  const pagination = ref({ page: 1, last_page: 1, result_count: 0 });
  const filters = reactive({ status: '', type: '', search: '', date_from: '', date_to: '' });
  const loading = ref(false);

  async function fetchNotifications(page = pagination.value.page || 1) {
    loading.value = true;
    try {
      const res = await api.get('/projects/notifications', {
        params: { project_id: projectId, ...filters, page },
      });
      notifications.value = many(res);          // res.data.payload
      pagination.value = pag(res) ?? pagination.value; // res.data.pagination
    } finally {
      loading.value = false;
    }
  }

  async function deleteNotification(id) {
    await api.delete(`/projects/notifications/${id}`); // 204 No Content
    await fetchNotifications();
  }

  async function exportNotifications() {
    // POST (per backend route) — expect a binary file
    const res = await api.post('/projects/notifications/export',
      { project_id: projectId, ...filters },
      { responseType: 'blob' },
    );
    // trigger browser download from res.data (Blob)
  }

  return { notifications, pagination, filters, loading, fetchNotifications, deleteNotification, exportNotifications };
}
```

> Note: list params are passed as **query string** on `GET`. Export is a **POST** (matches the backend route `POST /projects/notifications/export`) and returns a binary blob.

### 8.2 `useProjectNotificationWizard.js`

Encapsulate wizard state, validation, step navigation, and submission.

```javascript
export function useProjectNotificationWizard(projectId) {
  const state = reactive({ ... });

  const rules = {
    step1: {
      notification_type: 'required',
      severity: 'required',
      magdy_number: 'required',
      work_type: 'required',
      work_description: 'required|min:10',
    },
    step2: {
      contractor_name: 'required',
      contractor_mobile: 'regex:/^05\d{8}$/',
    },
    step3: {
      task_latitude: 'required|numeric',
      task_longitude: 'required|numeric',
      location_radius: 'required|integer|min:1',
      repair_point: 'required',
    },
    step4: {
      assigned_user_id: 'required',
    },
  };

  function validateStep(step) { ... }
  function nextStep() { if (validateStep(state.step)) state.step++; }
  function prevStep() { if (state.step > 1) state.step--; }
  async function submit() { ... }

  return { state, nextStep, prevStep, submit, validateStep };
}
```

---

## 9. Translations

Add to `resources/js/lang/ar.js`:

```javascript
export default {
  project_notifications: {
    maintenance_tab_title: 'الصيانة والطوارئ',
    tab_title: 'الإشعارات',
    add: 'إضافة إشعار',
    export: 'تصدير',
    search: 'بحث',
    columns: 'الأعمدة',
    map: 'الخريطة',
    filters: 'التصفية',
    wizard_title: 'إضافة إشعار',
    step_1: 'بيانات الإشعار',
    step_2: 'بيانات المقاول',
    step_3: 'الموقع',
    step_4: 'الإسناد لموظف',
    step_5: 'تأكيد الإرسال',
    notification_type: 'نوع الإشعار',
    severity: 'الأهمية',
    severity_low: 'منخفض',
    severity_medium: 'متوسط',
    severity_high: 'عالي',
    notification_number: 'رقم الإشعار',
    magdy_number: 'رقم المغذي',
    work_type: 'نوع العمل',
    work_description: 'وصف العمل',
    contractor_name: 'اسم المقاول',
    contractor_number: 'رقم المقاول',
    contractor_technical_number: 'رقم فني المقاول',
    contractor_category: 'فني المقاول',
    contractor_notes: 'ملاحظات المقاول',
    contractor_mobile: 'رقم الجوال',
    repair_point: 'نقطة الإصلاح',
    latitude: 'خط العرض',
    longitude: 'خط الطول',
    location_radius: 'نطاق الإصلاح',
    location_link: 'رابط الموقع',
    drop_pin: 'نقطة على الخريطة',
    parse_link: 'رابط من جوال',
    location_confirmed: 'تم تحديد الموقع بنجاح',
    assign_employee: 'الإسناد لموظف',
    engineer_name: 'اسم المهندس',
    status: 'الحالة',
    distance: 'المسافة',
    last_update: 'آخر تحديث',
    select: 'إسناد',
    confirm_data: 'تمت مراجعة البيانات والتأكد من صحتها',
    ready_to_send: 'جاهز للإرسال',
    send: 'إرسال الإشعار',
    cancel: 'إلغاء',
    previous: 'السابق',
    next: 'التالي',
    statuses: {
      pending: 'بانتظار الرد',
      approved: 'مقبول',
      rejected: 'مرفوض',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي',
    },
    employee_statuses: {
      available: 'متاح',
      busy: 'مشغول',
      offline: 'غير متصل',
      no_location: 'لا يوجد موقع',
      available_far: 'متاح - بعيد',
    },
  },
};
```

Add English equivalents to `resources/js/lang/en.js`.

---

## 10. Permissions

There are **two** permission layers (matching the backend, see plan §5.2.3):

1. **Global** keys (route-level) — what you check in the UI for showing global actions:
   - `PROJECT_NOTIFICATION_LIST`, `PROJECT_NOTIFICATION_VIEW`, `PROJECT_NOTIFICATION_CREATE`, `PROJECT_NOTIFICATION_UPDATE`, `PROJECT_NOTIFICATION_DELETE`, `PROJECT_NOTIFICATION_EXPORT`.
2. **Project-scoped** keys (per-project role) — fetched via `GET /api/v1/projects/{project_id}/my-permissions/flat`. Use these when the user's access depends on their role *inside this specific project*.

```javascript
const canCreate = computed(() => hasPermission('PROJECT_NOTIFICATION_CREATE'));
const canUpdate = computed(() => hasPermission('PROJECT_NOTIFICATION_UPDATE'));
const canDelete = computed(() => hasPermission('PROJECT_NOTIFICATION_DELETE'));
const canExport = computed(() => hasPermission('PROJECT_NOTIFICATION_EXPORT'));

// project-scoped (optional, when role is per-project):
// const projectPerms = await api.get(`/projects/${projectId}/my-permissions/flat`);
```

Hide buttons or show disabled tooltips when permission is missing. The backend still enforces both layers, so the UI checks are for UX only.

---

## 10A. Workflow, Approval & Real-Time Integration

This is the part that ties the dashboard to our existing **مهام العمل المسندة** (EmployeeTask) engine. The notification is just dashboard metadata; the actual task + approval lives in `EmployeeTaskRequest` + `ProcedureSetting`/`Process`.

### 10A.1 Auto-approve vs manual approval (preview before submit, optional)

Before/at submit, you can preview whether the notification will be auto-approved or needs a manual approver:

```
GET /api/v1/procedure-settings/approval-responsibles?type=employee_task&form=createProjectNotificationTask
```

- If it returns **no responsibles / auto-approve = true** → after create, the returned `payload[0].status` is `approved` and the engineer is notified immediately.
- If it returns responsibles → status comes back `pending` and stays pending until an approver acts. Use this list to decide whether to show **Approve/Reject** buttons to the current user.

### 10A.2 Approve / Reject from the dashboard

```
POST /api/v1/projects/notifications/{id}/approve
POST /api/v1/projects/notifications/{id}/reject   body: { "reason": "..." }
```

Both return the updated notification (`payload[0]`). Under the hood the backend drives the EmployeeTask workflow step; the `notification.status` is kept in sync with the task status by a backend observer. **The frontend should re-read the row (or use the websocket events below) rather than guessing the next state.**

### 10A.3 Status is a mirror of the task

`notification.status` values: `pending` → `approved`/`rejected` → `in_progress` → `completed`/`cancelled`. These mirror the linked `EmployeeTaskRequest`. Treat the notification row as **read-mostly** after creation: editing is only allowed while `pending`.

### 10A.4 Real-time (Reverb / Laravel Echo)

The assigned **engineer** receives live updates on these existing EmployeeTask channels (verified event/channel names):

| Channel | Event (`broadcastAs`) | Payload purpose |
|---------|-----------------------|-----------------|
| `employee-task.notification.{userId}` | `employee-task.notification` | New/updated task for the engineer |
| `employee-task.inbox-counts.{userId}` | `employee-task.inbox-counts` | Inbox badge count refresh |

```javascript
// engineer's app (مهام العمل المسندة inbox)
echo.channel(`employee-task.notification.${userId}`)
    .listen('.employee-task.notification', () => refreshTasks());

echo.channel(`employee-task.inbox-counts.${userId}`)
    .listen('.employee-task.inbox-counts', (e) => setInboxCount(e.count));
```

> Note the leading dot in `.listen('.employee-task.notification', ...)` — required because the backend sets a custom `broadcastAs` name.
>
> For the **dashboard** notifications list there is no dedicated broadcast in v1; refresh the list after approve/reject, or poll. If you need live dashboard updates, raise it with backend to add a channel.

---

## 10B. Mobile Engineer APIs

The assigned engineer interacts with the notification through the same **مهام العمل المسندة** (Assigned Work Tasks) infrastructure, but the mobile app can also use dedicated project-notification endpoints under `/projects/notifications`:

- `GET /projects/notifications/my-tasks` — same filters as the dashboard list, but restricted to the current employee's `assigned_user_id`.
- `GET /projects/notifications/{id}/available-actions` — returns the currently unlocked internal procedure actions (form + `internal_procedure_setting_id`).
- `POST /projects/notifications/{id}/start` — records `startProjectNotificationTask` (تأكيد استلام) and starts the task session.
- `POST /projects/notifications/{id}/take-action` — records any available action such as `confirmProjectNotificationPresence` (تأكيد التواجد) or `updateProjectNotificationTask` (تحديث). Payload includes `internal_procedure_setting_id` and optional `latitude`/`longitude`.
- `POST /projects/notifications/{id}/end` — records `endProjectNotificationTask` (إنهاء المهمة) and completes the task like a normal employee-task end.

All mobile endpoints reuse the linked `EmployeeTaskRequest`, so status, sessions, and workflow behavior are identical to the employee-task mobile app. The Postman collection has a dedicated **Mobile (Employee)** folder with example payloads and response bodies for each endpoint.

---

## 11. Routes

No new route needed if the tab is rendered inside the existing project detail route. The wizard is a modal.

If you want a standalone detail page:

```javascript
{
  path: '/projects/:projectId/notifications/:notificationId',
  name: 'ProjectNotificationDetail',
  component: ProjectNotificationDetailView,
}
```

---

## 12. Error Handling

### 12.1 Validation Errors

Backend returns **HTTP 422** with the shape in §3A.3 — a `message.validations` array of `{ field, errors }` (some endpoints use `payload` with the same shape). Use the `fieldErrors()` helper (§3A.5) to map them to wizard fields (e.g., `magdy_number`, `severity`, `task_latitude`, `assigned_user_id`), then jump to the earliest step containing an error.

### 12.2 Network Errors

Show retry button or auto-retry once. Display user-friendly Arabic message.

### 12.3 Permission Errors

If the user lacks permission to create, show a message: **ليس لديك صلاحية لإنشاء إشعارات في هذا المشروع**.

---

## 13. Performance Considerations

- Debounce search input (300ms).
- Paginate list (default 10-15 per page).
- Use virtual scrolling for employee list if > 50 employees.
- Limit map tracking points to last 4 per employee (backend already does this).
- Cache employee locations for the duration of step 4; refresh only when user clicks refresh or every 30 seconds.
- Lazy-load map library if not already loaded.

---

## 14. Testing Checklist

- [ ] Tab **الصيانة والطوارئ** appears only when schema `12` is in project type schemas (`payload[]`) **and** `GET /project-types/{id}/maintenance-emergency-settings` returns `is_shown = 1`.
- [ ] Tab hidden when user lacks `PROJECT_NOTIFICATION_LIST` or when `is_shown = 0`.
- [ ] List reads `res.data.payload` and `res.data.pagination.page/last_page/result_count` (not `data`/`current_page`).
- [ ] Wizard opens and closes correctly.
- [ ] Step 1 validation blocks Next if required fields (incl. `severity`) are empty.
- [ ] `notification_number` is NOT sent on create and is shown only from the create response.
- [ ] Step 3 map pin updates lat/lng inputs.
- [ ] Step 3 location link parsing works.
- [ ] Step 4 loads employees with locations from `payload[]` and sorts by distance ascending.
- [ ] Selecting an employee updates summary in step 5.
- [ ] Submit returns 201; new record read from `payload[0]`; list refreshes.
- [ ] 422 maps `validations[]` to the right fields and jumps to the offending step.
- [ ] Export (`POST`) downloads the file (blob).
- [ ] Approve/Reject re-reads the row; status badge updates.
- [ ] Engineer receives the task in **مهام العمل المسندة** (websocket inbox refresh).
- [ ] RTL layout is correct.
- [ ] Mobile responsiveness (wizard becomes full-screen modal).

---

## 15. Common Pitfalls

1. **Coordinate precision**: Use `parseFloat` and round to 6-8 decimal places for display.
2. **Distance formatting**: Convert meters to km only when >= 1000 m.
3. **Map re-renders**: Avoid re-rendering the entire map when employee list updates; update markers only.
4. **Stale locations**: Show `last_update` clearly so users know data may be stale.
5. **Single employee selection**: Ensure the radio group clears selection if the user goes back and changes location (which may change distance sorting).
6. **Auto-generated number**: Do not allow editing the notification number unless the backend explicitly supports it.
7. **Procedure workflow**: The wizard should not block on manual approval; after submission, the notification stays `pending` until approved.

---

## 16. File Location Summary

| File | Path | Purpose |
|------|------|---------|
| Maintenance Tab Shell | `resources/js/Pages/Project/Maintenance/MaintenanceEmergencyTab.vue` | Schema-12 tab host; sub-tabs (notifications + placeholders) |
| Response helper | `resources/js/utils/apiPayload.js` | `one()/many()/pagination()/fieldErrors()` for our envelope |
| List View | `resources/js/Pages/Project/Notifications/ProjectNotificationsView.vue` | Notifications sub-view content |
| Wizard | `resources/js/Pages/Project/Notifications/CreateProjectNotificationWizard.vue` | 5-step wizard |
| Map | `resources/js/Pages/Project/Notifications/ProjectNotificationMap.vue` | Reusable map with pin + radius |
| Marker | `resources/js/Pages/Project/Notifications/EmployeeLocationMarker.vue` | Employee marker component |
| Circle | `resources/js/Pages/Project/Notifications/ProjectNotificationRadiusCircle.vue` | Radius circle |
| Badge | `resources/js/Pages/Project/Notifications/ProjectNotificationStatusBadge.vue` | Status badge |
| Composable (List) | `resources/js/composables/useProjectNotifications.js` | List state + API |
| Composable (Wizard) | `resources/js/composables/useProjectNotificationWizard.js` | Wizard state + validation |
| Translations | `resources/js/lang/ar.js`, `resources/js/lang/en.js` | Arabic/English labels |
| Backend Plan | `PROJECT_NOTIFICATION_TASK_IMPLEMENTATION_PLAN.md` | Backend architecture |
| Frontend Guide | `PROJECT_NOTIFICATION_TASK_FRONTEND_GUIDE.md` | This file |
