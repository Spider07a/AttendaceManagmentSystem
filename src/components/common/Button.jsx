import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variantClass = `btn-${variant}`;
  return (
    <button 
      className={`btn ${variantClass} ${props.disabled ? 'btn-disabled' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
