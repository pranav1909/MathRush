import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { styled } from '@mui/system';
import Report from './Report';

const getRandomNumber = () => Math.floor(Math.random() * 8) + 2;

const generateQuestions = () => {
  const questions = new Set();
  while (questions.size < 64) {
    const num1 = getRandomNumber();
    const num2 = getRandomNumber();
    const question = `${num1} + ${num2}`;
    questions.add(question);
  }
  return Array.from(questions).map(q => {
    const [num1, num2] = q.split(' + ').map(Number);
    return { num1, num2, answer: num1 + num2 };
  });
};

const MathRush = () => {
  const [questions, setQuestions] = useState(generateQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [questionData, setQuestionData] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const currentQuestion = questions[currentIndex];

  const startGame = () => {
    setStartTime(Date.now());
    setGameStarted(true);
  };

  const nextQuestion = useCallback(
    (resetTimer, timedOut = false) => {
      const timeTaken = 10 - timer;

      setQuestionData(prevData => [
        ...prevData,
        {
          num1: currentQuestion.num1,
          num2: currentQuestion.num2,
          userAnswer: timedOut ? 'NA' : userAnswer,
          correctAnswer: currentQuestion.answer,
          timeTaken: timedOut ? 10 : timeTaken,
          userCorrect: parseInt(userAnswer) === currentQuestion.answer,
        },
      ]);

      setUserAnswer('');
      if (resetTimer) setTimer(10);
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setGameOver(true);
        setTotalTimeTaken((Date.now() - startTime) / 1000); // Calculate total time in seconds
      }
    },
    [currentQuestion, currentIndex, timer, userAnswer, startTime, questions.length]
  );

  useEffect(() => {
    if (gameOver || !gameStarted) return;

    const timerInterval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          nextQuestion(false, true);
          return 10;
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timer, gameOver, gameStarted, nextQuestion]);

  const handleAnswerSubmit = useCallback(() => {
    nextQuestion(true);
  }, [nextQuestion]);

  const handleKeyPress = (value) => {
    if (value === 'back') {
      setUserAnswer(prev => prev.slice(0, -1));
    } else {
      setUserAnswer(prev => (prev + value).slice(0, 2));
    }
  };

  useEffect(() => {
    if (userAnswer.length === 2 || (userAnswer.length > 0 && parseInt(userAnswer) === currentQuestion.answer)) {
      handleAnswerSubmit();
    }
  }, [userAnswer, currentQuestion.answer, handleAnswerSubmit]);

  const restartGame = () => {
    setQuestions(generateQuestions());
    setCurrentIndex(0);
    setUserAnswer('');
    setTimer(10);
    setGameOver(false);
    setQuestionData([]);
    setTotalTimeTaken(0);
    setGameStarted(false);
  };

  if (gameOver) {
    return (
      <Report
        questionData={questionData}
        totalTimeTaken={totalTimeTaken}
        onRestart={restartGame}
      />
    );
  }

  if (!gameStarted) {
    return (
      <Box sx={styles.container}>
        <Typography variant="h3" sx={styles.logoOne}>
          MathRush
        </Typography>
        <Box sx={styles.footer}>
          <Button variant="contained" onClick={startGame} sx={styles.startButton}>
            Start Game
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Typography variant="h4" sx={styles.logo}>
        MathRush
      </Typography>
      <Box sx={styles.header}>
        <Typography variant="subtitle1" sx={styles.infoText}>
          Question {currentIndex + 1} / 64
        </Typography>
        <Typography variant="subtitle1" sx={styles.infoText}>
          Time Left: {timer} s
        </Typography>
      </Box>

      <Typography variant="h2" sx={styles.question}>
        {currentQuestion.num1} + {currentQuestion.num2}
      </Typography>

      <TextField
        value={userAnswer}
        variant="outlined"
        InputProps={{
          readOnly: true,
        }}
        sx={styles.answerDisplay}
      />

      <Box sx={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'back', 0].map((value, index) => (
          <KeypadButton key={index} onClick={() => handleKeyPress(value)}>
            {value === 'back' ? '⌫' : value}
          </KeypadButton>
        ))}
      </Box>
    </Box>
  );
};

const KeypadButton = styled(Button)({
  fontSize: '1.5em',
  padding: '15px',
  color: '#ffffff',
  backgroundColor: '#87a8a4',
  borderRadius: '8px',
  width: '100%',
  height: '100%',
  disableRipple: true,
  '&:active': {
    transform: 'scale(0.95)',
  },
  '&:hover': {
    backgroundColor: '#87a8a4',
  },
});


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f1f7f9',
    height: '100vh',
    justifyContent: 'flex-start',
  },
  logoOne: {
    fontFamily: "'Pacifico', cursive",
    color: '#6c5b7b',
    fontSize: '2.2em',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  logo: {
    fontFamily: "'Pacifico', cursive",
    color: '#6c5b7b',
    fontSize: '2.2em',
    marginTop: '20px',
    marginBottom: '50px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '90vw',
    padding: '0 15px',
  },
  infoText: {
    fontSize: '1em',
    color: '#8baaae',
  },
  question: {
    fontSize: '3.5em',
    color: '#709fb0',
    textAlign: 'center',
    margin: '30px 0',
  },
  answerDisplay: {
    fontSize: '2em',
    textAlign: 'center',
    width: '100px',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    width: '100%',
    maxWidth: '300px',
    margin: '100px 0',
  },
  footer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: '30px',
  },
  startButton: {
    fontSize: '1.2em',
    backgroundColor: '#6a4c93',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#9d5c7b',
    },
    padding: '10px 20px',
  },
};

export default MathRush;