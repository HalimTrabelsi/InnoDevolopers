import React, { useState, useEffect } from "react";
import Confetti from 'react-confetti';
import { ProgressBar } from 'react-bootstrap'; 

const Investment = () => {
  // States for goal, progress, and quotes
  const [goal, setGoal] = useState(20000); // Default goal (20,000 DT)
  const [currentSavings, setCurrentSavings] = useState(0);
  const [quote, setQuote] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Example quotes for motivation
  const quotes = [
    "You're on track for growth!",
    "Keep going, you're almost there!",
    "Amazing progress! You're doing great!",
    "Fantastic! You're crushing your goals!",
  ];

  // Function to handle goal setting
  const handleGoalChange = (e) => {
    setGoal(e.target.value);
  };

  // Function to handle savings update
  const handleSavingsChange = (e) => {
    setCurrentSavings(e.target.value);
  };

  // Function to handle milestone achievement
  const checkMilestone = () => {
    const milestone = Math.floor(currentSavings / (goal / 5)) * (goal / 5);
    if (currentSavings >= milestone) {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000); // Hide confetti after 3 seconds
    }
  };

  // Effect to check milestone achievement when savings change
  useEffect(() => {
    checkMilestone();
  }, [currentSavings]);

  // Calculate progress percentage
  const progress = (currentSavings / goal) * 100;

  return (
    <div className="savings-tracker">
      {/* Confetti effect when milestone is achieved */}
      {showConfetti && <Confetti />}

      <h2 className="tracker-title">Savings Milestones Tracker</h2>

      {/* Goal input */}
      <div className="goal-setting">
        <label htmlFor="goal">Set your financial goal for the year:</label>
        <input
          type="number"
          id="goal"
          value={goal}
          onChange={handleGoalChange}
          className="goal-input"
        />
      </div>

      {/* Current savings input */}
      <div className="savings-input">
        <label htmlFor="currentSavings">Current Savings:</label>
        <input
          type="number"
          id="currentSavings"
          value={currentSavings}
          onChange={handleSavingsChange}
          className="savings-input-field"
        />
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <ProgressBar
          now={progress}
          label={`${progress.toFixed(2)}%`}
          variant="success"
        />
      </div>

      {/* Milestone message */}
      {quote && (
        <div className="milestone-message">
          <h3>{quote}</h3>
        </div>
      )}

      {/* Visualizing savings goals */}
      <div className="savings-goals">
        <h4>Milestones:</h4>
        <ul>
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              <strong>{((i + 1) * 20)}%</strong> - {((i + 1) * (goal / 5)).toFixed(0)} DT
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default Investment;
