import  { useState } from 'react';
import { Button, Container } from "@mui/material";
import axios from 'axios';
import "./groups-page.scss";
import NoGroup from 'src/components/group/NoGroup';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const GroupsPage: React.FC<{}> = () => {
  const [signedUp, setSignedUp] = useState(true);
  const uuid =  JSON.stringify(localStorage.getItem("userUUID")).replace("\"", "").replace("\"", "");

  const isSignedUp = async () =>{
    try{
      const groups = await axios.get(`${apiEndpoint}/getGroup/`+uuid);
      console.log(groups);
      setSignedUp(true);
    }catch (error:any) {
      setSignedUp(false);
    }
  }

  isSignedUp()
  return(
    <Container sx={{ mt: 9 }} maxWidth="xl" className="groups-container">
      {
        signedUp && (
        <NoGroup/>)
      };
    </Container>
  );
};