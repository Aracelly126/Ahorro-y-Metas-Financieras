export const getCategories = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
  
    const response = await fetch(`${apiUrl}/categories`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error al obtener categorías:', errorData);
      throw new Error('No se pudieron obtener las categorías');
    }
  
    return await response.json();
  };
  