import { IconType } from '../types/ItemDetailsTypes';

interface IconProps {
  type: IconType;
  size?: number;
  color?: string;
  className?: string;
}

export default function Icon({ type, size = 20, color = 'currentColor', className = '' }: IconProps) {
  const iconProps = {
    width: size,
    height: size,
    fill: color,
    className: `${className}`,
    viewBox: "0 0 24 24"
  };

  const renderIcon = () => {
    switch (type) {
      case 'plus':
        return (
          <svg {...iconProps}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        );
      
      case 'edit':
        return (
          <svg {...iconProps}>
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        );
      
      case 'trash':
        return (
          <svg {...iconProps}>
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        );
      
      case 'eye':
        return (
          <svg {...iconProps}>
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        );
      
      case 'folder':
        return (
          <svg {...iconProps}>
            <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
          </svg>
        );
      
      case 'close':
        return (
          <svg {...iconProps}>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        );
      
      case 'menu':
        return (
          <svg {...iconProps}>
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        );
      
      default:
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
    }
  };

  return renderIcon();
}
