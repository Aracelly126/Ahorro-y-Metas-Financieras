import {createContext, useContext, useState, useEffect, Children} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(()=>{
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('usuario');
        return token ? { token, user: JSON.parse(user)} : null;
    });

    const login = ({ token, usuario }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("usuario", JSON.stringify(usuario));
        setAuth({ token, usuario });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        setAuth(null);
    };

    return(
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);