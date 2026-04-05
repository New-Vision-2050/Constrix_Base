import Icon from './Icon';

interface MoreSectionProps {
  onMoreClick?: () => void;
}

export default function MoreSection({ onMoreClick }: MoreSectionProps) {
  return (
    <div className="mt-auto border-t border-gray-700">
      <button
        onClick={onMoreClick}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
      >
        <span className="text-gray-300 font-medium">
          المزيد
        </span>

        <Icon type="menu" size={20} color="#9CA3AF" />
      </button>
    </div>
  );
}
