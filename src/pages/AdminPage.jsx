import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { validateEmail } from "../utils/validation";

const AdminPage = () => {
  const [validEmails, setValidEmails] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "gameUser"));
        const emails = [];
        let total = 0;

        querySnapshot.forEach((doc) => {
          total++;
          const data = doc.data();
          if (validateEmail(data.email)) {
            emails.push(data.email);
          }
        });

        setValidEmails(emails);
        setTotalCount(total);
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1e1e1e",
      color: "#fff",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        background: "#2c2c2c",
        padding: "30px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        textAlign: "center"
      }}>
        <h2 style={{ marginBottom: "20px" }}>📊 Admin Panel - Email Stats</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>📦 Total Emails: <b>{totalCount}</b></p>
            <p>✅ Valid Emails: <b>{validEmails.length}</b></p>
            <p>❌ Invalid Emails: <b>{totalCount - validEmails.length}</b></p>
            <div style={{
              maxHeight: "300px",
              overflowY: "auto",
              textAlign: "left",
              padding: "10px",
              border: "1px solid #444",
              borderRadius: "8px",
              background: "#1a1a1a",
              marginTop: "20px"
            }}>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {validEmails.map((email, index) => (
                  <li key={index} style={{
                    padding: "6px 0",
                    borderBottom: "1px solid #333"
                  }}>{email}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
