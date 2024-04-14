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
                    profile_uuid: 'User ID:',
                    profile_name: 'Name:',
                    profile_created_at: 'Account creation date:',
                    profile_points: 'Total points:',
                    profile_nwins: 'Number of victories:',
                    profile_n_correct_answers: 'Correct answers:',
                    profile_n_wrong_answers: 'Wrong answers:',
                    profile_last_game_questions: 'Last game questions',
                    profile_last_game_questions_question: 'Question:',
                    profile_last_game_questions_warning: 'You have not played any games yet',
                    profile_last_game_questions_correct_answer: 'Correct answer:',
                    profile_last_game_questions_incorrect_answer_1: 'Incorrect answer 1:',
                    profile_last_game_questions_incorrect_answer_2: 'Incorrect answer 2:',
                    profile_last_game_questions_incorrect_answer_3: 'Incorrect answer 3:',
                    group_table_member: 'Member',
                    group_table_leader: 'Leader',
                    group_table_username: 'Username',
                    group_table_role: 'Role',
                    group_table_score: 'Score',
                    create_group_group_name: 'Group name:',
                    create_group_public_group: 'Public:',
                    create_group_max_members: 'Max members:',
                    create_group_description: 'Description:',
                    create_group_button: 'Create group',
                    not_part_of_group: 'You are not part of a group...',
                    join_group_button: 'Join a group',
                    join_this_group_button: 'Join',
                    close_button: 'Close',                   
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
                    profile_uuid: 'ID del jugador:',
                    profile_name: 'Nombre:',
                    profile_created_at: 'Fecha de creación de cuenta:',
                    profile_points: 'Puntuación total:',
                    profile_nwins: 'Número de victorias:',
                    profile_n_correct_answers: 'Respuestas correctas:',
                    profile_n_wrong_answers: 'Respuestas incorrectas:',
                    profile_last_game_questions: 'Preguntas de la última partida',
                    profile_last_game_questions_warning: 'Todavía no has jugado ninguna partida',
                    profile_last_game_questions_question: 'Pregunta:',
                    profile_last_game_questions_correct_answer: 'Respuesta correcta:',
                    profile_last_game_questions_incorrect_answer_1: 'Respuesta incorrecta 1:',
                    profile_last_game_questions_incorrect_answer_2: 'Respuesta incorrecta 2:',
                    profile_last_game_questions_incorrect_answer_3: 'Respuesta incorrecta 3:',
                    group_table_member: 'Miembro',
                    group_table_leader: 'Líder',
                    group_table_username: 'Nombre de usuario',
                    group_table_role: 'Rol',
                    group_table_score: 'Puntuación',
                    create_group_group_name: 'Nombre del grupo:',
                    create_group_public_group: 'Público:',
                    create_group_max_members: 'Número máximo de miembros:',
                    create_group_description: 'Descripción:',
                    create_group_button: 'Crear grupo',
                    not_part_of_group: 'No eres parte de un grupo...',
                    join_group_button: 'Unirse a un grupo',
                    join_this_group_button: 'Unirse',
                    close_button: 'Cerar',      
                }
            },

        }
    });
    

export default i18n;