import  { useState } from 'react';
import { Button, Container } from "@mui/material";
import axios from 'axios';
import "./groups-page.scss";
import NoGroup from 'src/components/group/NoGroup';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const GroupsPage: React.FC<{}> = () => {
  const [signedUp, setSignedUp] = useState(true);
  const userUuid =  JSON.stringify(localStorage.getItem("userUUID")).replace("\"", "").replace("\"", "");
  let alreadyDone = false;

  const isSignedUp = async (recheck: boolean) =>{
    if(!alreadyDone || recheck){
      try{
        const groups = await axios.get(`${apiEndpoint}/getGroups`);
        for(var group of groups.data){
          for(var member of group.members){
            const uuid = JSON.stringify(member).replace("\"", "").replace("\"", "");
            if(userUuid == uuid){
              setSignedUp(true);
            } 
          }
        }
        alreadyDone = true;
        setSignedUp(false);
      }catch (error:any) {
        setSignedUp(false);
      }
    }
    
  };

  isSignedUp(false);
  
  return(
    <Container sx={{ mt: 9 }} maxWidth="xl" className="groups-container">
      {
        signedUp? (
          <NoGroup/>
        ): (<div></div>)
      };
    </Container>
  );
};