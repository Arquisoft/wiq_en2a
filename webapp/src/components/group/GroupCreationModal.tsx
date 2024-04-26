import  { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useTranslation } from 'react-i18next';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

type ActionProps = {
    nowHasGroup:()=> void;
    setError:(error:any) => void;
    closeModal:() => void;
}

export const CreationModal = (props: ActionProps) => {
    const { t } = useTranslation();
    const [isPublic, setPublic] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState(2);
    const creatorUUID =  JSON.stringify(localStorage.getItem("userUUID")).replace("\"", "").replace("\"", "");

    const createGroup = async () =>{
        try{
            console.log("Public?");
            console.log(isPublic);
            await axios.post(`${apiEndpoint}/createGroup`, { groupName, creatorUUID, description, isPublic }).then( res => {
                props.nowHasGroup();
            });
        }catch (error:any) {
            props.setError(error.response.data.error);
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
        <div className="modal" data-testid="create-group-modal">
            <div className="modal-content">
                <h2>Create group</h2>
                <Grid >
                    <Grid container padding={2} >
                        <Grid item xs={5} ><p>{t('create_group_group_name')}</p></Grid>
                        <Grid item xs={5} ><TextField
                        margin="normal"
                        label="Group name"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        /></Grid>
                    </Grid>
                    <Grid container padding={2} >
                        <Grid item xs={5} ><p>{t('create_group_public_group')}</p></Grid>
                        <Grid item xs={5} ><RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="yes"
                        name="radio-buttons-group"
                        onChange={(e) => setPublic(e.target.value === "yes")}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup></Grid>
                    </Grid>
                    <Grid container padding={2} >
                        <Grid item xs={5} ><p>{t('create_group_max_members')}</p></Grid>
                        <Grid item xs={5} ><input type="number" step={1} value={maxMembers} onChange={handleChange} max={200} min={2} /></Grid>
                    </Grid>
                    <Grid container padding={2} >
                        <Grid item xs={5} ><p>{t('create_group_description')}</p></Grid>
                        <Grid item xs={5} ><TextField
                        margin="normal"
                        multiline
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        /></Grid>
                    </Grid>
                    <Grid container padding={2} >
                        <Grid item xs={6} ><Button onClick={props.closeModal}>{t('create_group_button')}</Button></Grid>
                        <Grid item xs={6} ><Button onClick={createGroup}>{t('close_button')}</Button></Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );

}