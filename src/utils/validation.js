// src/utils/validation.js
export const validateEmail = (email) => {
  return /^[^\s@]+@(gmail|yahoo|outlook|hotmail|icloud|aol)\.com$/.test(email);
  };
  
  export const validateName = (name) => {
    return name.trim().length >= 3;
  };
  