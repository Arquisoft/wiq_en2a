import  {  useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import axios from 'axios';

type TableProps = {
    groupUUID: string;
}

interface Member  {
    username: string;
    totalScore: string;
    role: string;
}

let members: Member[] = new Array();
let membersCharged = false;

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const GroupTable = (props: TableProps) => {
    const aFunction = async ()=>{
        console.log("Cargar grupo");
        await axios.get(`${apiEndpoint}/getGroup/`+props.groupUUID).then(res => {
            members = new Array();
            for(let member of res.data.members){
                members.push({
                    username : member.username,
                    totalScore : member.totalScore,
                    role : "Member",
                })
            }
            
            members.sort((member) => (+member.totalScore));
            membersCharged = true;
        });        
        
    }    
    useEffect(()=>{
        aFunction();
    });
    return(
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
    )
}