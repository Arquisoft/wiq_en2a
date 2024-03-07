import React from "react";
import { Button, Container } from "@mui/material";

export const GroupsPage: React.FC<{}> = () => {
  return (
    <Container sx={{ mt: 9 }} maxWidth="xl">
      <Button fullWidth variant="contained">
       This is the groups page.
      </Button>
    </Container>
  );
};