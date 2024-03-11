import { useTranslation } from 'react-i18next';
import { Container } from '@mui/material';

const ProfilePage = () => {
    const { t } = useTranslation();
    const user =  localStorage.getItem("username");
    const score = localStorage.getItem("totalScore");
    const nwins = localStorage.getItem("nwins");

    return(
        <Container sx={{ mt: 9 }} maxWidth="xl">
            <div >
                <p>{t('profile_name')} { JSON.stringify(user)}</p>
                <p>{t('profile_points')} { JSON.stringify(Number(score)) }</p>
                <p>{t('profile_nwins')} { JSON.stringify(Number(nwins)) }</p>
            </div>
        </Container>
    )
}

export default ProfilePage;