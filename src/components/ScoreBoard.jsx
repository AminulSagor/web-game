import React, { useEffect, useState } from 'react';
import { getUserScore } from '../services/api';

const ScoreBoard = ({ email }) => {
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const data = await getUserScore(email);
        setScore(data.score);
      } catch (error) {
        console.error('Failed to fetch score:', error);
      }
    };
    fetchScore();
  }, [email]);

  return (
    <div>
      <h3>Score: {score !== null ? score : 'Loading...'}</h3>
    </div>
  );
};

export default ScoreBoard;
