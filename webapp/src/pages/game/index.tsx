import React from "react";
import { Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

export const GamePage: React.FC<{}> = () => {
  return (
    <Container sx={{ mt: 9 }} maxWidth="xl">
    <Button component={Link} to="/game/single-player" variant="contained" color="primary">
      Single Player
    </Button>
    <Button component={Link} to="/game/multiplayer" variant="contained" color="secondary">
      Multiplayer
    </Button>
  </Container>
  );
};