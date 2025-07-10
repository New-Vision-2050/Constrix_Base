import AutoHeight from '@/components/animation/auto-height';
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl';
import React from 'react'

interface MainRolesProps {
  allStaticPermissionTypes: string[];
  handleTypeChange: (type: string) => void;
  handleSelectAll: () => void;
  allChecked: boolean;
  isIndeterminate: boolean;
  isTypeSelected: (type: string) => boolean;
}

const MainRoles = ({
    allStaticPermissionTypes,
    handleTypeChange,
    handleSelectAll,
    allChecked,
    isIndeterminate,
    isTypeSelected
}: MainRolesProps) => {
  const t = useTranslations();
  const [isOpen ,setIsOpen] = React.useState(true);
  return (
    <div className='flex flex-col gap-2 pb-4'>
        <div className='flex items-center gap-2 px-8 py-7 bg-sidebar rounded-2xl'>
            <Checkbox
              checked={allChecked ? true : isIndeterminate ? 'indeterminate' : false}
              onCheckedChange={handleSelectAll}
            />
            <Label className='text-base'>{t('RoleTypes.all', { default: 'منح جميع الصلاحيات' })}</Label>
            <div className="flex-1" />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 p-1"
              aria-label={isOpen ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
              type="button"
            >
              {isOpen ? (
                <span className="text-xl">&minus;</span>
              ) : (
                <span className="text-xl">+</span>
              )}
            </button>
        </div>
        <AutoHeight condition={isOpen}>
          <div className="overflow-x-auto bg-sidebar px-8 py-7 rounded-2xl">
            <table className="min-w-full border-separate border-spacing-y-1">
              <thead>
                <tr>
                  <th className="text-right font-medium text-base w-full whitespace-nowrap" style={{width: '100%'}}>الصلاحيات</th>
                {allStaticPermissionTypes.map((role, idx) => (
                  <th key={idx} className="px-2 py-1 text-center font-medium text-base whitespace-nowrap">
                    {t(`RoleTypes.${role}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-right text-sm w-full whitespace-nowrap" style={{width: '100%'}}>{t('RoleTypes.all', { default: 'منح جميع الصلاحيات' })}</td>
                {allStaticPermissionTypes.map((role, idx) => (
                  <td key={idx} className="px-2 py-1 text-center">
                    <Checkbox id={role} checked={isTypeSelected(role)} onCheckedChange={() => handleTypeChange(role)} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        </AutoHeight>
    </div>
  )
}
export default MainRoles
