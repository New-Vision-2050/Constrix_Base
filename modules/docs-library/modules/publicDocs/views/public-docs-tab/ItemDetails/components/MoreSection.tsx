import Icon from './Icon';

interface MoreSectionProps {
  onMoreClick?: () => void;
}

export default function MoreSection({ onMoreClick }: MoreSectionProps) {
  return (
    <div className="mt-auto border-t border-border">
      <button
        onClick={onMoreClick}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <span className="text-muted-foreground font-medium">
          المزيد
        </span>

        <Icon type="menu" size={20} color="currentColor" className="text-muted-foreground" />
      </button>
    </div>
  );
}
