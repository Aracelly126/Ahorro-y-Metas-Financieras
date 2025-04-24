import React, { useState } from "react";
import { loginService } from "./loginService";
import { useAuth } from "../../context/AuthContext";
import { validateEmail, validatePassword } from "../../shared/utils/validation";
import Button from "../../shared/components/Button";

const Login = () => {
    const { login } = useAuth();
    const [email, setCorreo] = useState("");
    const [password, setContraseña] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!validateEmail(email)) {
            setIsLoading(false);
            return setError("El correo electrónico no es válido.");
        }
        if (!validatePassword(password)) {
            setIsLoading(false);
            return setError("La contraseña no es válida.");
        }
        
        try {
            const data = await loginService(email, password);
            if (data.error) {
                setError(data.error);
            } else {
                login(data);
            }
        } catch (error) {
            setError("Error en la autenticación. Por favor, inténtelo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Cabecera con logo */}
                <div className="bg-blue-600 py-8 px-6 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                            {/* Reemplazar con logo real */}
                            <div className="text-blue-700 font-bold text-xl">COOP</div>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
                    <p className="mt-2 text-blue-100">Inicia sesión en tu cuenta</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="correo@cooperativa.com"
                                    value={email}
                                    onChange={(e) => setCorreo(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setContraseña(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Button 
                                type="submit"
                                variant="primary"
                                className="w-full py-3 px-4 text-lg"
                                isLoading={isLoading}
                            >
                                Iniciar sesión
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-600">
                        <p>
                            ¿No tienes una cuenta?{' '}
                            <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                Regístrate aquí
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;