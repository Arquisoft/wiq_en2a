import { useTranslation } from 'react-i18next';
import { Container, Grid, Paper, Typography } from '@mui/material';
import './profile-page.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const { t } = useTranslation();
  const apiEndpoint = 'http://localhost:8000'
  const uuid = localStorage.getItem('uuid');
  const [profileInfo, setProfileInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/getStats/${uuid}`);
        setProfileInfo(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [apiEndpoint, uuid]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
    return date.toLocaleDateString('en-US', options);
  };

  return(
    <Container sx={{ mt: 10, ml: 3 }} maxWidth="xl">
      <Typography variant="h2" gutterBottom className='profile-header'>Profile</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
            <Typography color="#ffffff" variant="h4" gutterBottom className='profile-subheader'>Personal Information</Typography>
            {profileInfo && (
              <ul className="white-list">
                <li>
                  <Typography variant="body1" className='field'>
                    {t('profile_uuid')} { JSON.stringify(profileInfo.userStats.uuid)
                      .replace("\"", "").replace("\"", "") }
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className='field'>
                    {t('profile_name')} { JSON.stringify(profileInfo.userStats.username)
                      .replace("\"", "").replace("\"", "") }
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className='field'>
                    {t('profile_created_at')} {formatDate(JSON.stringify(profileInfo.userStats.createdAt)
                      .replace("\"", "").replace("\"", "")) }
                  </Typography>
                </li>
              </ul>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
            <Typography color="#ffffff" variant="h4" gutterBottom className='profile-subheader'>Performance Statistics</Typography>
            {profileInfo && (  
              <ul className="white-list">
                <li>
                  <Typography variant="body1" className='field'>
                    {t('profile_points')} { JSON.stringify(Number(profileInfo.userStats.totalScore)) }
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className='field'>
                    {t('profile_nwins')} { JSON.stringify(Number(profileInfo.userStats.nWins)) }
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className='field'>
                    {t('profile_n_correct_answers')} { JSON.stringify(Number(profileInfo.userStats.nCorrectAnswers)) }
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className='field'>
                    {t('profile_n_wrong_answers')} { JSON.stringify(Number(profileInfo.userStats.nWrongAnswers)) }
                  </Typography>
                </li>
              </ul>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
            <Typography color="#ffffff" variant="h4" gutterBottom className='profile-subheader'>{t('profile_last_game_questions')}</Typography>
            {profileInfo && (
              <ul className="white-list">
                
              </ul>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
            <Typography color="#ffffff" variant="h4" gutterBottom className='profile-subheader'>Additional Information</Typography>
            {profileInfo && (
              <ul className='white-list'>

              </ul>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ProfilePage;