import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { registerService } from "../register/registerService";
import { validateEmail, validatePassword, validateName, isRequired } from "../../shared/utils/validation";


const Register = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        user_nombre: "",
        user_apellido: "",
        user_genero: "",
        user_fec_nac: "",
        email: "",
        password: "",
        user_foto: null
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { user_nombre, user_apellido, user_genero, user_fec_nac, email, password, user_foto } = formData;

        if (!isRequired(user_nombre) || !isRequired(user_apellido) || !isRequired(user_genero) || !isRequired(user_fec_nac) || !user_foto)
            return setError("Todos los campos son obligatorios.");
        if (!validateEmail(email)) return setError("Correo inválido.");
        if (!validatePassword(password)) return setError("Contraseña débil.");

        const data = new FormData();
        data.append("user_nombre", user_nombre);
        data.append("user_apellido", user_apellido);
        data.append("user_genero", user_genero);
        data.append("user_fec_nac", user_fec_nac);
        data.append("email", email);
        data.append("password", password);
        data.append("user_foto", user_foto);

        const response = await registerService(data);

        if (response.error) {
            setError(response.error);
        } else {
            login(response); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 px-4 py-12">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header con logo cooperativo */}
                <div className="bg-blue-600 py-6 px-8">
                    <div className="flex justify-center">
                        <div className="bg-white p-2 rounded-full shadow-xl">
                            {/* Espacio para logo - reemplazar con imagen real */}
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl">
                                COOP
                            </div>
                        </div>
                    </div>
                    <h2 className="mt-5 text-center text-3xl font-bold text-white">
                        Únete a nuestra cooperativa
                    </h2>
                    <p className="mt-2 text-center text-blue-100 text-lg">
                        Completa el formulario para registrar tu cuenta
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    {error && (
                        <div className="text-sm text-red-700 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <span className="font-medium">Error:</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input 
                                name="user_nombre" 
                                type="text" 
                                placeholder="Ingresa tu nombre" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.user_nombre} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Apellido</label>
                            <input 
                                name="user_apellido" 
                                type="text" 
                                placeholder="Ingresa tu apellido" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.user_apellido} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Género</label>
                            <select 
                                name="user_genero" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.user_genero} 
                                onChange={handleChange}
                            >
                                <option value="">Seleccione género</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                            <input 
                                name="user_fec_nac" 
                                type="date" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.user_fec_nac} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="tucorreo@ejemplo.com" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.email} 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Crea una contraseña segura" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.password} 
                                onChange={handleChange} 
                            />
                            <p className="text-xs text-gray-500 mt-2">Mínimo 8 caracteres, incluyendo mayúsculas, números y símbolos</p>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            <label className="block text-sm font-medium text-gray-700">Foto de perfil</label>
                            <div className="flex flex-col items-center">
                                <div className="mb-4">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                                        {formData.user_foto ? (
                                            <img 
                                                src={URL.createObjectURL(formData.user_foto)} 
                                                alt="Preview" 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-300">
                                                <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <label className="cursor-pointer">
                                    <span className="px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition">
                                        Seleccionar imagen
                                    </span>
                                    <input 
                                        name="user_foto" 
                                        type="file" 
                                        accept="image/*" 
                                        className="sr-only" 
                                        onChange={handleChange} 
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-6">
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-lg text-lg"
                            >
                                Registrarse como socio
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-sm text-gray-500 mt-8">
                        <p>¿Ya tienes una cuenta? <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Inicia sesión</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;