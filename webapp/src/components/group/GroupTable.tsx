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

let members: Member[] = new Array();

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
            console.log(res.data);
            members = [];
            numberMembers=0;
            total = 0;
            console.log(res.data);
            for(let member of res.data.members){
                let memberRole = t('group_table_member');
                if(member.uuid == res.data.admin.uuid){
                    memberRole = t('group_table_leader');
                }
                console.log(memberRole);
                members.push({
                    username : member.username,
                    totalScore : member.totalScore,
                    role : memberRole,
                })
                total += +member.totalScore;
                numberMembers++;
            }
            console.log(members);
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
                console.log(res);
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
            { membersCharged && (
                <Grid container padding={2} >
                    <Grid item xs={3} >
                        <h1 data-testid="group-name" style={{margin:'1em'}}>{groupName}</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <h1 data-testid="total-points" style={{margin:'1em'}}>{total}{t('group_table_points')}</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <h1 data-testid="number-members" style={{margin:'1em'}}>{numberMembers}{t('group_table_members')}</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <Button data-testid="leave-button" style={{maxWidth: '250px', maxHeight: '50px', minWidth: '250px', minHeight: '50px', float: 'right', margin:'1em'}} variant="contained" onClick={leaveGroup} >{t('group_table_leave')}</Button>
                    </Grid>
                </Grid>
            )}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('group_table_username')}</TableCell>
                            <TableCell>{t('group_table_role')}</TableCell>
                            <TableCell>{t('group_table_score')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {membersCharged && members.map((member) => (
                            <TableRow key={props.groupUUID}>
                                <TableCell>{member.username}</TableCell>
                                <TableCell>{member.role}</TableCell>
                                <TableCell>{member.totalScore}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}