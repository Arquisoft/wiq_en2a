import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',
        interpolation:{
            escapeValue: false
        },
        resources: {
            en: {
                translation: {
                    app_name: 'Conocer y Vencer',
                    login: 'Login',
                    return: 'Return',
                    register: 'Register',   
                    login_google: 'Login with Google',
                    nav_game: 'Game',
                    nav_groups: 'Groups',
                    nav_scoreboard: 'Scoreboard',
                    nav_profile: 'Profile',
                    profile_name: 'Name:',
                    profile_email: 'Email:',
                    profile_created_at: 'Account exists since:',
                    profile_points: 'Total points:',
                    profile_nwins: 'Number of victories:',
                    profile_n_correct_answers: 'Number of correct answers:',
                    profile_n_wrong_answers: 'Number of wrong answers:'
                }
            },
            es: {
                translation: {
                    app_name: 'Conocer y Vencer',
                    login: 'Iniciar sesión',
                    return: 'Volver',
                    register: 'Registrarse',
                    login_google: 'Iniciar sesión con Google',
                    nav_game: 'Juego',
                    nav_groups: 'Grupos',
                    nav_scoreboard: 'Puntuación',
                    nav_profile: 'Perfil',
                    profile_name: 'Nombre:',
                    profile_email: 'Email:',
                    profile_created_at: 'La cuenta existe desde el:',
                    profile_points: 'Puntuación total:',
                    profile_nwins: 'Número de victorias:',
                    profile_n_correct_answers: 'Número de respuestas correctas:',
                    profile_n_wrong_answers: 'Número de respuestas incorrectas:'
                }
            },

        }
    });
    

export default i18n;