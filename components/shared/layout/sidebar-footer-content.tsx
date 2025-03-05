import { useSidebar } from "@/components/ui/sidebar";
import ConstrixIcon from "@/public/icons/constrix";
import React from "react";

const SidebarFooterContent = () => {
  const { open } = useSidebar();

  return (
    <>
      <ConstrixIcon
        className="mx-auto mb-10 transition-[width] ease-linear duration-200"
        width={open ? 103 : 30}
      />
    </>
  );
};

export default SidebarFooterContent;
