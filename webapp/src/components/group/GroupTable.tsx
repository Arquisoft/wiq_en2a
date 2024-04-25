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
            console.log(res.data);
            for(let member of res.data.members){
                let memberRole = "Member";
                if(member.uuid == res.data.admin.uuid){
                    memberRole = "Leader";
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
            console.log(membersCharged);
            membersCharged = true;
            console.log(membersCharged);
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
                        <h1 data-testid="group-name" style={{margin:'1em'}} >{groupName}</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <h1 data-testid="total-points" style={{margin:'1em'}} >{total} points</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <h1 data-testid="number-members" style={{margin:'1em'}} >{numberMembers} members</h1>
                    </Grid>
                    <Grid item xs={3} >
                        <Button data-testid="leave-button" style={{maxWidth: '250px', maxHeight: '50px', minWidth: '250px', minHeight: '50px', float: 'right', margin:'1em'}} variant="contained" onClick={leaveGroup} >Leave</Button>
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
                    {membersCharged && members.map((member) => {
                        console.log(member + "added");
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
       
    )
}