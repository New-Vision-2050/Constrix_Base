/**
 * Status badge component
 * Displays document access status with appropriate styling
 */
interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'public':
        return {
          label: 'نشط',
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'private':
        return {
          label: 'خاص',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
      case 'shared':
        return {
          label: 'مشارك',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      default:
        return {
          label: 'غير محدد',
          className: 'bg-gray-100 text-gray-600 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`
      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
      ${config.className}
    `}>
      {config.label}
    </span>
  );
};
