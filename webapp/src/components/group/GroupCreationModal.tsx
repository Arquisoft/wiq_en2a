import  { useState, ChangeEvent, FC } from 'react';
import axios from 'axios';
import { Button, TextField, Grid, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useTranslation } from 'react-i18next';
import "./Group.scss"
import CloseModalIcon from '../util/CloseModalIcon';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

type ActionProps = {
    nowHasGroup:()=> void;
    setError:(error:any) => void;
    toggleCreateModal: () => void
}

export const CreationModal: FC<ActionProps> = ({nowHasGroup, setError, toggleCreateModal}) => {
    const { t } = useTranslation();
    const [isPublic, setPublic] = useState(true);
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [maxMembers, setMaxMembers] = useState(2);
    const creatorUUID =  JSON.stringify(localStorage.getItem("userUUID")).replace("\"", "").replace("\"", "");

    const createGroup = async () =>{
        try{
            await axios.post(`${apiEndpoint}/createGroup`, { groupName, creatorUUID, description, isPublic }).then( res => {
                nowHasGroup();
            });
        }catch (error: any) {
            setError(error.response.data.error);
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
        <div className="modal-overlay" data-testid="create-group-modal">
            <div className="modal">
                <div className="modal-header">
                    <h2>Create group</h2>
                    <button className="close-button" onClick={toggleCreateModal}>
                        <CloseModalIcon />
                    </button>
                </div>
                <Grid >
                    <Grid container padding={2} sx={{ display: 'flex', width: '400px' , justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Grid item xs={5} ><p>{t('create_group_group_name')}</p></Grid>
                        <Grid item xs={6} ><TextField
                        data-testid="group-name-input"
                        margin="normal"
                        label={t('create_group_group_name_label')}
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        /></Grid>
                    </Grid>
                    <Grid container padding={2} sx={{ display: 'flex', width: '400px', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Grid item xs={5} ><p>{t('create_group_public_group')}</p></Grid>
                        <Grid item xs={5}><RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="yes"
                        name="radio-buttons-group"
                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}
                        onChange={(e) => setPublic(e.target.value === "yes")}
                        >
                            <FormControlLabel data-testid="yes-button" value="yes" control={<Radio />} label={t('create_group_yes')} />
                            <FormControlLabel data-testid="no-button" value="no" control={<Radio />} label={t('create_group_no')} />
                        </RadioGroup></Grid>
                    </Grid>
                    <Grid container padding={2} sx={{ display: 'flex', width: '400px', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Grid item xs={6} ><p>{t('create_group_max_members')}</p></Grid>
                        <Grid item xs={1} ><input style={{ width: '37px' }} type="number" step={1} value={maxMembers} onChange={handleChange} max={200} min={2} /></Grid>
                    </Grid>
                    <Grid container padding={2} sx={{ display: 'flex', width: '400px', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Grid item xs={5} ><p>{t('create_group_description')}</p></Grid>
                        <Grid item xs={7} ><TextField
                        data-testid="description-input"
                        margin="normal"
                        multiline
                        label={t('create_group_description_label')}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        /></Grid>
                    </Grid>
                    <Grid container padding={2} >
                        <Grid item xs={6} ><Button data-testid="create-button" variant="contained" onClick={createGroup} sx={{ width: '140px' }}>{t('create_group_button')}</Button></Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );

}