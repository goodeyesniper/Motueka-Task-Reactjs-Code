import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskModal from './TaskModal';
import Footer from './Footer';
import LoginRequiredDialog from './LoginRequiredDialog';


const Home = () => {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to toggle modal visibility
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    const handleShowWarning = () => {
        document.activeElement?.blur(); // Remove focus from the triggering element. This removes Blocked aria-hidden on an element error in the console
        setShowLoginWarning(true);
    };
    const handleCloseWarning = () => setShowLoginWarning(false);

    useEffect(() => {
        if (!isAuthenticated && showLoginWarning) {
          const handleOutsideClick = () => setShowLoginWarning(false);
          document.addEventListener('keydown', handleOutsideClick);
          return () => document.removeEventListener('keydown', handleOutsideClick);
        }
      }, [showLoginWarning, isAuthenticated]);

    const handleOpenModal = () => {
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const handleTaskAdded = (newTask) => {
        // console.log("Task added:", newTask);
    };

    return (
        <>
            <div className="w-full lg:h-[860px] h-[760px] hero-bg flex justify-center items-center">
                {/* <img src="/handyman-1.jpg" alt="" className='object-cover object-[80%_center] bg-no-repeat w-full h-full'/> */}
                <div className="container max-w-5xl px-2 place-items-center lg:place-items-start">
                    <div className="grid grid-rows-1 lg:grid-rows-2 gap-10 place-items-center">
                        <div className="flex flex-col items-center justify-center md:items-start text-center md:text-start rounded-[8px] p-5 bg-card-color bg-card-border w-full sm:w-[500px]">
                            <h1 className='text-[1.4rem] font-bold pb-5'>Need help with a house task?</h1>
                            <p className='pb-8'>Share your task requirements in Motueka Tasks. It's always free to post.</p>
                            <button className="custom-btn-container custom-btn" onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                                Post a Task
                            </button>
                        </div>
                        <div className="flex flex-col items-center justify-center md:items-start text-center md:text-start rounded-[8px] p-5 bg-card-color bg-card-border w-full sm:w-[500px]">
                            <h1 className='text-[1.4rem] font-bold pb-5'>Earn money while helping others</h1>
                            <p className='pb-8'>Pick tasks that you love. Enjoy the flexibility of working when you want.</p>
                            <Link to='/browsetask' className='custom-btn-container custom-btn'>Browse Tasks</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid flex justify-center my-5">
                <div className="container max-w-7xl px-2 place-items-center mb-5">
                    <h1 className='text-3xl sm:text-4xl py-12 font-bold text-center'>Get your to dos done!</h1>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-10 mb-5 py-2 place-items-center">
                        <Link to="#" className='hover:scale-120 transition-transform duration-300 ease-in-out link-wrapper' onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                            <div className="flex flex-col items-center justify-center rounded-[8px] pt-2 w-[100px] bg-card-border bg-card-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#4BA0E8"><path d="M240-880h480L597-702v505L480-80 363-197v-505L240-880Zm183 329h114v-178l63-91H360l63 91v178Zm114 60H423v118h114v-118Zm0 261v-83H423v83l57 57 57-57Zm-57-321Zm0 178Zm0-178Zm0 60Zm0 178Z"/></svg>
                                <p className='py-2 link-text-color-no-style'>Assembly</p>
                            </div>
                        </Link>
                        <Link to="#" className='hover:scale-120 transition-transform duration-300 ease-in-out link-wrapper' onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                            <div className="flex flex-col items-center justify-center rounded-[8px] pt-2 w-[100px] bg-card-border bg-card-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#4BA0E8"><path d="M420-520h120v-280q0-25-17.25-42.5T480-860q-25.5 0-42.75 17.25T420-800v280ZM180-340h600v-120H180v120Zm-64 240h134v-90q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v90h140v-90q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v90h140v-90q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v90h134l-50-200H166l-50 200Zm702 60H142q-39 0-63-31t-14-69l55-220v-80q0-33 23.5-56.5T200-520h160v-280q0-50 35-85t85-35q50 0 85 35t35 85v280h160q33 0 56.5 23.5T840-440v80l55 220q10 38-14 69t-63 31Zm-38-420H180h600Zm-240-60H420h120Z"/></svg>
                                <p className='py-2'>Cleaning</p>
                            </div>
                        </Link>
                        <Link to="#" className='hover:scale-120 transition-transform duration-300 ease-in-out link-wrapper' onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                            <div className="flex flex-col items-center justify-center rounded-[8px] pt-2 w-[100px] bg-card-border bg-card-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#4BA0E8"><path d="M224.12-161q-49.12 0-83.62-34.42Q106-229.83 106-279H40v-461q0-24 18-42t42-18h579v167h105l136 181v173h-71q0 49.17-34.38 83.58Q780.24-161 731.12-161t-83.62-34.42Q613-229.83 613-279H342q0 49-34.38 83.5t-83.5 34.5Zm-.12-60q24 0 41-17t17-41q0-24-17-41t-41-17q-24 0-41 17t-17 41q0 24 17 41t41 17ZM100-339h22q17-27 43.04-43t58-16q31.96 0 58.46 16.5T325-339h294v-401H100v401Zm631 118q24 0 41-17t17-41q0-24-17-41t-41-17q-24 0-41 17t-17 41q0 24 17 41t41 17Zm-52-204h186L754-573h-75v148ZM360-529Z"/></svg>
                                <p className='py-2'>Moving</p>
                            </div>
                        </Link>
                        <Link to="#" className='hover:scale-120 transition-transform duration-300 ease-in-out link-wrapper' onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                            <div className="flex flex-col items-center justify-center rounded-[8px] pt-2 w-[100px] bg-card-border bg-card-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#4BA0E8"><path d="M450-130v-309h-20q-64 0-120.5-24.5T209-533q-44-45-66.5-104T120-760v-80h78.32Q260-840 317-815.5 374-791 419-746q33 34 54.5 76t30.5 89q7.65-11.9 16.82-22.95Q530-615 540-626q45-45 102-69.5T761.67-720H840v80q0 64-23.98 123T748-413q-45 45-101.56 69T528-320h-18v190h-60Zm1-370q0-61-20-113.5t-55-89q-35-36.5-86-57T180-780q0 63 18.5 115.5T252-575q42 45 90.5 60T451-500Zm59 120q60 0 111-19.5t86-56q35-36.5 54-89T780-660q-60 0-111 20.5T583-583q-43 45-58 94t-15 109Zm0 0Zm-59-120Z"/></svg>
                                <p className='py-2'>Gardening</p>
                            </div>
                        </Link>
                        <Link to="#" className='hover:scale-120 transition-transform duration-300 ease-in-out link-wrapper' onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                            <div className="flex flex-col items-center justify-center rounded-[8px] pt-2 w-[100px] bg-card-border bg-card-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#4BA0E8"><path d="M754-81q-8 0-15-2.5T726-92L522-296q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l85-85q6-6 13-8.5t15-2.5q8 0 15 2.5t13 8.5l204 204q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13l-85 85q-6 6-13 8.5T754-81Zm0-95 29-29-147-147-29 29 147 147ZM205-80q-8 0-15.5-3T176-92l-84-84q-6-6-9-13.5T80-205q0-8 3-15t9-13l212-212h85l34-34-165-165h-57L80-765l113-113 121 121v57l165 165 116-116-43-43 56-56H495l-28-28 142-142 28 28v113l56-56 142 142q17 17 26 38.5t9 45.5q0 24-9 46t-26 39l-85-85-56 56-42-42-207 207v84L233-92q-6 6-13 9t-15 3Zm0-96 170-170v-29h-29L176-205l29 29Zm0 0-29-29 15 14 14 15Zm549 0 29-29-29 29Z"/>
                                </svg>
                                <p className='py-2'>Handyman</p>
                            </div>
                        </Link>
                        <Link to="#" className='hover:scale-120 transition-transform duration-300 ease-in-out link-wrapper' onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                            <div className="flex flex-col items-center justify-center rounded-[8px] pt-2 w-[100px] bg-card-border bg-card-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#4BA0E8"><path d="M215-117q-33.83 0-66.92-11.5Q115-140 90-166q35-12 50-35t15-62q0-43.75 30.68-74.38Q216.35-368 260.18-368q43.82 0 74.32 30.62Q365-306.75 365-263q0 64-43.5 105T215-117Zm0-60q35 0 62.5-25t27.5-61q0-20-12.5-32.5T260-308q-20 0-32.5 12.5T215-263q0 39-8.5 57.5T175-183q6 1 20 3.5t20 2.5Zm230-177-90-95 376-376q14-14 31-14.5t32 14.5l29 29q15 15 14.5 32.5T823-732L445-354Zm-185 91Z"/></svg>
                                <p className='py-2'>Painting</p>
                            </div>
                        </Link>
                        <Link to="#" className='hover:scale-120 transition-transform duration-300 ease-in-out link-wrapper' onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                            <div className="flex flex-col items-center justify-center rounded-[8px] pt-2 w-[100px] bg-card-border bg-card-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#4BA0E8"><path d="M261-120q-24.75 0-42.37-17.63Q201-155.25 201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>
                                <p className='py-2'>Removals</p>
                            </div>
                        </Link>
                        <Link to="#" className='hover:scale-120 transition-transform duration-300 ease-in-out link-wrapper' onClick={isAuthenticated ? handleOpenModal : handleShowWarning}>
                            <div className="flex flex-col items-center justify-center rounded-[8px] pt-2 w-[100px] bg-card-border bg-card-color-2">
                                <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#4BA0E8"><path d="M484-247q16 0 27-11t11-27q0-16-11-27t-27-11q-16 0-27 11t-11 27q0 16 11 27t27 11Zm-35-146h59q0-26 6.5-47.5T555-490q31-26 44-51t13-55q0-53-34.5-85T486-713q-49 0-86.5 24.5T345-621l53 20q11-28 33-43.5t52-15.5q34 0 55 18.5t21 47.5q0 22-13 41.5T508-512q-30 26-44.5 51.5T449-393Zm31 313q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg>
                                <p className='py-2'>Others</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Render the TaskModal conditionally */}
            {isModalOpen && (
                <TaskModal 
                    onClose={handleCloseModal} 
                    onTaskAdded={handleTaskAdded}
                />
            )}

            <LoginRequiredDialog open={showLoginWarning} onClose={handleCloseWarning} />

            <div className="container-fluid flex justify-center mt-10 py-10 bg-color-container">
                <div className="container max-w-7xl px-2 place-items-center mt-10 pb-15">
                    <h1 className='text-2xl font-bold text-center pb-10'>How does Motueka Task work?</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-5 py-2 place-items-center">
                        <div className="flex flex-col items-center justify-center rounded-[8px] p-3 bg-card-color bg-card-border">
                            <h1 className='text-[1.2rem] text-center font-bold'>Post your task</h1>
                            <p className='py-2 text-center'>Share your task requirements on Motueka Task. It's always free to post tasks.</p>
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-[8px] p-3 bg-card-color bg-card-border">
                            <h1 className='text-[1.2rem] text-center font-bold'>Review your offers</h1>
                            <p className='py-2 text-center'>Compare offers, check tasker profiles and select the tasker who is the best fit.</p>
                        </div>
                        <div className="flex flex-col items-center justify-cente rounded-[8px] p-3 bg-card-color bg-card-border">
                            <h1 className='text-[1.2rem] text-center font-bold'>Get it done</h1>
                            <p className='py-2 text-center'>When your task completes, trigger the release of your securely held funds to the tasker.</p>
                        </div>
                    </div>
                    <div className='mt-20'>
                        <img src="/handyman.jpg" alt="" className='w-[500px] h-auto border border-blue-500 rounded shadow-lg shadow-blue-500/50' />
                    </div>
                </div>
            </div>
            <div className="container-fluid flex justify-center py-10">
                <div className="container max-w-3xl px-2 place-items-center">
                    <h1 className='text-2xl font-bold text-center pt-10 pb-5'>Why use Motueka Task?</h1>
                    <h1 className='text-[1.2rem] text-center pb-5'>Getting tasks done with Motueka Task is convenient, budget friendly, efficient and secure.</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-4 gap-x-0 sm:gap-x-4 mb-5 py-2 place-items-center">
                        <div className="flex flex-col rounded-full p-5 bg-card-color-2 bg-card-border">
                            <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width=" 80px" fill="#0066A2"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h168q13-36 43.5-58t68.5-22q38 0 68.5 22t43.5 58h168q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm80-80h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm200-190q13 0 21.5-8.5T510-820q0-13-8.5-21.5T480-850q-13 0-21.5 8.5T450-820q0 13 8.5 21.5T480-790ZM200-200v-560 560Z"/></svg>
                        </div>
                        <div className="col-span-3 flex flex-col rounded-[8px] p-3 bg-card-color-2 bg-card-border bg-[#f5f5f5] justify-center items-center sm:items-start text-center sm:text-start">
                            <h1 className='text-[1.2rem] font-bold pb-2'>Everything is on your terms</h1>
                            <p>Review no-obligation offers and pick the one that best fits your requirements and budget.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5 py-2 place-items-center">
                        <div className="flex flex-col rounded-full p-5 bg-card-color-2 bg-card-border">
                            <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width="80px" fill="#0066A2"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z"/></svg>
                        </div>
                        <div className="col-span-3 flex flex-col rounded-[8px] p-3 bg-card-color-2 bg-card-border justify-center items-center sm:items-start text-center sm:text-start">
                            <h1 className='text-[1.2rem] font-bold pb-2'>Stay on your timeline</h1>
                            <p>Our taskers will meet your quality expectations while respecting your deadlines.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5 py-2 place-items-center">
                        <div className="flex flex-col rounded-full p-5 bg-card-color-2 bg-card-border">
                            <svg xmlns="http://www.w3.org/2000/svg" height="80px" viewBox="0 -960 960 960" width="80px" fill="#0066A2"><path d="m590-160 80 80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h360l200 240v480q0 20-8.5 36.5T768-96L560-302q-17 11-37 16.5t-43 5.5q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 43T618-360l102 104v-356L562-800H240v640h350ZM480-360q33 0 56.5-23.5T560-440q0-33-23.5-56.5T480-520q-33 0-56.5 23.5T400-440q0 33 23.5 56.5T480-360Zm0-80Zm0 0Z"/></svg>
                        </div>
                        <div className="col-span-3 flex flex-col rounded-[8px] p-3 bg-card-color-2 bg-card-border justify-center items-center sm:items-start text-center sm:text-start">
                            <h1 className='text-[1.2rem] font-bold pb-2'>You get to choose</h1>
                            <p>Motueka Task gives you the freedom to select the tasker who is the best fit for your task.</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </>
    )
}

export default Home