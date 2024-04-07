
import { Button, Container } from "@mui/material";
import { GroupCard } from "../../components/group/GroupCard"

export const GroupsPage: React.FC<{}> = () => {
 
  return (
    <Container sx={{ mt: 9 }} maxWidth="xl">
      <div>
            <h3>You are not part of a group...</h3>
            <Button>Join a group</Button>
            <Button>Create a group</Button>
            <GroupCard title="a" members="3" maxMembers="10"></GroupCard>
      </div>
    </Container>
  );
};