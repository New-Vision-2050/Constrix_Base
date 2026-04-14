import Icon from './Icon';
import { ActivityItem } from '../types/ItemDetailsTypes';

interface ActivityItemComponentProps {
  item: ActivityItem;
}

export default function ActivityItemComponent({ item }: ActivityItemComponentProps) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
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

      <div className="flex-1 min-w-0">
        <div className="text-right">
          <p className="text-foreground text-sm font-medium mb-1">
            {item.title}
          </p>
          
          <p className="text-muted-foreground text-sm mb-2">
            {item.description}
            {item.author && (
              <span className="text-primary font-medium mx-1">
                {item.author}
              </span>
            )}
          </p>
          
          <p className="text-muted-foreground/70 text-xs">
            {item.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
}
