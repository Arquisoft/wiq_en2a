import './Group.scss';
import { Button, Container, Snackbar, Grid, Stack } from "@mui/material";
import  { useEffect, useState } from 'react';
import axios from 'axios';
import { CreationModal } from './GroupCreationModal';
import { useTranslation } from 'react-i18next';

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

let groups: Group[] = [];
let groupsCharged = false;

const NoGroup = (props: ActionProps) => 
{
    const [error, setError] = useState('');
    const [createModal, setCreateModal] = useState(false);
    const [joinModal, setJoinModal] = useState(false);
    const { t } = useTranslation();

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
    
    // the 'useEffect' method is accessed every time the page is rendered
    useEffect(() => {
        // finds the groups first of all so when clicking on finding the groups they are already charged
        // otherwise it wont charge by the time the modal is open.
        findGroups(); 
    })

    const findGroups = async () =>{
        try{
            await axios.get(`${apiEndpoint}/getGroups`).then( res => {
                // new array here so in case it is chared twice it doesn't contain dupllicate data
                groups = [];
                for(let group of res.data){
                    let isPublic = JSON.stringify(group.isPublic).replace("\"", "").replace("\"", "");
                     // add only groups that are public
                    if(isPublic === "true"){
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
            })
        } catch (error:any) {
            setError(error.response.data.error);
        }
    }

    const joinGroup = async (groupName: string) =>{
        try{
            const uuid = creatorUUID;
            await axios.post(`${apiEndpoint}/joinGroup`, { uuid, groupName}).then( res => {
                // alerts that now it has group and changes the page to the group table
                props.nowHasGroup();
            })
        } catch (error:any) {
            setError(error.response.data.error);
        }
    }

    
    return (
        <Container className="groups-container" data-testid="no-group-container">
            <Stack className='groups-container'> 
                <h2 style={{ marginBottom: '20px' }}>{t('no_group_not_part')}</h2>
                <button className='group-button' 
                    onClick={() => {
                        toggleJoinModal();
                        if(createModal)
                            toggleCreateModal();
                        
                        }}
                    data-testid="join-group-button">
                        {t('no_group_join')}
                </button>
                <button className='group-button'
                    onClick={() => {
                        toggleCreateModal();
                        if(joinModal)
                            toggleJoinModal();
                    }} 
                    data-testid="create-group-button">
                        {t('no_group_create')}
                </button>
            </Stack>
            {error && (
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} data-testid="error-snackbar"/>
            )}
            {createModal && 
                (<CreationModal data-testid="create-group-modal" nowHasGroup={props.nowHasGroup} setError={setError} toggleCreateModal={toggleCreateModal}/>)
            }
            {joinModal && (groupsCharged && (
                <div className="modal-overlay" data-testid="join-group-modal">
                    <div className="modal">
                        <h2>{t('no_group_join_group')}</h2>
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
                                        <Button variant="contained" style={{margin:'1em'}} onClick={() => joinGroup(group.groupName)} data-testid={`join-group-button-${group.uuid}`}>{t('no_group_join_blank')}</Button>
                                    </Grid>
                                </Grid>
                            ))}                        
                            <Stack direction="row">
                                <Button variant="contained" onClick={toggleJoinModal} data-testid="close-join-modal-button">{t('no_group_close')}</Button>
                            </Stack>
                        </Grid>
                    </div>
                </div>
            ))}
        </Container>
    );
}

export default NoGroup;