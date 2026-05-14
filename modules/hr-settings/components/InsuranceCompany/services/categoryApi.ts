// Mock API for insurance categories using localStorage
// This is a temporary solution until the backend API is provided

const STORAGE_KEY = 'insurance_categories';

// Helper function to safely access localStorage (client-side only)
const isClient = typeof window !== 'undefined';

export interface Category {
  id?: string;
  name: string;
  categoryType: string;
  maxCoverage: string;
  description: string;
}

export const CategoryApi = {
  // Get all categories
  list: (): { data: { payload: Category[] } } => {
    if (!isClient) {
      return { data: { payload: [] } };
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    const categories = stored ? JSON.parse(stored) : [];
    return { data: { payload: categories } };
  },

  // Create a new category
  create: (category: Category): { data: Category } => {
    if (!isClient) {
      throw new Error("Cannot create category on server");
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    const categories = stored ? JSON.parse(stored) : [];

    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };

    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));

    return { data: newCategory };
  },

  // Update a category
  update: (id: string, category: Partial<Category>): { data: Category } => {
    if (!isClient) {
      throw new Error("Cannot update category on server");
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    const categories = stored ? JSON.parse(stored) : [];

    const index = categories.findIndex((c: Category) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...category };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
      return { data: categories[index] };
    }

    throw new Error('Category not found');
  },

  // Delete a category
  delete: (id: string): { data: { success: boolean } } => {
    if (!isClient) {
      throw new Error("Cannot delete category on server");
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    const categories = stored ? JSON.parse(stored) : [];

    const filtered = categories.filter((c: Category) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    return { data: { success: true } };
  },
};
