import React from "react";
import { Route, Routes } from "react-router-dom";
import { GamePage } from "./pages/game";
import { GroupsPage } from "./pages/groups";
import { RouterLayout } from "./common/RouterLayout";
import { InitPage } from "./pages/init";
import { ScoreboardPage } from "./pages/scoreboard";
import ProfilePage from "./pages/userProfile";
 
export const AppRouter: React.FC<{}> = () => {
  return (
    <Routes>
      <Route element={<RouterLayout />}>
        /* when accessing /game or the other paths, it will be shown as the  
            outlet inside the RouterLayout*/
        <Route path="/game" element={<GamePage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/scoreboard" element={<ScoreboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="/" element={<InitPage/>} />
    </Routes>
  );
};