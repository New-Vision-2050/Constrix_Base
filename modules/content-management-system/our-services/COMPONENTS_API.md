# Components API Documentation

## Shared Components

### FormTextField

Generic text field component with validation support.

**Props:**
```typescript
{
  control: Control<T>;        // React Hook Form control
  name: Path<T>;              // Field name
  label: string;              // Field label
  placeholder?: string;       // Placeholder text
  disabled?: boolean;         // Disabled state
  required?: boolean;         // Required field indicator
  multiline?: boolean;        // Enable multiline textarea
  rows?: number;             // Number of rows for textarea
}
```

**Usage:**
```tsx
<FormTextField
  control={control}
  name="mainTitle"
  label="Title"
  placeholder="Enter title"
  required
/>
```

---

### FormSelect

Generic select dropdown with validation support.

**Props:**
```typescript
{
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];    // Array of {value, label}
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}
```

**Usage:**
```tsx
<FormSelect
  control={control}
  name="designType"
  label="Design Type"
  options={[
    { value: "hexagonal", label: "Hexagonal" },
    { value: "circular", label: "Circular" }
  ]}
  required
/>
```

---

## Department Components

### DepartmentHeader

Header section with department number and delete button.

**Props:**
```typescript
{
  departmentIndex: number;
  totalDepartments: number;
  onRemove: () => void;
}
```

---

### DepartmentTitleFields

Arabic and English title input fields in a grid layout.

**Props:**
```typescript
{
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
}
```

---

### DepartmentDescriptionFields

Arabic and English description textarea fields.

**Props:**
```typescript
{
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
}
```

---

### DepartmentDesignTypeField

Design type selector with localized options.

**Props:**
```typescript
{
  control: Control<OurServicesFormData>;
  departmentIndex: number;
  isSubmitting: boolean;
}
```

---

## Main Components

### MainSection

Main section with title and description fields.

**Props:**
```typescript
{
  control: Control<OurServicesFormData>;
  isSubmitting: boolean;
}
```

---

### ServicesGrid

Grid of service input fields (6 services per department).

**Props:**
```typescript
{
  control: Control<OurServicesFormData>;
  services: DepartmentService[];
  departmentIndex: number;
  isSubmitting: boolean;
}
```

---

### DepartmentSection

Complete department section composed of sub-components.

**Props:**
```typescript
{
  control: Control<OurServicesFormData>;
  department: Department;
  departmentIndex: number;
  totalDepartments: number;
  isSubmitting: boolean;
  onRemove: () => void;
}
```

---

### DepartmentsList

Container managing multiple department sections.

**Props:**
```typescript
{
  control: Control<OurServicesFormData>;
  departments: Department[];
  isSubmitting: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
}
```

---

## Type Definitions

### OurServicesFormData
```typescript
{
  mainTitle: string;
  mainDescription: string;
  departments: Department[];
}
```

### Department
```typescript
{
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  designType: string;
  services: DepartmentService[];
}
```

### DepartmentService
```typescript
{
  id: string;
  value: string;
}
```

