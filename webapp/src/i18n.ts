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
                    nav_logout: 'Logout',
                    g_login_button_login_failed: 'Login Failed',
                    lobby_multiplayer_title: 'Lobby - Multiplayer',
                    lobby_multiplayer_party_code: 'Party code: ',
                    lobby_multiplayer_admin: 'Admin',
                    lobby_multiplayer_player: 'Player',
                    lobby_multiplayer_points: 'Points: ',
                    lobby_multiplayer_exit: 'Exit',
                    lobby_multiplayer_start_game: 'Start game',
                    lobby_multiplayer_loading_questions: 'Loading questions...',
                    menu_multiplayer_create_or_join: 'Create a room or join one',
                    menu_multiplayer_create: 'Create Room',
                    menu_multiplayer_join: 'Join Room',
                    questions_multiplayer_question: 'Question ',
                    questions_multiplayer_you_answered: 'You answered ',
                    questions_multiplayer_out_of: ' out of ',
                    questions_multiplayer_questions_correctly: ' questions correctly.',
                    questions_multiplayer_you_earned: 'You earned ',
                    questions_multiplayer_points: ' points.',
                    questions_multiplayer_waiting_players: 'Waiting for the rest of the players to finish...',
                    game_single_player_error: 'Error',
                    lobby_single_player_title: 'Lobby - Single Player',
                    lobby_single_player_total_points: 'Total points: ',
                    lobby_single_player_delete: 'Delete',
                    lobby_single_player_add_bot_player: 'Add Bot Player',
                    lobby_single_player_start_game: 'Start Game',
                    lobby_single_player_loading_questions: 'Loading Questions...',
                    playing_single_player_you_answered: 'You answered ',
                    playing_single_player_out_of: ' out of ',
                    playing_single_player_questions_correctly: ' questions correctly.',
                    playing_single_player_you_earned: 'you earned ',
                    playing_single_player_points: ' points.',
                    playing_single_player_next: 'Next',
                    scoreboard_game_game_scoreboard: 'Game Scoreboard',
                    scoreboard_game_position: 'Position',
                    scoreboard_game_username: 'Username',
                    scoreboard_game_points: 'Points',
                    game_layout_game: 'Game',
                    game_layout_groups: 'Groups',
                    game_layout_scoreboard: 'Scoreboard',
                    group_table_points: ' points',
                    group_table_members: ' members',
                    group_table_leave: 'Leave',
                    group_table_username: 'Username',
                    group_table_role: 'Role',
                    group_table_score: 'Score',
                    no_group_not_part: 'You are not part of a group yet...',
                    no_group_join: 'Join a group',
                    no_group_create: 'Create a group',
                    no_group_create_group: 'Create group',
                    no_group_group_name: 'Group name:',
                    no_group_max_members: 'Max members:',
                    no_group_description: 'Description:',
                    no_group_close: 'Close',
                    no_group_join_group: 'Join group',
                    no_group_join_blank: 'Join',
                    game_single_player: 'Single Player',
                    game_single_player_ai: 'Single Player (AI)',
                    game_multiplayer: 'Multiplayer',
                    profile_uuid: 'User ID:',
                    profile_name: 'Name:',
                    profile_created_at: 'Account creation date:',
                    profile_performance_statistics: 'Performance Statistics',
                    profile_points: 'Total points:',
                    profile_nwins: 'Number of victories:',
                    profile_n_correct_answers: 'Correct answers:',
                    profile_n_wrong_answers: 'Wrong answers:',
                    profile_last_game_id: 'Last game ID: ',
                    profile_questions: 'Questions:',
                    profile_last_game_questions_question_blank: 'Question ',
                    profile_last_game_questions: 'Last Game',
                    profile_last_game_questions_question: 'Question: ',
                    profile_last_game_questions_correct_answer: 'Correct answer: ',
                    profile_last_game_questions_incorrect_answer_1: 'Incorrect answer 1: ',
                    profile_last_game_questions_incorrect_answer_2: 'Incorrect answer 2: ',
                    profile_last_game_questions_incorrect_answer_3: 'Incorrect answer 3: '
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
                    nav_logout: 'Cerrar sesión',
                    g_login_button_login_failed: 'Fallo de Inicio de Sesión',
                    lobby_multiplayer_title: 'Lobby - Multijugador',
                    lobby_multiplayer_party_code: 'Código de sala: ',
                    lobby_multiplayer_admin: 'Administrador',
                    lobby_multiplayer_player: 'Jugador',
                    lobby_multiplayer_points: 'Puntos: ',
                    lobby_multiplayer_exit: 'Salir',
                    lobby_multiplayer_start_game: 'Comenzar partida',
                    lobby_multiplayer_loading_questions: 'Cargando preguntas...',
                    menu_multiplayer_create_or_join: 'Crea un sala o únete a una',
                    menu_multiplayer_create: 'Crear Sala',
                    menu_multiplayer_join: 'Unirse a Sala',
                    questions_multiplayer_question: 'Pregunta ',
                    questions_multiplayer_you_answered: 'Respondiste ',
                    questions_multiplayer_out_of: ' de ',
                    questions_multiplayer_questions_correctly: ' preguntas correctamente.',
                    questions_multiplayer_you_earned: 'Ganaste ',
                    questions_multiplayer_points: ' puntos.',
                    questions_multiplayer_waiting_players: 'Esperando a que el resto de los jugadores terminen...',
                    game_single_player_error: 'Error',
                    lobby_single_player_title: 'Lobby - Un Solo Jugador',
                    lobby_single_player_total_points: 'Total de puntos: ',
                    lobby_single_player_delete: 'Borrar',
                    lobby_single_player_add_bot_player: 'Añadir Bot Jugador',
                    lobby_single_player_start_game: 'Comenzar Partida',
                    lobby_single_player_loading_questions: 'Cargando Preguntas...',
                    playing_single_player_you_answered: 'Respondiste ',
                    playing_single_player_out_of: ' de ',
                    playing_single_player_questions_correctly: ' preguntas correctamente.',
                    playing_single_player_you_earned: 'Ganaste ',
                    playing_single_player_points: ' puntos.',
                    playing_single_player_next: 'Siguiente',
                    scoreboard_game_game_scoreboard: 'Marcador del Juego',
                    scoreboard_game_position: 'Posición',
                    scoreboard_game_username: 'Nombre de Usuario',
                    scoreboard_game_points: 'Puntos',
                    game_layout_game: 'Juego',
                    game_layout_groups: 'Grupos',
                    game_layout_scoreboard: 'Marcador del Juego',
                    group_table_points: ' puntos',
                    group_table_members: ' miembros',
                    group_table_leave: 'Salir',
                    group_table_username: 'Nombre de Usuario',
                    group_table_role: 'Rol',
                    group_table_score: 'Puntuación',
                    no_group_not_part: 'Aún no eres parte de un grupo...',
                    no_group_join: 'Unirse a un grupo',
                    no_group_create: 'Crear un grupo',
                    no_group_create_group: 'Crear grupo',
                    no_group_group_name: 'Nombre del grupo:',
                    no_group_max_members: 'Máximo de miembros:',
                    no_group_description: 'Descripción:',
                    no_group_close: 'Cerrar',
                    no_group_join_group: 'Unirse a grupo',
                    no_group_join_blank: 'Unirse',
                    game_single_player: 'Un Solo Jugador',
                    game_single_player_ai: 'Un Solo Jugador (IA)',
                    game_multiplayer: 'Multijugador',
                    profile_uuid: 'ID del jugador:',
                    profile_name: 'Nombre:',
                    profile_created_at: 'Fecha de creación de cuenta:',
                    profile_performance_statistics: 'Estadísticas de Desempeño',
                    profile_points: 'Puntuación total:',
                    profile_nwins: 'Número de victorias:',
                    profile_n_correct_answers: 'Respuestas correctas:',
                    profile_n_wrong_answers: 'Respuestas incorrectas:',
                    profile_last_game_id: 'ID de la última partida: ',
                    profile_questions: 'Preguntas:',
                    profile_last_game_questions_question_blank: 'Pregunta ',
                    profile_last_game_questions: 'Última Partida',
                    profile_last_game_questions_question: 'Pregunta: ',
                    profile_last_game_questions_correct_answer: 'Respuesta correcta: ',
                    profile_last_game_questions_incorrect_answer_1: 'Respuesta incorrecta 1: ',
                    profile_last_game_questions_incorrect_answer_2: 'Respuesta incorrecta 2: ',
                    profile_last_game_questions_incorrect_answer_3: 'Respuesta incorrecta 3: '
                }
            },

        }
    });
    

export default i18n;