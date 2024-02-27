import  { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import GLoginButton from './GLoginButton';


type ActionProps = {
    goBack:()=> void;
}
const { t } = useTranslation();
const GoogleLogin = (props: ActionProps) => {




    return(
        <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
        <p>GoogleLogin</p>
        <div>
       <GLoginButton/>
        <button color="primary" onClick={props.goBack}>
            {t('go_back')}
        </button>
        </div>


        </Container>

    )


}