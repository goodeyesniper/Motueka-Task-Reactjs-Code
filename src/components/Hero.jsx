import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import TaskModal from './TaskModal';
import LoginRequiredDialog from './LoginRequiredDialog'; // Import the new reusable component

const Hero = ({ onTaskAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);

  const isAuthenticated = localStorage.getItem('token') !== null;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleShowWarning = () => setShowLoginWarning(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleCloseWarning = () => setShowLoginWarning(false);

  useEffect(() => {
    if (!isAuthenticated && showLoginWarning) {
      const handleOutsideClick = () => setShowLoginWarning(false);
      document.addEventListener('keydown', handleOutsideClick);
      return () => document.removeEventListener('keydown', handleOutsideClick);
    }
  }, [showLoginWarning, isAuthenticated]);

  return (
    <>
      <div className="container-fluid flex justify-center sticky top-13 z-10 bg-color-container">
        <div className="container max-w-6xl flex flex-row place-items-start">

          <button className="m-2 custom-btn-container custom-btn whitespace-nowrap" onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
            Post a Task
          </button>
          
          <Link to="/browsetask" className="custom-btn-container custom-btn m-2 whitespace-nowrap">
            Browse Tasks
          </Link>

        </div>
      </div>

      {isModalOpen && (
        <TaskModal onClose={handleCloseModal} onTaskAdded={onTaskAdded} />
      )}

      {/* Use the reusable component */}
      <LoginRequiredDialog open={showLoginWarning} onClose={handleCloseWarning} />
    </>
  );
};

export default Hero;
