import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";

import TopNavUser from "./TopNavUser";
import ResponsiveLogo from "./ResponsiveLogo";
import { ThemeSwitch } from "../ThemeSwitch";

export const TopNavbar = () => {
  return (
    <Navbar className="px-4">
      <NavbarBrand className="flex items-center">
        <div className="ml-2">
          <ResponsiveLogo />
        </div>
      </NavbarBrand>
      <NavbarContent justify="end" className="gap-4"> 
        <ThemeSwitch /> 
        <TopNavUser />
      </NavbarContent>
    </Navbar>
  );
};
