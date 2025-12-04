/**
 * Department interface
 * Represents a department associated with a theme
 */
export interface ThemeDepartment {
  id: string;
  name: string;
  created_at: string;
}

/**
 * Theme interface
 * Represents a website theme with all its properties
 */
export interface Theme {
  id: string;
  title: string;
  description: string;
  about: string;
  is_default: 0 | 1;
  status: 0 | 1;
  main_image: string;
  created_at: string;
  updated_at: string;
  departments?: ThemeDepartment[];
}

