import type { ReactNode, MouseEvent } from "react";
import { useState } from "react";

import { Menu, MenuProps } from "@mui/material";

type MenuActions = {
  onClick: (event: MouseEvent<HTMLElement>) => void;
  onClose: () => void;
  open: boolean;
};

type CustomMenuProps = {
  renderAnchor: (props: MenuActions) => ReactNode;
  closeOnSelect?: boolean;
  menuProps?: Partial<MenuProps> | ((props: MenuActions) => Partial<MenuProps>);
  children: ReactNode;
};

const CustomMenu = ({ renderAnchor, children, menuProps }: CustomMenuProps) => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const menuActions: MenuActions = {
    onClick: handleClick,
    onClose: handleClose,
    open,
  };

  // Support menuProps as function or object
  const resolvedMenuProps =
    typeof menuProps === "function" ? menuProps(menuActions) : menuProps || {};

  return (
    <>
      {/* Anchor Element rendered via render function */}
      {renderAnchor(menuActions)}

      {/* MUI Menu */}
      <Menu
        {...resolvedMenuProps}
        anchorEl={anchorElement}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        {children}
      </Menu>
    </>
  );
};

export default CustomMenu;
