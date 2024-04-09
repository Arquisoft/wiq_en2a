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
type Group = {
    groupName:string,
    totalScore: number,
    numMembers: number,
    adminUUID: string,
}

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const GroupTable = (props: TableProps) => {
    let prueba = "prueba";
    let group: Group = {
        groupName: "",
        numMembers: 0,
        totalScore: 0,
        adminUUID: "",
    };

    const aFunction = async ()=>{
        await axios.get(`${apiEndpoint}/getGroup/`+props.groupUUID).then(res => {
            let total = 0;
            console.log(res.data);
            members = new Array();
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
            }
            group = {
                groupName: res.data.groupName,
                numMembers: res.data.members.length,
                totalScore: total,
                adminUUID: res.data.admin.uuid,
            }
            prueba = res.data.groupName;
            console.log("Cargar grupo");
            console.log(group);
            members.sort((member) => (+member.totalScore));
            membersCharged = true;
         
        });        
        
    }    
    const leaveGroup = async () => {
        try{
            const adminUUID = group.adminUUID;
            const groupName = group.groupName;
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
            <Button style={{maxWidth: '300px', maxHeight: '50px', minWidth: '300px', minHeight: '50px', float: 'right', margin:'1em'}} variant="contained" onClick={leaveGroup} >Leave</Button>
            { membersCharged && (
                <Grid container padding={2} >
                    <Grid item xs={4} >
                        <h1 style={{margin:'1em'}} >{prueba}</h1>
                    </Grid>
                    <Grid item xs={4} >
                        <h1 style={{margin:'1em'}} >{group.totalScore} points</h1>
                    </Grid>
                    <Grid item xs={4} >
                        <h1 style={{margin:'1em'}} >{group.numMembers} members</h1>
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
                            <TableRow>
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