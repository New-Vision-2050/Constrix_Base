import React from "react";
import { Icon } from "@iconify/react";

type DropdownIconProps = {
  open: boolean;
  size?: number;
};

const DropdownIcon: React.FC<DropdownIconProps> = ({ open, size }) => {
  return (
    <Icon
      icon="mdi:chevron-down"
      style={{
        transition: "transform 0.3s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
      fontSize={size}
    />
  );
};

export default DropdownIcon;
