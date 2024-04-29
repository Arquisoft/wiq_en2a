import  {  useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, Grid, Button, CircularProgress } from "@mui/material"
import axios from 'axios';
import { useTranslation } from 'react-i18next';

type TableProps = {
    groupUUID: string,
    nowHasNoGroup:()=> void;
}

interface Member  {
    username: string;
    totalScore: string;
    role: string;
}

let members: Member[] = [];

let adminUUID = "";
let groupName = "";
let total = 0;
let numberMembers = 0;

//const apiEndpoint = 'http://conoceryvencer.xyz:8000'
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const GroupTable = (props: TableProps) => {

    const [loading, setLoading] = useState<boolean>(true);
    const { t } = useTranslation();
    const aFunction = async ()=>{
        await axios.get(`${apiEndpoint}/getGroup/`+props.groupUUID).then(res => {
            members = [];
            numberMembers=0;
            total = 0;
            for(let member of res.data.members){
                let memberRole = t('group_table_member');
                if(member.uuid === res.data.admin.uuid){
                    memberRole = t('group_table_leader');
                }
                members.push({
                    username : member.username,
                    totalScore : member.totalScore,
                    role : memberRole,
                })
                total += +member.totalScore;
                numberMembers++;
            }
            adminUUID = res.data.admin.uuid;
            groupName = res.data.groupName;
            members.sort((member) => (+member.totalScore));
            setLoading(false);
        });        
        
    }    
    const leaveGroup = async () => {
        try{
            const expelledUUID = JSON.stringify(localStorage.getItem("userUUID")).replace("\"", "").replace("\"", "");
            await axios.post(`${apiEndpoint}/leaveGroup`, { expelledUUID, groupName, adminUUID}).then( res => {
                props.nowHasNoGroup();
                // add only groups that are public
            })
        } catch (error:any) {
            
        }
    }

    useEffect(()=>{
        aFunction();
    });
    
    return(
        <Container>
           {loading ? <CircularProgress /> : (
                <Container>
                    <Grid container padding={2} sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }} >
                        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h1 data-testid="group-name">{groupName}</h1>
                        </Grid>
                        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h1 data-testid="total-points">{total}{t('group_table_points')}</h1>
                        </Grid>
                        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h1 data-testid="number-members">{numberMembers}{t('group_table_members')}</h1>
                        </Grid>
                        <Grid item xs={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button data-testid="leave-button" style={{ width: '200px' }} variant="contained" onClick={leaveGroup} >{t('group_table_leave')}</Button>
                        </Grid>
                    </Grid>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {members.map((member) => {
                                return (
                                <TableRow key={props.groupUUID}>
                                    <TableCell>{member.username}</TableCell>
                                    <TableCell>{member.role}</TableCell>
                                    <TableCell>{member.totalScore}</TableCell>
                                </TableRow>
                                );
                            })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            )}
        </Container>
    )
}