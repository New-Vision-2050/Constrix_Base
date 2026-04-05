import { ItemDetailsData, ICON_COLORS } from '../types/ItemDetailsTypes';

export const mockItemDetailsData: ItemDetailsData = {
  title: 'New Folder',
  icon: 'folder',
  activitySections: [
    {
      id: 'yesterday',
      title: 'أمس',
      items: [
        {
          id: '1',
          type: 'create',
          title: 'تم إنشاء مجلد بواسطة',
          description: 'محمد زكريا',
          author: 'محمد زكريا',
          timestamp: 'أمس 07:32 م',
          icon: 'plus',
          iconColor: ICON_COLORS.create,
        },
        {
          id: '2',
          type: 'edit',
          title: 'تم التعديل على الملف',
          description: '',
          author: '',
          timestamp: 'أمس 07:32 م',
          icon: 'edit',
          iconColor: ICON_COLORS.edit,
        },
      ],
    },
    {
      id: 'two-weeks-ago',
      title: 'من أسبوعين',
      items: [
        {
          id: '3',
          type: 'edit',
          title: 'تم التعديل على الملف',
          description: '',
          author: '',
          timestamp: 'أمس 07:32 م',
          icon: 'edit',
          iconColor: ICON_COLORS.edit,
        },
      ],
    },
  ],
};
