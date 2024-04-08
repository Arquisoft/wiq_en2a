import './Group.scss';
import { Button, Container, Snackbar, TextField, Grid, Stack, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { GroupCard } from "../../components/group/GroupCard"
import  { ChangeEvent, useState } from 'react';
import axios from 'axios';

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
            await axios.post(`${apiEndpoint}/createGroup`, { groupName, creatorUUID, description, isPublic });
        }catch (error:any) {
        setError(error.response.data.error);
        }
    }

    const findGroups = async () =>{
        try{
            await axios.get(`${apiEndpoint}/getGroups`).then( res => {
                groups = new Array();
                for(let group of res.data){
                    let isPublic = JSON.stringify(group.isPublic).replace("\"", "").replace("\"", "");
                    if(isPublic == "true"){
                        let theNumMembers = group.members.length;
                        groups.push({
                            groupName : group.groupName,
                            maxNumUsers : group.maxNumUsers,
                            numMembers : theNumMembers,
                            uuid: group.uuid
                        })
                    }
                }
                groupsCharged = true;
                console.log(res);
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
                console.log(res);
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
        <Container sx={{ mt: 9 }} maxWidth="xl" className="groups-container">
        <h3>You are not part of a group...</h3>
        <Button variant="contained" onClick={toggleJoinModal}>Join a group</Button>
        <Button variant="contained" onClick={toggleCreateModal}>Create a group</Button>
        <GroupCard title="a" members="3" maxMembers="10"></GroupCard>
        {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
        )}
        {createModal && (
            <div className="modal">
            <div className="modal-content">
                <h2>Create group</h2>
                <Grid >
                <Stack direction="row" padding={1}>
                    <p>Group name:</p>
                    <TextField
                    margin="normal"
                    label="Group name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    />
                </Stack>
                <Stack direction="row" padding={1}>
                    <p>Group name:</p>
                    <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="yes"
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
                <Stack direction="row" padding={1}>
                    <p>Description:</p>
                    <TextField
                    margin="normal"
                    multiline
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    
                    />
                </Stack>
                <Stack direction="row" padding={1}>
                    <Button onClick={toggleCreateModal}>Close</Button>
                    <Button onClick={createGroup}>Create group</Button>
                </Stack>
                </Grid>
            </div>
            </div>
        )}
        {joinModal && (groupsCharged && (
            <div className="modal">
                <div className="modal-content">
                    <h2>Join group</h2>
                    <Grid >
                        {groups.map((group) => (
                            <Stack direction="row" padding={1} key={group.uuid}>
                                <p>{group.groupName}</p>
                                <p>{group.numMembers}/{group.maxNumUsers}</p>
                                <Button onClick={() => joinGroup(group.groupName)}>Join</Button>
                            </Stack>
                        ))}                        
                        <Stack direction="row" padding={1}>
                            <Button onClick={toggleJoinModal}>Close</Button>
                        </Stack>
                    </Grid>
                </div>
            </div>
        ))}
        </Container>
    );
}

export default NoGroup;