import { createContext } from "react";

const UAC_ROLE_UNDEF = 0x0;
const UAC_ROLE_USER = 0x1;
const UAC_ROLE_ADMIN = 0x2;

// Context used to keep track of current user preferences
const UserAuthenticationContext = createContext({
    username: undefined,
    firstname: undefined,
    lastname: undefined,
    admin: false,
    role: UAC_ROLE_USER
});

export default UserAuthenticationContext;
