import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const SwalAlert = {
    success: (title, text) => {
        MySwal.fire({
            icon: 'success',
            title: title || '¡Éxito!',
            text,
            confirmButtonColor: '#3b82f6',
        });
    },

    error: (title, text) => {
        MySwal.fire({
            icon: 'error',
            title: title || '¡Error!',
            text,
            confirmButtonColor: '#ef4444',
        });
    },

    warning: (title, text) => {
        MySwal.fire({
            icon: 'warning',
            title: title || 'Advertencia',
            text,
            confirmButtonColor: '#f59e0b',
        });
    },

    info: (title, text) => {
        MySwal.fire({
            icon: 'info',
            title: title || 'Información',
            text,
            confirmButtonColor: '#0ea5e9',
        });
    },

    confirm: async (title, text, confirmButtonText = "Sí", cancelButtonText = "Cancelar") => {
        const result = await MySwal.fire({
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: '#9ca3af',
        });

        return result.isConfirmed;
    }
};
