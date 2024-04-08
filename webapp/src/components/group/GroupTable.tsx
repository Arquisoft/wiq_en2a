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

let members: Member[];

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

export const GroupTable = (props: TableProps) => {
    const aFunction = async ()=>{
        members = new Array();
        console.log("Cargar grupo");
        const groups = await axios.get(`${apiEndpoint}/getGroup/`+props.groupUUID);
        console.log(groups.data)
        for(let member of groups.data.members){
            members.push({
                username : member.username,
                totalScore : member.totalScore,
                role : "Member",
            })
        }
        
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
                    {members.map((member) => (
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