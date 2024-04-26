import './Group.scss';
import { Button, Container, Snackbar, TextField, Grid, Stack, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import  { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios';

//const apiEndpoint = 'http://conoceryvencer.xyz:8000'
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
    const [groupName, setGroupName] = useState('');
    const [isPublic, setPublic] = useState(true);
    const [maxMembers, setMaxMembers] = useState(2);
    const [description, setDescription] = useState('');
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

    const createGroup = async () =>{
        try{
            console.log("Public?");
            console.log(isPublic);
            await axios.post(`${apiEndpoint}/createGroup`, { groupName, creatorUUID, description, isPublic }).then( res => {
                props.nowHasGroup();
            });
        }catch (error:any) {
        setError(error.response.data.error);
        }
    }

    useEffect(() => {
        findGroups();
    })

    const findGroups = async () =>{
        try{
            await axios.get(`${apiEndpoint}/getGroups`).then( res => {
                groups = new Array();
                for(let group of res.data){
                    console.log("Group:"+JSON.stringify(group));
                    let isPublic = JSON.stringify(group.isPublic).replace("\"", "").replace("\"", "");
                    let comprobacion = isPublic === "true";
                    if(isPublic === "true"){
                        console.log(group.members);
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
            console.log("error: "+error);
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
        <Container sx={{ mt: 9 }} maxWidth="xl" className="groups-container" data-testid="no-group-container">
            <Stack direction="column" padding={1} style={{display: 'flex', justifyContent: 'center'}}> 
                <h3 data-testid="no-group-message">You are not part of a group...</h3>
                <Button style={{margin:'1em'}} variant="contained" onClick={toggleJoinModal} data-testid="join-group-button">Join a group</Button>
                <Button style={{margin:'1em'}} variant="contained" onClick={toggleCreateModal} data-testid="create-group-button">Create a group</Button>
            </Stack>
                
            {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} data-testid="error-snackbar" />
            )}
            {createModal && (
                <div className="modal" data-testid="create-group-modal">
                    <div className="modal-content">
                        <h2>Create group</h2>
                        <Grid >
                            <Grid container padding={2} >
                                <Grid item xs={5} ><p>Group name:</p></Grid>
                                <Grid item xs={5} ><TextField
                                margin="normal"
                                label="Group name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                data-testid="group-name-input"
                                /></Grid>
                            </Grid>
                            <Grid container padding={2} >
                                <Grid item xs={5} ><p>Group name:</p></Grid>
                                <Grid item xs={5} ><RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="yes"
                                name="radio-buttons-group"
                                onChange={(e) => setPublic(e.target.value === "yes")}
                                data-testid="is-public-radio-group"
                                >
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup></Grid>
                            </Grid>
                            <Grid container padding={2} >
                                <Grid item xs={5} ><p>Max members:</p></Grid>
                                <Grid item xs={5} ><input type="number" step={1} value={maxMembers} onChange={handleChange} max={200} min={2} data-testid="max-members-input" /></Grid>
                            </Grid>
                            <Grid container padding={2} >
                                <Grid item xs={5} ><p>Description:</p></Grid>
                                <Grid item xs={5} ><TextField
                                margin="normal"
                                multiline
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                data-testid="description-input"
                                /></Grid>
                            </Grid>
                            <Grid container padding={2} >
                                <Grid item xs={6} ><Button onClick={toggleCreateModal} data-testid="close-create-modal-button">Close</Button></Grid>
                                <Grid item xs={6} ><Button onClick={createGroup} data-testid="create-group-button">Create group</Button></Grid>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            )}
            {joinModal && (groupsCharged && (
                <div className="modal" data-testid="join-group-modal">
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
                                        <Button variant="contained" style={{margin:'1em'}} onClick={() => joinGroup(group.groupName)} data-testid={`join-group-button-${group.uuid}`}>Join</Button>
                                    </Grid>
                                </Grid>
                            ))}                        
                            <Stack direction="row" padding={1}>
                                <Button variant="contained" onClick={toggleJoinModal} data-testid="close-join-modal-button">Close</Button>
                            </Stack>
                        </Grid>
                    </div>
                </div>
            ))}
        </Container>
    );
}

export default NoGroup;