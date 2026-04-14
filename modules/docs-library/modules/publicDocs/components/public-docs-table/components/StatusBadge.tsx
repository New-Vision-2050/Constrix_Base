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
          className: 'bg-primary/10 text-primary border-primary/20'
        };
      case 'private':
        return {
          label: 'خاص',
          className: 'bg-muted text-muted-foreground border-border'
        };
      case 'shared':
        return {
          label: 'مشارك',
          className: 'bg-accent text-accent-foreground border-border'
        };
      default:
        return {
          label: 'غير محدد',
          className: 'bg-muted text-muted-foreground border-border'
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
