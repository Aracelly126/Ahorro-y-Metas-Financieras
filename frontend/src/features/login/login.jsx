import React, { useState } from "react";
import { loginService } from "./loginService";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../shared/utils/validation";
import Button from "../../shared/components/Button";

const Login = () => {
    const { login } = useAuth();
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-xl">
            <div className="flex justify-center">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6 overflow-hidden border-4 border-green-100">
                        <span className="text-xs text-gray-400">Logo Cooperativa</span>
                        {/* <img src="/logo-cooperativa.png" alt="Logo Cooperativa" className="w-full h-full object-contain" /> */}
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Iniciar sesión
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Accede a tu cuenta de la cooperativa
                    </p>
                </div>
                
                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="correo@cooperativa.com"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="••••••••"
                                value={contrasena}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                        </div>

                    <div>
                        <Button 
                            type="submit" 
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                            Iniciar sesión
                        </Button>
                    </div>
                </form>
                
                <div className="text-center text-sm text-gray-600">
                    <p>
                        ¿No tienes una cuenta?{' '}
                        <a href="#" className="font-medium text-green-600 hover:text-green-500">
                            Regístrate
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;