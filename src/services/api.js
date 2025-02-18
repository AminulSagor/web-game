import axios from 'axios';

const API_URL = 'http://localhost:3000/users'; 


export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};


export const getUserScore = async (email) => {
  const response = await axios.get(`${API_URL}/score`, { params: { email } });
  return response.data;
};


export const updateUserScore = async (email, score) => {
  try {

    console.log("Updating score for user:", { email, score });

    const response = await axios.post(`${API_URL}/update-score`, { email, score });


    console.log("Response from API:", response);


    return response.data;
  } catch (error) {

    console.error("Error occurred while updating score:", error);
    

    throw error;
  }
};
