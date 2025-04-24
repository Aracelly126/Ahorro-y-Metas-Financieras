import {createContext, useContext, useState, useEffect, Children} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ Children }) => {
    const [auth, setAuth] = useState(()=>{
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        return token ? { token, user: JSON.parse(user)} : null;
    });

    const login = ({ token, user }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setAuth({ token, user });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuth(null);
    };

    return(
        <AuthContext.Provider value={{ auth, login, logout }}>
            {Children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);