// ============================================================================
// Search Component Types
// ============================================================================

export type SearchProps = {
  search: {
    search: string;
    setSearch: (search: string) => void;
  };
  placeholder?: string;
};
