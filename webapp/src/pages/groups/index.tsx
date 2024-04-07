
import { Button, Container, Snackbar, TextField, Grid, Stack, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { GroupCard } from "../../components/group/GroupCard"
import  { ChangeEvent, useState } from 'react';
import axios from 'axios';
import "./groups-page.scss";

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const GroupsPage: React.FC<{}> = () => {
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [public0, setPublic] = useState(true);
  const [maxMembers, setMaxMembers] = useState(2);

  const toggleModal = () => {
    setModal(!modal);
  };

  const findGroups = async () =>{
    try{
      const groups = await axios.get(`${apiEndpoint}/getGroups`);
      console.log(groups);
    }catch (error:any) {
      setError(error.response.data.error);
    }
  }

  const handleChange = ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
      setMaxMembers(curr => {
          if (!Boolean(value)) { return 0; }
          const numeric = parseInt(value, 10);

          if (value.length > 100) {
              return curr;
          }

          return (value.length <= 100 ? numeric : curr);
      });
    };
  
 
  return (
    <Container sx={{ mt: 9 }} maxWidth="xl">
      <div>
            <h3>You are not part of a group...</h3>
            <Button onClick={findGroups}>Join a group</Button>
            <Button onClick={toggleModal}>Create a group</Button>
            <GroupCard title="a" members="3" maxMembers="10"></GroupCard>
            {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
          {modal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Create group</h2>
                <Grid >
                  <Stack direction="row" padding={1}>
                    <p>Group name:</p>
                    <TextField
                      margin="normal"
                      fullWidth
                      label="Group name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                  </Stack>
                  <Stack direction="row" padding={1}>
                    <p>Group name:</p>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="female"
                      name="radio-buttons-group"
                    >
                      <FormControlLabel onSelect={() => setPublic(true)} value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel onSelect={() => setPublic(true)} value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </Stack>
                  <Stack direction="row" padding={1}>
                    <p>Max members:</p>
                    <input type="number" step={1} value={maxMembers} onChange={handleChange} max={200} min={2} />
                  </Stack>
                </Grid>
                <Button onClick={toggleModal}>Close</Button>
              </div>
            </div>
          )}
      </div>
    </Container>
  );
};