import React, { useState } from "react";
import { loginService } from "./loginService";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../shared/utils/validation";


const Login = () => {
    const { Login } = useAuth();
    const [correo, setCorreo] = useState("");
    const [contrasena, setContraseña] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(correo)) return setError("El correo electrónico no es válido.");
        if (!validatePassword(contrasena)) return setError("La contraseña no es válida.");
        
        try {
            const data = await loginService(correo, contrasena);
            if (data.error) {
                setError(data.error);
            } else {
                Login(data);
            }
        } catch (error) {
            setError("Error en la autenticación. Por favor, inténtelo de nuevo.");
        }
    };

    return (
        <div className="login-container">
            <h2>Iniciar sesión</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: "red"}}>{error}</p>}
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                />
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    );
};

export default Login;