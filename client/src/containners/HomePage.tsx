import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <div className="homepage-box">
                <h1>Welcome to School Management System</h1>
                <button onClick={() => navigate('/students')}>
                    Go to Student Management
                </button>
                <button onClick={() => navigate('/classrooms')}>
                    Go to Classroom Management
                </button>
            </div>
        </div>
    );
};

export default HomePage;
