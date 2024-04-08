import  { useState, useEffect } from 'react';
import { Button, Container } from "@mui/material";
import axios from 'axios';
import "./groups-page.scss";
import NoGroup from 'src/components/group/NoGroup';
import { GroupTable } from 'src/components/group/GroupTable';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';
let groupUUID: string = "";

export const GroupsPage: React.FC<{}> = () => {
  const [signedUp, setSignedUp] = useState(false);
  const userUuid =  JSON.stringify(localStorage.getItem("userUUID")).replace("\"", "").replace("\"", "");
  

  const isSignedUp = async () =>{
    let inGroup = false;
      try{
        const groups = await axios.get(`${apiEndpoint}/getGroups`);
        for(var group of groups.data){
          for(var member of group.members){
            const uuid = JSON.stringify(member).replace("\"", "").replace("\"", "");
            if(userUuid == uuid){
              inGroup = true;
              groupUUID = JSON.stringify(group.uuid).replace("\"", "").replace("\"", "");
            } 
          }
        }
        setSignedUp(inGroup);
      }catch (error:any) {
        setSignedUp(false);
      }
  };

  useEffect(()=>{
    isSignedUp();
  });
  
  return(
    <Container sx={{ mt: 9 }} maxWidth="xl" className="groups-container" >
      {
        signedUp? (
          <GroupTable groupUUID={groupUUID}/>
        ) : (
          <NoGroup/>
        ) 
      }
    </Container>
  );
};