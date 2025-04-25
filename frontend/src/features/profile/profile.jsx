import { useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaVenusMars, 
  FaBirthdayCake, 
  FaLock,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    user_nombre: user?.user_nombre || "",
    user_apellido: user?.user_apellido || "",
    user_genero: user?.user_genero || "",
    user_fec_nac: user?.user_fec_nac || "",
    email: user?.email || "",
    password: "",
    user_foto: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "user_foto" && files && files[0]) {
      setPreviewImage(URL.createObjectURL(files[0]));
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    }
  };

  const genderOptions = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Femenino" },
    { value: "O", label: "Otro" }
  ];

  return (
    <div className="max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">

      {/* Contenido */}
      <div className="p-8">
        {/* Foto de perfil */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 rounded-full border-4 border-blue-100 shadow-md overflow-hidden bg-gray-100">
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
            ) : user?.user_foto ? (
              <img 
                src={`${import.meta.env.VITE_API_URL}/${user.user_foto}`} 
                alt="Perfil" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-blue-400">
                <FaUser className="text-5xl" />
              </div>
            )}
            
            {isEditing && (
              <label className="absolute bottom-6 right-8 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 transition"
              >
                <FaSave className="mr-2" /> Guardar
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setPreviewImage(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center hover:bg-gray-600 transition"
              >
                <FaTimes className="mr-2" /> Cancelar
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition"
            >
              <FaEdit className="mr-2" /> Editar Perfil
            </button>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Nombre
            </label>
            {isEditing ? (
              <input
                name="user_nombre"
                type="text"
                value={formData.user_nombre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">{user?.user_nombre || "No especificado"}</div>
            )}
          </div>

          {/* Apellido */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FaUser className="mr-2 text-blue-600" /> Apellido
            </label>
            {isEditing ? (
              <input
                name="user_apellido"
                type="text"
                value={formData.user_apellido}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">{user?.user_apellido || "No especificado"}</div>
            )}
          </div>

          {/* Género */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FaVenusMars className="mr-2 text-blue-600" /> Género
            </label>
            {isEditing ? (
              <select
                name="user_genero"
                value={formData.user_genero}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Seleccionar...</option>
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                {genderOptions.find(g => g.value === user?.user_genero)?.label || "No especificado"}
              </div>
            )}
          </div>

          {/* Fecha de Nacimiento */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FaBirthdayCake className="mr-2 text-blue-600" /> Fecha de Nacimiento
            </label>
            {isEditing ? (
              <input
                name="user_fec_nac"
                type="date"
                value={formData.user_fec_nac}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">
                {user?.user_fec_nac ? new Date(user.user_fec_nac).toLocaleDateString() : "No especificado"}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center">
              <FaEnvelope className="mr-2 text-blue-600" /> Correo Electrónico
            </label>
            {isEditing ? (
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            ) : (
              <div className="px-4 py-2 bg-gray-50 rounded-lg">{user?.email || "No especificado"}</div>
            )}
          </div>

          {/* Contraseña (solo en edición) */}
          {isEditing && (
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center">
                <FaLock className="mr-2 text-blue-600" /> Nueva Contraseña
              </label>
              <input
                name="password"
                type="password"
                placeholder="Dejar en blanco para no cambiar"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <p className="text-xs text-gray-500 mt-1">
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