export const validateEmail = (correo) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(correo).toLowerCase());
};

export const validatePassword = (contrasena, minLength = 8) => {
    return typeof contrasena === 'string' && contrasena.length >= minLength && /[A-Z]/.test(contrasena) && /[a-z]/.test(contrasena) && /\d/.test(contrasena);
}

export const isRequired = (value) => {
    return value !== undefined && value !== null && value.toString().trim() !== '';
};

export const minLength = (value, length) => {
    return value?.length >= length;  
};

export const isPositiveNumber = (value) => {
    return !isNaN(value) && Number(value) > 0;
};

export const validateName = (name) => {
    return name.trim().length > 0;
};

