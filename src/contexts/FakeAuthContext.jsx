import { createContext, useContext, useReducer } from "react";

const initialState = {
    user: null,
    isAuthenticated: false,
};

const AuthContext = createContext();

function reducer(state, action) {
    switch (action.type) {
        case "login":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        case "logout":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        case "loginFailed":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
            };
        default:
            throw new Error("Unknown action type.");
    }
}

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
    const [{ user, isAuthenticated }, dispatch] = useReducer(
        reducer,
        initialState
    );

    function login(email, password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password) {
            return dispatch({ type: "login", payload: FAKE_USER });
        }

        dispatch({
            type: "loginFailed",
            payload: "Wrong email or password",
        });
    }

    function logout() {
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext was used outside the AuthProvider");
    }

    return context;
}

export { AuthProvider, useAuth };