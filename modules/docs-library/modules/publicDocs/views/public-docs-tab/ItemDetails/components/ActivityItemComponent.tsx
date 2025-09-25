import Icon from './Icon';
import { ActivityItem } from '../types/ItemDetailsTypes';

interface ActivityItemComponentProps {
  item: ActivityItem;
}

export default function ActivityItemComponent({ item }: ActivityItemComponentProps) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
      {/* Activity Icon */}
      <div 
        className="flex-shrink-0 p-2 rounded-full"
        style={{ backgroundColor: `${item.iconColor}20` }}
      >
        <Icon 
          type={item.icon} 
          size={16} 
          color={item.iconColor}
        />
      </div>

      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <div className="text-right">
          <p className="text-white text-sm font-medium mb-1">
            {item.title}
          </p>
          
          <p className="text-gray-300 text-sm mb-2">
            {item.description}
            {item.author && (
              <span className="text-pink-400 font-medium mx-1">
                {item.author}
              </span>
            )}
          </p>
          
          <p className="text-gray-500 text-xs">
            {item.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}
