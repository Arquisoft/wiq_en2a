import React from "react";
import { Route, Routes } from "react-router-dom";
import { GamePage } from "./pages/game";
import { GroupsPage } from "./pages/groups";
import { RouterLayout } from "./common/RouterLayout";
import { InitPage } from "./pages/init";
 
export const AppRouter: React.FC<{}> = () => {
  return (
    <Routes>
      <Route element={<RouterLayout />}>
        <Route path="/game" element={<GamePage />} />
        <Route path="/groups" element={<GroupsPage />} />
      </Route>
      <Route path="/" element={<InitPage/>} />
    </Routes>
  );
};