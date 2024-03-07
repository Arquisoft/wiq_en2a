import React from "react";
import { Button, Container } from "@mui/material";

export const ScoreboardPage: React.FC<{}> = () => {
  return (
    <Container sx={{ mt: 9 }} maxWidth="xl">
      <Button fullWidth variant="contained">
       This is the scoreboard page.
      </Button>
    </Container>
  );
};