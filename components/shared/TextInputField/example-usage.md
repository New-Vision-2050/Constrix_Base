# TextInputField Component

## Basic Usage

```tsx
import { useState } from 'react';
import TextInputField from '@/components/shared/TextInputField';

export default function ExampleForm() {
  const [name, setName] = useState('');
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  
  return (
    <div className="space-y-6 p-4">
      <TextInputField 
        label="الاسم"
        value={name}
        onChange={handleNameChange}
        placeholder="أدخل الاسم"
        required
        dir="rtl"
      />
      
      {/* With error message */}
      <TextInputField 
        label="البريد الإلكتروني"
        value=""
        onChange={() => {}}
        placeholder="أدخل البريد الإلكتروني"
        error="البريد الإلكتروني مطلوب"
        dir="ltr"
      />
      
      {/* Disabled field */}
      <TextInputField 
        label="الرقم المرجعي"
        value="REF-12345"
        onChange={() => {}}
        disabled
      />
    </div>
  );
}
```

## Available Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| label | string | Yes | - | Label text for the input field |
| value | string | Yes | - | Current value of the input |
| onChange | function | Yes | - | Function to handle value changes |
| placeholder | string | No | '' | Placeholder text for the input |
| name | string | No | - | Name attribute for the input |
| required | boolean | No | false | Whether the field is required |
| disabled | boolean | No | false | Whether the field is disabled |
| error | string | No | - | Error message to display |
| className | string | No | '' | Additional CSS classes |
| dir | 'rtl' \| 'ltr' \| 'auto' | No | 'auto' | Text direction |
