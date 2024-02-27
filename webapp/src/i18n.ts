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
                    go_back: 'Go back',
                    register: 'Register',
                    add_user: 'Add user',
                    login_google: 'Login with Google'
                }
            },
            es: {
                translation: {
                    app_name: 'Conocer y Vencer',
                    login: 'Iniciar sesión',
                    go_back: 'Ir atrás',
                    register: 'Registrarse',
                    add_user: 'Añadir usuario',
                    login_google: 'Iniciar sesión con Google'
                }
            },

        }
    });
    

export default i18n;