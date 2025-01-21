import React from 'react';
import { Button } from '@trussworks/react-uswds'

interface ButtonProps {
  onClick?: () => void;
  outline?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

const NavButton: React.FC<ButtonProps> = ({
  onClick,
  outline = false,
  disabled,
  className = "optimistic_blue",
  children,
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className} uppercase font-heading`}
      {...(outline ? { outline: true } : {})}
    >
      {children}
    </Button>
  );
};

export default NavButton;