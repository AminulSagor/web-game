import { db, doc, setDoc, getDoc, updateDoc } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const registerUser = async (userData) => {  
  try {
    const userRef = doc(db, "gameUser", userData.email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("User already exists, keeping existing score.");
      return { success: true, message: "User already exists, proceeding to game." };
    }

    // ✅ Only set score to 0 for new users
    await setDoc(userRef, { ...userData, score: 0 });

    return { success: true, message: "New game user registered successfully." };
  } catch (error) {
    console.error("Error registering game user:", error);
    throw error;
  }
};



export const getGameUserScore = async (email) => {
  if (!email) throw new Error("Email is required to fetch score.");

  try {
    const userRef = doc(db, "gameUser", email);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data().score || 0 : 0;
  } catch (error) {
    console.error("Error fetching game user score:", error);
    throw error;
  }
};


export const updateUserScore = async (email, score) => { 
  try {
    const userRef = doc(db, "gameUser", email);
    await updateDoc(userRef, { score });

    console.log("Updated game user score successfully:", { email, score });
    return { success: true, message: "Game score updated successfully" };
  } catch (error) {
    console.error("Error updating game user score:", error);
    throw error;
  }
};



export const getAllUsersScores = async () => {
  try {
    const usersRef = collection(db, "gameUser");
    const snapshot = await getDocs(usersRef);
    
    if (snapshot.empty) {
      console.warn("No users found in Firestore!");
      return [];
    }

    const usersScores = snapshot.docs.map(doc => ({
      name: doc.data().name || "Unknown", // ✅ Get name, default to 'Unknown' if missing
      score: doc.data().score || 0,
    }));

    console.log("Fetched users' scores from Firestore:", usersScores);

    // Sort in descending order (highest score first) and return only the top 50
    return usersScores.sort((a, b) => b.score - a.score).slice(0, 50);
  } catch (error) {
    console.error("Error fetching all user scores:", error);
    throw error;
  }
};
