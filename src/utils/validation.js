// src/utils/validation.js
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.com$/.test(email);
  };
  
  export const validateName = (name) => {
    return name.trim().length >= 3;
  };
  