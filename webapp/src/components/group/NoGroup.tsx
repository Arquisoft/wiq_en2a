import './Group.scss';
import { Button, Container, Snackbar, TextField, Grid, Stack, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import  { useEffect, useState } from 'react';
import axios from 'axios';
import { CreationModal } from './GroupCreationModal';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

interface Group  {
    groupName: string;
    maxNumUsers: string;
    numMembers: string;
    uuid: string;
}

type ActionProps = {
    nowHasGroup:()=> void;
}

let groups: Group[] = new Array();
let groupsCharged = false;

const NoGroup = (props: ActionProps) => 
{
    const [error, setError] = useState('');
    const [createModal, setCreateModal] = useState(false);
    const [joinModal, setJoinModal] = useState(false);
   
    const creatorUUID =  JSON.stringify(localStorage.getItem("userUUID")).replace("\"", "").replace("\"", "");
    
    const toggleCreateModal = () => {
        setCreateModal(!createModal);
    };

    const toggleJoinModal = () => {
        setJoinModal(!joinModal);
        if(joinModal){
            findGroups();
        }
    };
    
    useEffect(() => {
        findGroups();
    })

    const findGroups = async () =>{
        try{
            await axios.get(`${apiEndpoint}/getGroups`).then( res => {
                groups = new Array();
                for(let group of res.data){
                    let isPublic = JSON.stringify(group.isPublic).replace("\"", "").replace("\"", "");
                    let comprobacion = isPublic === "true";
                    if(isPublic === "true"){
                        let theNumMembers = group.members.length;
                        groups.push({
                            groupName : group.groupName,
                            maxNumUsers : group.maxNumUsers,
                            numMembers : theNumMembers,
                            uuid: group.uuid
                        })
                    }
                    console.log(comprobacion);
                }
                groupsCharged = true;
                // add only groups that are public
            })
        } catch (error:any) {
        setError(error.response.data.error);
        }
    }

    const joinGroup = async (groupName: string) =>{
        try{
            const uuid = creatorUUID;
            await axios.post(`${apiEndpoint}/joinGroup`, { uuid, groupName}).then( res => {
                props.nowHasGroup();
                // add only groups that are public
            })
        } catch (error:any) {
            setError(error.response.data.error);
        }
    }

    
    
    
    return (
        <Container sx={{ mt: 9 }} maxWidth="xl" className="groups-container">
            <Stack direction="column" padding={1} style={{display: 'flex', justifyContent: 'center'}}> 
                <h3>You are not part of a group...</h3>
                <Button style={{margin:'1em'}} variant="contained" onClick={toggleJoinModal}>Join a group</Button>
                <Button style={{margin:'1em'}} variant="contained" onClick={toggleCreateModal}>Create a group</Button>
            </Stack>
                
            {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
            )}
            {createModal &&
                (<CreationModal nowHasGroup={props.nowHasGroup} setError={setError} closeModal={toggleCreateModal}/>)
            }
            {joinModal && (groupsCharged && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Join group</h2>
                        <Grid >
                            {groups.map((group) => (
                                <Grid container key={group.uuid}>
                                    <Grid item xs={4} >
                                        <p style={{margin:'1em'}} >{group.groupName}</p>  
                                    </Grid>
                                    <Grid item xs={4} >
                                        <p style={{margin:'1em'}}>{group.numMembers}/{group.maxNumUsers}</p>
                                    </Grid>
                                    <Grid item xs={4} key={group.uuid}>
                                        <Button variant="contained" style={{margin:'1em'}} onClick={() => joinGroup(group.groupName)}>Join</Button>
                                    </Grid>
                                </Grid>
                            ))}                        
                            <Stack direction="row" padding={1}>
                                <Button variant="contained" onClick={toggleJoinModal}>Close</Button>
                            </Stack>
                        </Grid>
                    </div>
                </div>
            ))}
        </Container>
    );
}

export default NoGroup;