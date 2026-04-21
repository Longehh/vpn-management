//const BASE_URL = "https://api.magicmayhem.co.uk/api/"
const BASE_URL = "https://vpn.azurax.net/api/"

//VPN
const VPN = BASE_URL + "vpn/"
const GET_VPNS = VPN + "list"
const CREATE_VPN = VPN + "create"
const DELETE_VPN = VPN + "revoke/"
// Authentication
const AUTH = BASE_URL + "auth/"
const LOGOUT= AUTH + "logout"
const REFRESH = AUTH + "refresh"
const GET_USERS = AUTH + "users"
const LOGIN = AUTH + "login"
const VERIFY = AUTH + "verify"
const CREATE_USER = AUTH + "create-user"
const DELETE_USER = AUTH + "users/"


module.exports = {
    GET_USERS,
    LOGIN,
    LOGOUT,
    VERIFY,
    CREATE_USER,
    DELETE_USER,
    REFRESH,
    GET_VPNS,
    CREATE_VPN,
    DELETE_VPN
}



