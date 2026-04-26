import { useSidebar } from "@/components/ui/sidebar";
import ConstrixIcon from "@/public/icons/constrix";
import React from "react";

const SidebarFooterContent = () => {
  const { open } = useSidebar();

  return (
    <>
      <ConstrixIcon
        className="mx-auto mb-10 animate-[sidebar-logo-breathe_4s_ease-in-out_infinite] will-change-transform"
        width={open ? 103 : 30}
      />
      <style jsx>{`
        @keyframes sidebar-logo-breathe {
          0%,
          100% {
            transform: scale(0.74);
          }
          50% {
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default SidebarFooterContent;
