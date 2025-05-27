import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = 'rounded-full font-medium transition-all duration-200 flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-md hover:shadow-lg',
    secondary: 'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700 shadow-md hover:shadow-lg',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100',
    text: 'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-4 py-1.5',
    md: 'text-base px-6 py-2.5',
    lg: 'text-lg px-8 py-3',
  };
  
  const disabledClasses = disabled || isLoading 
    ? 'opacity-60 cursor-not-allowed' 
    : '';
  
  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    }
    
    if (icon && iconPosition === 'left') {
      return <span className="mr-2">{icon}</span>;
    }
    
    return null;
  };
  
  const getRightIcon = () => {
    if (icon && iconPosition === 'right' && !isLoading) {
      return <span className="ml-2">{icon}</span>;
    }
    
    return null;
  };
  
  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      {...props}
    >
      {getIcon()}
      {children}
      {getRightIcon()}
    </motion.button>
  );
};

export default Button;