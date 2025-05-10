
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ListViewSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const ListViewSearch: React.FC<ListViewSearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder="بحث..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="p-2 px-3 rounded-lg  w-full border-2 border-[#EAF2FF38]"
      />
    </div>
  );
};

export default ListViewSearch;
