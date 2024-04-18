import  {  useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, Grid, Button } from "@mui/material"
import axios from 'axios';

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
let membersCharged = false;

let adminUUID = "";
let groupName = "";
let total = 0;
let numberMembers = 0;

//const apiEndpoint = 'http://74.234.241.249:8000'
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const GroupTable = (props: TableProps) => {
    const aFunction = async ()=>{
        await axios.get(`${apiEndpoint}/getGroup/`+props.groupUUID).then(res => {
            console.log(res.data);
            members = new Array();
            numberMembers=0;
            total = 0;
            for(let member of res.data.members){
                let memberRole = "Member";
                if(member.uuid == res.data.admin.uuid){
                    memberRole = "Leader";
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
            membersCharged = true;
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
        
    }, [groupName]);
    return(
        <Container>
           
            { membersCharged && (
                <Grid container padding={2} >
                    <Grid item xs={3} >
                        <h1 style={{margin:'1em'}} >{groupName}</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <h1 style={{margin:'1em'}} >{total} points</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <h1 style={{margin:'1em'}} >{numberMembers} members</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <Button style={{maxWidth: '250px', maxHeight: '50px', minWidth: '250px', minHeight: '50px', float: 'right', margin:'1em'}} variant="contained" onClick={leaveGroup} >Leave</Button>
                    </Grid>
                </Grid>
            )}
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