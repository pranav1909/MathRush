import React from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const Report = ({ questionData, totalTimeTaken, onRestart }) => {
    const totalQuestions = questionData.length;
    const correctAnswers = questionData.filter(q => q.userCorrect).length;
    const accuracy = ((correctAnswers / totalQuestions) * 100).toFixed(2);

    return (
        <Box sx={styles.container}>
            <Typography variant="h4" sx={styles.title}>
                MathRush Report
            </Typography>

            <Typography variant="h6" sx={styles.summary}>
                Total Time: {totalTimeTaken}s
            </Typography>
            <Typography variant="h6" sx={styles.summary}>
                Accuracy: {accuracy}%
            </Typography>

            <Box sx={styles.tableContainer}>
                <Table size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Answer</TableCell>
                            <TableCell>User</TableCell>
                            <TableCell>Time (s)</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questionData
                            .sort((a, b) => b.timeTaken - a.timeTaken)
                            .map((q, index) => (
                                <TableRow key={index}>
                                    <TableCell>{`${q.num1} + ${q.num2}`}</TableCell>
                                    <TableCell>{q.correctAnswer}</TableCell>
                                    <TableCell>{q.userAnswer}</TableCell>
                                    <TableCell>{q.timeTaken}</TableCell>
                                    <TableCell>{q.userCorrect ? 'Right' : q.userAnswer === 'NA' ? 'NA' : 'Wrong'}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Box>

            <Button variant="contained" onClick={onRestart} sx={styles.restartButton}>
                Restart
            </Button>
        </Box>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px',
        backgroundColor: '#EFFFFF',
        height: '97vh',
    },
    title: {
        fontFamily: "'Pacifico', cursive",
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: '#c44536',
        marginBottom: '20px',
    },
    summary: {
        fontSize: '1.2em',
        color: '#6a4c93',
        marginBottom: '10px',
    },
    tableContainer: {
        overflowX: 'auto',
        maxHeight: '60vh',
        width: '100%',
        margin: '10px 0',
    },
    restartButton: {
        marginTop: '15px',
        backgroundColor: '#6a4c93',
        color: '#ffffff',
        '&:hover': {
            backgroundColor: '#9d5c7b',
        },
    },
};

export default Report;