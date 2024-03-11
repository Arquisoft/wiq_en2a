import { useTranslation } from 'react-i18next';
import { UserData } from 'src/App';
import { Container } from '@mui/material';

const ProfilePage = () => {
    const { t } = useTranslation();
    const {AuthUser} = UserData();
    return(
        <Container sx={{ mt: 9 }} maxWidth="xl">
            <div >
                <p>{t('profile_name')}</p>
                <p>{AuthUser.name}</p>
                <p>{t('profile_points')}</p>
                <p>{AuthUser.points}</p>
            </div>
        </Container>
    )
}

export default ProfilePage;