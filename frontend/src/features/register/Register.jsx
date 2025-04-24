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

        const {  user_nombre, user_apellido, user_genero, user_fec_nac, email, password, user_foto } = formData;

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-lg bg-white border rounded-lg shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-green-700">Registro de Usuario</h2>
                {error && <div className="text-sm text-red-600 bg-red-100 border border-red-300 p-2 rounded-md">{error}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                    <input name="user_nombre" type="text" placeholder="Nombre" className="input" value={formData.user_nombre} onChange={handleChange} />
                    <input name="user_apellido" type="text" placeholder="Apellido" className="input" value={formData.user_apellido} onChange={handleChange} />

                    <select name="user_genero" className="input" value={formData.user_genero} onChange={handleChange}>
                        <option value="">Seleccione género</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                    </select>

                    <input name="user_fec_nac" type="date" className="input" value={formData.user_fec_nac} onChange={handleChange} />

                    <input name="email" type="email" placeholder="Correo electrónico" className="input" value={formData.email} onChange={handleChange} />
                    <input name="password" type="password" placeholder="Contraseña" className="input" value={formData.password} onChange={handleChange} />

                    <label className="text-sm font-medium text-gray-600">Foto de perfil</label>
                    <input name="user_foto" type="file" accept="image/*" className="file-input" onChange={handleChange} />

                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Registrarse</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
