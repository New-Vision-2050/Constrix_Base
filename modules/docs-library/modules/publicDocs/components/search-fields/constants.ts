import { DropdownOption } from './types';

/**
 * Type options for the type dropdown
 */
export const TYPE_OPTIONS: DropdownOption[] = [
  { value: 'all', label: 'الكل' },
  { value: 'active', label: 'نشط' },
  { value: 'inactive', label: 'غير نشط' },
  { value: 'pending', label: 'في الانتظار' },
];

/**
 * Document type options for the document type dropdown
 */
export const DOCUMENT_TYPE_OPTIONS: DropdownOption[] = [
  { value: 'all', label: 'جميع الأنواع' },
  { value: 'contract', label: 'عقد' },
  { value: 'invoice', label: 'فاتورة' },
  { value: 'report', label: 'تقرير' },
  { value: 'certificate', label: 'شهادة' },
  { value: 'license', label: 'رخصة' },
];
