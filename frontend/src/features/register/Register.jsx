import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { registerService } from "../services/authService";
import { validateEmail, validatePassword, validateName, isRequired } from "../../shared/utils/validation";

const Register = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        cedula: "",
        nombre: "",
        apellido: "",
        genero: "",
        fechaNacimiento: "",
        correo: "",
        contrasena: "",
        foto: null
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

        const { cedula, nombre, apellido, genero, fechaNacimiento, correo, contrasena, foto } = formData;

        if (!isRequired(cedula) || !isRequired(nombre) || !isRequired(apellido) || !isRequired(genero) || !isRequired(fechaNacimiento) || !foto)
            return setError("Todos los campos son obligatorios.");
        if (!validateEmail(correo)) return setError("Correo inválido.");
        if (!validatePassword(contrasena)) return setError("Contraseña débil.");

        const data = new FormData();
        data.append("cedula", cedula);
        data.append("nombre", nombre);
        data.append("apellido", apellido);
        data.append("genero", genero);
        data.append("fechaNacimiento", fechaNacimiento);
        data.append("correo", correo);
        data.append("contrasena", contrasena);
        data.append("foto", foto);

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
                    <input name="cedula" type="text" placeholder="Cédula" className="input" value={formData.cedula} onChange={handleChange} />
                    <input name="nombre" type="text" placeholder="Nombre" className="input" value={formData.nombre} onChange={handleChange} />
                    <input name="apellido" type="text" placeholder="Apellido" className="input" value={formData.apellido} onChange={handleChange} />

                    <select name="genero" className="input" value={formData.genero} onChange={handleChange}>
                        <option value="">Seleccione género</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                    </select>

                    <input name="fechaNacimiento" type="date" className="input" value={formData.fechaNacimiento} onChange={handleChange} />

                    <input name="correo" type="email" placeholder="Correo electrónico" className="input" value={formData.correo} onChange={handleChange} />
                    <input name="contrasena" type="password" placeholder="Contraseña" className="input" value={formData.contrasena} onChange={handleChange} />

                    <label className="text-sm font-medium text-gray-600">Foto de perfil</label>
                    <input name="foto" type="file" accept="image/*" className="file-input" onChange={handleChange} />

                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Registrarse</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
