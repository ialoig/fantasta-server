
const errorMessages = {
    'BAD_REQUEST': {
        title: 'bad_request',
        subTitle: 'params_not_correct'
    },
    'NOT_FOUND': {
        title: 'not_found',
        subTitle: 'item_not_found'
    },
    'USER_NOT_FOUND': {
        title: 'user_not_found',
        subTitle: 'try_change_username'
    },
    'USER_PRESENT': {
        title: 'user_present',
        subTitle: 'try_change_username'
    },
    'LEAGUE_NOT_FOUND' : {
        title: 'league_not_found',
        subTitle: 'try_change_leaguename'
    },
    'LEAGUE_PRESENT': {
        title: 'league_present',
        subTitle: 'try_change_leaguename'
    },
    'INT_SERV_ERR': {
        title: 'server_error',
        subTitle: 'something_went_wrong'
    },
    'WRONG_PASSWORD': {
        title: 'wrong_password',
        subTitle: 'try_change_password'
    },
    'WRONG_USER': {
        title: 'wrong_user',
        subTitle: 'try_change_user'
    },
    'FULL_LEAGUE': {
        title: 'league_full',
        subTitle: 'cannot_join_league'
    },
    'LEAGUE_NAME_EMPTY' : {
        title: 'league_name_empty',
        subTitle: 'name_need_value'
    },
    'USERNAME_EMPTY': {
        title: 'username_empty',
        subTitle: 'username_need_value'
    },
    'LEAGUE_NAME_SHORTS': {
        title: 'league_name_short',
        subTitle: 'league_min_length_6'
    },
    'LEAGUE_PASSWORD_EMPTY': {
        title: 'league_password_empty',
        subTitle: 'password_need_value'
    },
    'LEAGUE_PASSWORD_SHORT': {
        title: 'league_password_short',
        subTitle: 'passowrd_min_length_6'
    },
    'LEAGUE_ATTENDEES_NOT_CORRECT': {
        title: 'league_attendees_not_correct',
        subTitle: 'min_attendees_2'
    },
    'PARAMS_MISSING': {
        title: 'params_missing',
        subTitle: 'fill_fields_and_retry'
    },
    'CUSTOM_STARTINGPRICE_ERROR': {
        title: 'custom_startingPrice_not_correct',
        subTitle: 'fill_starting_price'
    },
    'PLAYERS_NUMBER_ERROR': {
        title: 'players_number_not_correct',
        subTitle: 'modify_number_players_and_retry'
    },
    '11000' : {
        title: 'item_used',
        subTitle: 'chooseOtherName'
    }
};

module.exports = errorMessages;