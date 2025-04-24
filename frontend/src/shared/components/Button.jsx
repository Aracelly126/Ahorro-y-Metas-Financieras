const Button = ({ type = "button", variant = "primary", className = "", children, isLoading = false, ...props }) => {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition shadow-md text-lg flex justify-center items-center";
  
  const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
  };
  
  return (
      <button
          type={type}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          disabled={isLoading}
          {...props}
      >
          {isLoading ? (
              <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
              </>
          ) : (
              children
          )}
      </button>
  );
};

export default Button;