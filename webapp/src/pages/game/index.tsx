import React from "react";
import Game from "../../components/Game";
import { Container } from "@mui/material";

export const GamePage: React.FC<{}> = () => {
  return (
    <Container sx={{ mt: 9 }} maxWidth="xl">
      <Game/>
    </Container>
  );
};