 // Reusable Button Component
  const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2';
    const variants = {
      primary: 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg transform hover:-translate-y-0.5',
      secondary: 'border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white'
    };
    
    return (
      <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  };

  export default Button;