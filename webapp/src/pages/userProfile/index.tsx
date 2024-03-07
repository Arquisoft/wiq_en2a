import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
    const { t } = useTranslation();
    return(
        <div className="profile">
            <div className="profile-body">
                <p>{t('profile_name')}</p>
                <p>{t('profile_email')}</p>
                <p>{t('profile_points')}</p>
            </div>
        </div>
    )
}

export default ProfilePage;