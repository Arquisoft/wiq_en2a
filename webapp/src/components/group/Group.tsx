import './Group.scss';
import { Button } from '@mui/material';

const Group = () => 
{
    return(
        <div>
            <h3>You are not part of a group...</h3>
            <Button>Join a group</Button>
            <Button>Create a group</Button>
        </div>
    )
}

export default Group;