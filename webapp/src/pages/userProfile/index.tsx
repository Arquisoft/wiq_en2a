import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';
import './profile-page.scss';

const ProfilePage = () => {
    const { t } = useTranslation();
    const user =  JSON.stringify(localStorage.getItem("username")).replace("\"", "").replace("\"", "");
    const email =  JSON.stringify(localStorage.getItem("email")).replace("\"", "").replace("\"", "");
    const createdAt = localStorage.getItem("createdAt");
    const score = localStorage.getItem("totalScore");
    const nwins =  localStorage.getItem("nwins");
    const nCorrectAnswers =  localStorage.getItem("nCorrectAnswers");
    const nWrongAnswers =  localStorage.getItem("nWrongAnswers");
    const [gameInfo, setGameInfo] = useState(null);
    const uuid = localStorage.getItem('uuid');

    useEffect(() => {
      const fetchGameInfo = async () => {
          try {
              const response = await axios.get(`http://localhost:8000/getStats/${uuid}`);
              setGameInfo(response.data);
          } catch (error) {
              console.error('Error fetching game information:', error);
          }
      };
      fetchGameInfo();
    }, [uuid]);

    const formatDate = (date: any) => {
      if (!date) return "";
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };

    return(
      <Container sx={{ mt: 10, ml: 3 }} maxWidth="xl">
        <Typography variant="h2" gutterBottom className='profile-header'>Profile</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
              <Typography color="#ffffff" variant="h4" gutterBottom className='profile-subheader'>Personal Information</Typography>
              <ul className="white-list">
                <li><Typography variant="body1" className='field'>{t('profile_name')} { user }</Typography></li>
                <li><Typography variant="body1" className='field'>{t('profile_email')} { email }</Typography></li>
                <li><Typography variant="body1" className='field'>{t('profile_created_at')} {formatDate(createdAt) }</Typography></li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
              <Typography color="#ffffff" variant="h4" gutterBottom className='profile-subheader'>Performance Statistics</Typography>
              <ul className="white-list">
                <li><Typography variant="body1" className='field'>{t('profile_points')} { JSON.stringify(Number(score)) }</Typography></li>
                <li><Typography variant="body1" className='field'>{t('profile_nwins')} { JSON.stringify(Number(nwins)) }</Typography></li>
                <li><Typography variant="body1" className='field'>{t('profile_n_correct_answers')} { JSON.stringify(Number(nCorrectAnswers)) }</Typography></li>
                <li><Typography variant="body1" className='field'>{t('profile_n_wrong_answers')} { JSON.stringify(Number(nWrongAnswers)) }</Typography></li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
              <Typography color="#ffffff" variant="h4" gutterBottom className='profile-subheader'>{t('profile_last_game_questions')}</Typography>
              {gameInfo.lastGame ? (
                <ul className="white-list">
                  <li><Typography color="#ffffff" variant="body1" className='field'></Typography></li>
                </ul>
               ) : (
                <Typography color="#ffffff" variant="body1" className='field'>{t('profile_last_game_questions_warning')}</Typography>
               )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
              <Typography color="#ffffff" variant="h4" gutterBottom className='profile-subheader'>Additional Information</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    )
}

export default ProfilePage;