// import React, { useState } from 'react';
// import { updateUserScore } from '../services/api';
// import ScoreBoard from '../components/ScoreBoard';

// const GamePage = ({ email }) => {
//     useEffect(() => {
//         console.log("Email in GamePage:", email);  // This will print when the component is first rendered or when email changes
//       }, [email]); 
//   const [score, setScore] = useState(0);

//   const handleHit = async () => {
//     const newScore = score + 10;
//     setScore(newScore);

//     try {
//       await updateUserScore(email, newScore);
//       console.log('Score updated successfully');
//     } catch (error) {
//       console.error('Failed to update score:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Game Page</h2>
//       <ScoreBoard email={email} />
//       <button onClick={handleHit}>Hit Target (+10 Points)</button>
//     </div>
//   );
// };

// export default GamePage;
