import React from "react";
import { Outlet } from "react-router-dom";
import  NavBar  from "./Nav";
import "./RootLayout.scss"

/* This shows the NavBar and behind the element passed <RouterLayout> here </RouterLayout> */
export const RouterLayout: React.FC<{}> = () => {
  return(
    <div className="flex-column">
      <NavBar />
      <Outlet />
    </div>
  )
};