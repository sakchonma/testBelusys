
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './containners/HomePage';
import StudentPage from './containners/Student';
import ClassroomPage from './containners/Classroom';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/students" element={<StudentPage />} />
        <Route path="/classrooms" element={<ClassroomPage />} />
      </Routes>
    </Router>
  );
};

export default App;
