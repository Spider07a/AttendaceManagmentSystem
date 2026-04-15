import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        ref={ref}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
});

export default Input;
