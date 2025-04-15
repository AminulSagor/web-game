// src/pages/AdminPage.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig"; // your Firestore config
import { validateEmail } from "../utils/validation"; // reuse existing validation

const AdminPage = () => {
  const [validCount, setValidCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gameUser"));
        let count = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (validateEmail(data.email)) {
            count++;
          }
        });

        setValidCount(count);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Panel - Email Stats</h2>
      {loading ? <p>Loading...</p> : <p>✅ Valid Email Count: <b>{validCount}</b></p>}
    </div>
  );
};

export default AdminPage;
