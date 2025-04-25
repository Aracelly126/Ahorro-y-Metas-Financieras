import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaVenusMars,
  FaBirthdayCake,
  FaLock,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Profile = ({ darkMode }) => {
  const { user, updateUser } = useAuth();
  const { auth } = useAuth();
  const user1 = auth?.usuario;
  const foto = user1?.user_foto_url;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    user_nombre: user1?.user_nombre || "",
    user_apellido: user1?.user_apellido || "",
    user_genero: user1?.user_genero || "",
    user_fec_nac: user1?.user_fec_nac || "",
    email: user?.email || "",
    password: "",
    user_foto: foto,
  });
  const [previewImage, setPreviewImage] = useState(null);
  

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "user_foto" && files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
      setPreviewImage(null);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const genderOptions = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" },
    { value: "O", label: "Otro" },
  ];

  // Estilo base para campos de visualización y edición
  const fieldStyle = `px-4 py-3 rounded-lg w-full transition ${
    darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-800"
  }`;

  // Estilo para inputs de edición
  const inputStyle = `${fieldStyle} focus:ring-2 focus:outline-none ${
    darkMode
      ? "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
      : "border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  }`;

  return (
    <div
      className={`max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      {/* Contenido */}
      <div className="p-6 md:p-8 bg-gray-400 zindex-1">
        {/* Foto de perfil */}
        <div className="flex flex-col items-center mb-8">
          <div
            className={`relative w-32 h-32 rounded-full border-4 ${
              darkMode ? "border-blue-900" : "border-blue-100"
            } shadow-md overflow-hidden ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            {foto ? (
              <img
                src={foto}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : user1?.user_foto ? (
              <img
                src={`${import.meta.env.VITE_API_URL}/${user1.user_foto}`}
                alt="Perfil"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                  e.target.parentElement.classList.add(
                    "flex",
                    "items-center",
                    "justify-center"
                  );
                }}
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                <FaUser className="text-5xl" />
              </div>
            )}

            {isEditing && (
              <label
                className={`absolute bottom-6 right-8 p-2 rounded-full cursor-pointer transition ${
                  darkMode
                    ? "bg-blue-700 text-blue-100 hover:bg-blue-600"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <FaCamera />
                <input
                  type="file"
                  name="user_foto"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                />
              </label>
            )}
          </div>

          {isEditing ? (
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded-lg flex items-center transition ${
                  darkMode
                    ? "bg-green-700 text-white hover:bg-green-600"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                <FaSave className="mr-2" /> Guardar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setPreviewImage(null);
                }}
                className={`px-4 py-2 rounded-lg flex items-center transition ${
                  darkMode
                    ? "bg-gray-600 text-gray-100 hover:bg-gray-500"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                <FaTimes className="mr-2" /> Cancelar
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className={`mt-4 px-4 py-2 rounded-lg flex items-center transition ${
                darkMode
                  ? "bg-blue-700 text-blue-100 hover:bg-blue-600"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <FaEdit className="mr-2" /> Editar Perfil
            </button>
          )}
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Nombre */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium flex items-center ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              <FaUser className="mr-2" /> Nombre
            </label>
            {isEditing ? (
              <input
                name="user_nombre"
                type="text"
                value={formData.user_nombre}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Ingresa tu nombre"
                required
              />
            ) : (
              <div className={fieldStyle}>
                {user1?.user_nombre || (
                  <span className="text-gray-400">No especificado</span>
                )}
              </div>
            )}
          </div>

          {/* Apellido */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium flex items-center ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              <FaUser className="mr-2" /> Apellido
            </label>
            {isEditing ? (
              <input
                name="user_apellido"
                type="text"
                value={formData.user_apellido}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Ingresa tu apellido"
                required
              />
            ) : (
              <div className={fieldStyle}>
                {user1?.user_apellido || (
                  <span className="text-gray-400">No especificado</span>
                )}
              </div>
            )}
          </div>

          {/* Género */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium flex items-center ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              <FaVenusMars className="mr-2" /> Género
            </label>
            {isEditing ? (
              <select
                name="user_genero"
                value={formData.user_genero}
                onChange={handleChange}
                className={inputStyle}
              >
                <option value="">Selecciona tu género</option>
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className={fieldStyle}>
                {genderOptions.find((g) => g.value === user1?.user_genero)
                  ?.label || (
                  <span className="text-gray-400">No especificado</span>
                )}
              </div>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium flex items-center ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              <FaBirthdayCake className="mr-2" /> Fecha de Nacimiento
            </label>
            {isEditing ? (
              <input
                name="user_fec_nac"
                type="date"
                value={formData.user_fec_nac}
                onChange={handleChange}
                className={inputStyle}
              />
            ) : (
              <div className={fieldStyle}>
                {user1?.user_fec_nac ? (
                  new Date(user1.user_fec_nac).toLocaleDateString()
                ) : (
                  <span className="text-gray-400">No especificado</span>
                )}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2 space-y-2">
            <label
              className={`block text-sm font-medium flex items-center ${
                darkMode ? "text-blue-300" : "text-blue-600"
              }`}
            >
              <FaEnvelope className="mr-2" /> Correo Electrónico
            </label>
            {isEditing ? (
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle}
                placeholder="Ingresa tu correo electrónico"
                required
              />
            ) : (
              <div className={fieldStyle}>
                {user1?.email || (
                  <span className="text-gray-400">No especificado</span>
                )}
              </div>
            )}
          </div>

          {/* Contraseña (solo en edición) */}
          {isEditing && (
            <div className="md:col-span-2 space-y-2">
              <label
                className={`block text-sm font-medium flex items-center ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              >
                <FaLock className="mr-2" /> Nueva Contraseña
              </label>
              <input
                name="password"
                type="password"
                placeholder="Dejar en blanco para no cambiar"
                value={formData.password}
                onChange={handleChange}
                className={inputStyle}
              />
              <p
                className={`text-xs mt-1 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Mínimo 8 caracteres, incluyendo mayúsculas, números y símbolos
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
