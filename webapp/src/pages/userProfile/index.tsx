import { useTranslation } from 'react-i18next';
import { Container } from '@mui/material';
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

    const formatDate = (date: any) => {
      if (!date) return "";
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };

    return(
        <Container sx={{ mt: 10, ml: 3 }} maxWidth="xl">
          <h2 className='profile-header'>Profile</h2>
          <h3 className='profile-subheader'>Personal information</h3>
          <div>
            <ul>
              <li><p className='field'>{t('profile_name')} { user }</p></li>
              <li><p className='field'>{t('profile_email')} { email }</p></li>
              <li><p className='field'>{t('profile_created_at')} {formatDate(createdAt) }</p></li>
            </ul>
          </div>
          <h3 className='profile-subheader'>Performance statistics</h3>
          <div>
            <ul>
              <li><p className='field'>{t('profile_points')} { JSON.stringify(Number(score)) }</p></li>
              <li><p className='field'>{t('profile_nwins')} { JSON.stringify(Number(nwins)) }</p></li>
              <li><p className='field'>{t('profile_n_correct_answers')} { JSON.stringify(Number(nCorrectAnswers)) }</p></li>
              <li><p className='field'>{t('profile_n_wrong_answers')} { JSON.stringify(Number(nWrongAnswers)) }</p></li>
            </ul>
          </div>
        </Container>
    )
}

export default ProfilePage;