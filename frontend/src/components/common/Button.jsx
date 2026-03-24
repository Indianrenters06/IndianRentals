import React from 'react';
import Link from 'next/link';

/**
 * Reusable Button Component based on Design System v3.0
 * 
 * @param {Object} props
 * @param {'yellow' | 'black' | 'blue' | 'pill' | 'outline' | 'ghost'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg' | 'full'} props.size - Button size
 * @param {boolean} props.isLoading - Shows loading spinner if true
 * @param {boolean} props.disabled - Disables the button
 * @param {React.ReactNode} props.iconLeft - Optional icon before text
 * @param {React.ReactNode} props.iconRight - Optional icon after text
 * @param {string} props.className - Extra tailwind classes
 * @param {Function} props.onClick - Click handler
 * @param {'button' | 'submit' | 'reset'} props.type - Button type
 * @param {string} props.href - If provided, renders as a Link component
 */
const Button = ({
  children,
  variant = 'yellow',
  size = 'md',
  isLoading = false,
  disabled = false,
  iconLeft,
  iconRight,
  className = '',
  onClick,
  type = 'button',
  href,
  ...props
}) => {
  
  const baseClasses = 'inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer text-center rounded-md border h-10 w-full px-6 py-2 tablet:h-9 tablet:w-auto tablet:min-w-[110px] tablet:px-5.5 tablet:py-2.5 desktop:h-[35px] desktop:min-w-[120px] desktop:px-5 desktop:py-2';

  const variants = {
    yellow: `${baseClasses} bg-orange-300 text-black border-orange-300 hover:bg-orange-400 hover:border-orange-400 active:bg-orange-500 active:border-orange-500 focus:outline-none focus:ring-2 focus:ring-blue-info focus:ring-offset-2 focus:border-blue-info disabled:bg-orange-100 disabled:text-grey-400 disabled:border-orange-100 disabled:opacity-50 disabled:cursor-not-allowed`,
    black: `${baseClasses} bg-white text-black border-black hover:bg-black hover:text-white active:bg-grey-700 active:border-grey-700 active:text-white focus:outline-none focus:ring-2 focus:ring-blue-info focus:ring-offset-2 disabled:bg-white disabled:text-grey-300 disabled:border-grey-300 disabled:opacity-50 disabled:cursor-not-allowed`,
    blue: `${baseClasses} bg-blue-secondary text-white border-blue-secondary hover:bg-[#0689ff] hover:border-[#0689ff] active:bg-[#0859c5] active:border-[#0859c5] focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 disabled:bg-blue-50 disabled:text-grey-400 disabled:border-blue-50 disabled:opacity-50 disabled:cursor-not-allowed`,
    pill: 'inline-flex items-center justify-center font-semibold text-sm transition-all duration-200 cursor-pointer text-center rounded-full border border-grey-700 bg-white text-grey-700 px-5 py-2 hover:bg-grey-100 [&.selected]:bg-grey-700 [&.selected]:text-white [&.selected]:border-grey-700 focus:outline-none focus:ring-2 focus:ring-blue-info focus:ring-offset-2 disabled:bg-grey-50 disabled:text-grey-300 disabled:border-grey-200 disabled:opacity-50 disabled:cursor-not-allowed',
    outline: `${baseClasses} bg-transparent text-grey-800 border-grey-200 hover:border-grey-800`,
    ghost: `${baseClasses} bg-transparent text-grey-600 border-transparent hover:bg-grey-50 border-0`,
  };

  const sizes = {
    sm: '!h-8 !px-3 !text-xs !min-w-[100px]',
    md: '',
    lg: '!h-11 !px-7 !text-base !min-w-[150px]',
    full: '!w-full',
  };

  // Loading spinner component
  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const content = (
    <>
      {isLoading && <Spinner />}
      {!isLoading && iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {!isLoading && iconRight && <span className="ml-2">{iconRight}</span>}
    </>
  );

  const classes = `${variants[variant]} ${sizes[size]} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
