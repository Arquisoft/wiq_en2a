import { useTranslation } from 'react-i18next';
import { Container, Grid, Paper, Typography } from '@mui/material';
import './profile-page.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const { t } = useTranslation();
  const apiEndpoint = 'http://localhost:8000';
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
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <Container sx={{ mt: 13, width: '100%' }}>
      <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
            <Typography color="#ffffff" variant="h4" gutterBottom className="profile-subheader">
              Personal Information
            </Typography>
            {profileInfo && (
              <ul className="white-list">
                <li>
                  <Typography variant="body1" className="field">
                    {t('profile_uuid')} {profileInfo.userStats.uuid}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className="field">
                    {t('profile_name')} {profileInfo.userStats.username}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className="field">
                    {t('profile_created_at')} {formatDate(profileInfo.userStats.createdAt)}
                  </Typography>
                </li>
              </ul>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
            <Typography color="#ffffff" variant="h4" gutterBottom className="profile-subheader">
              Performance Statistics
            </Typography>
            {profileInfo && (
              <ul className="white-list">
                <li>
                  <Typography variant="body1" className="field">
                    {t('profile_points')} {Number(profileInfo.userStats.totalScore)}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className="field">
                    {t('profile_nwins')} {Number(profileInfo.userStats.nWins)}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className="field">
                    {t('profile_n_correct_answers')} {Number(profileInfo.userStats.nCorrectAnswers)}
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" className="field">
                    {t('profile_n_wrong_answers')} {Number(profileInfo.userStats.nWrongAnswers)}
                  </Typography>
                </li>
              </ul>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: '#1976d2' }}>
            <Typography color="#ffffff" variant="h4" gutterBottom className="profile-subheader">
              {t('profile_last_game_questions')}
            </Typography>
            {profileInfo && (
              <div>
                <Typography
                  marginBottom={1}
                  color="#ffffff"
                  variant="body1"
                  className="field"
                >
                  Last game ID: {profileInfo.userStats.lastGameID}
                </Typography>
                <Typography
                  color="#ffffff"
                  variant="h5"
                  gutterBottom
                  className="profile-subheader"
                >
                  Questions:
                </Typography>
                <ul className="white-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {profileInfo.lastGame.map((question, index) => (
                    <li key={index}>
                      <Typography
                        color="#ffffff"
                        variant="h6"
                        gutterBottom
                        className="profile-subheader"
                      >
                        Question {index}
                      </Typography>
                      <ul>
                        <li>
                          <Typography variant="body1" className="field">
                            Question: {question[0].question}
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body1" className="field">
                            Correct answer: {question[0].correctAnswer}
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body1" className="field">
                            Incorrect answer 1: {question[0].incorrectAnswer1}
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body1" className="field">
                            Incorrect answer 2: {question[0].incorrectAnswer2}
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body1" className="field">
                            Incorrect answer 3: {question[0].incorrectAnswer3}
                          </Typography>
                        </li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;