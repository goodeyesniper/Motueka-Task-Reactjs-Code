import Hero from './Hero'
import Profile from './Profile';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { getLastSeenStatus } from "../utils/lastSeen";
import LoginRequiredDialog from './LoginRequiredDialog';
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { fetchTaskDetail, fetchOfferDetail, submitOffer, fetchOfferAuthors, assignTask } from '../api/taskViewApi';
import AssignmentModal from './AssignmentModal';
import ChatBox from './Chatbox';

const TaskView = ({ setNotificationBell }) => {
    const { taskId } = useParams();
    const [taskDetail, setTaskDetail] = useState(null);
    const [offers, setOffers] = useState([]);
    const [offerMessage, setOfferMessage] = useState("");
    const [notification, setNotification] = useState("");
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const currentUser = useLoggedInUser();
    const [offerAuthors, setOfferAuthors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAuthenticated = localStorage.getItem('token') !== null;

    useEffect(() => {
        if (taskId) {
            fetchAuthors();
        }
    }, [taskId]);

    useEffect(() => {
        console.log("THE AUTHORS ARE:", offerAuthors);
    }, [offerAuthors]);

    const handleShowWarning = () => {
        document.activeElement?.blur(); // Remove focus from the triggering element. This removes Blocked aria-hidden on an element error in the console
        setLoginDialogOpen(true);
    };
    const handleCloseWarning = () => setLoginDialogOpen(false);


    useEffect(() => {
        const fetchTask = async () => {
            if (!taskId) return;

            try {
                console.log("Fetching task with ID:", taskId);
                const data = await fetchTaskDetail(taskId);
                setTaskDetail(data);

            } catch (err) {
              console.error("Error fetching task:", err);
            }
        };

        fetchTask();
    }, [taskId]);


    useEffect(() => {
        const fetchOffers = async () => {
            // if (!taskId) return;

            try {
                const data = await fetchOfferDetail(taskId);
                setOffers(data);

            } catch (err) {
              console.error("Error fetching offers:", err);
            }
        };

        fetchOffers();
    }, [taskId]);


    const handleSubmitOffer = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            setLoginDialogOpen(true);
            return;
        }

        if (!offerMessage.trim()) return;
    
        try {
            const newOffer = await submitOffer(taskId, offerMessage);  // Call external function
    
            setOffers((prevOffers) => [...prevOffers, newOffer]);
            setOfferMessage("");
            setNotification("Offer sent!");
        } catch (error) {
            console.error("Error submitting offer:", error);
            setNotification("Failed to send offer.");
        }
    };

    const fetchAuthors = useCallback(async () => {
        try {
            const fetchedOfferAuthors = await fetchOfferAuthors(taskId);
            const uniqueOfferAuthors = [
                ...new Map(fetchedOfferAuthors.map(author => [author.user_id, author])).values()
            ];
            setOfferAuthors(uniqueOfferAuthors);
        } catch (error) {
            console.error("Error fetching offer authors:", error);
        }
    }, [taskId]); // Dependencies ensure re-execution when `taskId` changes

    const handleAssignTask = async (username) => {
        try {
            if (!username) {
                console.error("Error: Username is undefined!");
                return;
            }
            const updatedTask = await assignTask(taskId, username);
            console.log("Updated Task:", updatedTask);

            const refreshedTask = await fetchTaskDetail(taskId);
            
            setTaskDetail(refreshedTask);

        } catch (error) {
            console.error("Error assigning task:", error);
        }
    };

    if (!taskDetail) return <p className="text-center mt-10">Loading task...</p>;


    const handleTaskAdded = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };

    return (
        <>
            <Hero onTaskAdded={handleTaskAdded} />

            <div className="container-fluid flex justify-center">
                <div className="container max-w-6xl pt-3 px-2">
                    {/* <h1>test!</h1> */}
                    <div className="max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-0 sm:gap-4 gap-y-2 mb-3 bg-card-border-2 rounded py-4 px-2">
                        <div className="flex flex-row sm:flex-col justify-center sm:justify-start items-center pt-2 gap-2">
                            {/* Info Container */}
                            <div className="flex flex-col items-center text-center overflow-hidden">
                                {/* Image Container */}
                                <Link to={`/profile/${taskDetail.author_username}`}>
                                    <div className="flex-shrink-0">
                                        {taskDetail.author_profile?.image_url && (
                                            <Profile img={taskDetail.author_profile?.image_url || null} />
                                        )}
                                    </div>
                                </Link>

                                <p className="py-2 font-semibold text-sm px-2">
                                {taskDetail.author_profile?.full_name ||
                                    taskDetail.author_username ||
                                    'No Name'}
                                </p>

                                {taskDetail.author_profile?.last_seen && (
                                <div className="text-sm place-items-center px-2">
                                    <div className="flex items-center gap-2">
                                    <span
                                        className={`w-2 h-2 rounded-full ${
                                        getLastSeenStatus(taskDetail.author_profile.last_seen).online
                                            ? 'bg-green-500'
                                            : 'bg-gray-400'
                                        }`}
                                    ></span>
                                    <span className='text-xs'>{getLastSeenStatus(taskDetail.author_profile.last_seen).status}</span>
                                    </div>
                                    <div className="py-2 text-xs">
                                    {getLastSeenStatus(taskDetail.author_profile.last_seen).lastSeenText}
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-3 pt-5 sm:pt-1">
                            <p className="text-sm border-bottom">Posted on: {formatDate(taskDetail.created_at)}</p>
                            <div className='py-5 flex items-center overflow-hidden'>
                                <p className='pr-5'>Status:</p>
                                <div className='flex items-center'>
                                    <h1 className='font-bold text-red-500'>{taskDetail.status.charAt(0).toUpperCase() + taskDetail.status.slice(1)}</h1>
                                </div>
                            </div>

                            <h4 className="pb-1">Title: &nbsp;
                                <span className='font-bold'>
                                    {taskDetail.task_title}
                                </span>
                            </h4>
                            <p className="pb-1 border-bottom">Details: &nbsp;
                                <span className='font-bold'>
                                    {taskDetail.task_details}
                                </span>
                            </p>

                            <div className="grid grid-cols-2 text-sm sm:text-md py-2">
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="pb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg> 
                                        <span className='font-bold p-2'>{formatDate(taskDetail.date)}</span>
                                    </div>
                                    <div className="flex items-center pb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                                        </svg>
                                        <span className='font-bold p-2'>
                                            {new Date(`1970-01-01T${taskDetail.time_from}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} 
                                            &nbsp; to &nbsp;
                                            {new Date(`1970-01-01T${taskDetail.time_to}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <div className="flex items-center pb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
                                        </svg>
                                        <span className='font-bold p-2'>{taskDetail.address}</span>
                                    </div>
                                    <div className="flex items-center pb-1 overflow-hidden">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z"/></svg>
                                        <span className='font-bold p-2'>
                                            {/* <button className="whitespace-nowrap">{taskDetail.budget_option} {taskDetail.budget_option === 'Approx' ? `$${taskDetail.budget_value}` : ''}</button> */}
                                            {taskDetail.budget_option === 'Approx' ? (
                                                <button>{`$${taskDetail.budget_value}`}</button>
                                            ) : (
                                                <p>Not sure</p>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className='border-top pt-2'>Attached Photo:</p>
                                {taskDetail.image ? (
                                    <img src={taskDetail.image} alt="Task" className="w-[400px] sm:max-w-full h-auto my-2" />
                                ) : (
                                <p className='text-sm px-2 py-5'>No photo(s) attached</p>
                                
                                )}
                            
                            <div className='border-top py-5 mt-5'>
                                {/* Start of offers area */}
                                <div className='bg-input-container rounded px-2 pb-5 w-full mt-5 mb-10'>
                                    <div className='flex justify-between pt-2'>
                                        <h1 className='font-bold'>Offers ({offerAuthors.length})</h1>
                                        <div className='flex overflow-hidden'>
                                            {taskDetail.assigned_to && 
                                            (currentUser && (taskDetail.author_username === currentUser.username || taskDetail.assigned_to === currentUser.username)) ? (
                                                <div>
                                                    <p className="text-red-600 font-semibold">Assigned to: {
                                                        offerAuthors.find(a => a.username === taskDetail.assigned_to)?.full_name || taskDetail.assigned_to
                                                        }
                                                    </p>
                                                    {taskDetail.author_username === currentUser.username && (
                                                        <button
                                                            onClick={() => handleAssignTask("reset")}
                                                            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                                                        >
                                                            Re-assign
                                                        </button>
                                                    )}
                                                </div>

                                            ) : taskDetail.status === "open" &&
                                            (currentUser && (taskDetail.author_username === currentUser.username &&
                                            offerAuthors.length > 0)) ? (
                                                <button
                                                    onClick={() => setIsModalOpen(true)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                                >
                                                    Assign Task
                                                </button>
                                            ) : null}

                                            {taskDetail.status === "assigned" &&
                                            (currentUser &&
                                                (taskDetail.author_username === currentUser.username ||
                                                taskDetail.assigned_to === currentUser.username)) && (
                                                <ChatBox
                                                taskId={taskId}
                                                currentUser={currentUser}
                                                taskStatus={taskDetail.status}
                                                chattingWith={
                                                    taskDetail.assigned_to === currentUser.username
                                                    ? taskDetail.author_full_name
                                                    : taskDetail.assigned_to_full_name
                                                }
                                                chattingWithImage={
                                                    taskDetail.assigned_to === currentUser.username
                                                    ? taskDetail.author_profile_image
                                                    : taskDetail.assigned_to_profile_image
                                                }
                                                />
                                            )}

                                        </div>
                                    </div>

                                    {/* Sample submitted comments */}
                                    {offers.map((offer, index) => (
                                        <div key={index} className='p-2 my-4 bg-input-card-border rounded w-full'>
                                            <div className='flex justify-between items-start'>
                                                <div className='flex items-center'>
                                                    <Link to={`/profile/${offer?.username}`}>
                                                        <div className="flex-shrink-0">
                                                            {offer?.profile_image && (
                                                                <Profile img={offer?.profile_image} size={60} />
                                                            )}
                                                        </div>
                                                    </Link>
                                                    <div className='px-2 sm:px-4'>
                                                    <p>{offer.full_name}</p>
                                                    <span className='text-xs'>{new Date(offer.created_at).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='px-2 py-4'>
                                            <p>{offer.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <AssignmentModal
                                        open={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        offerAuthors={offerAuthors}
                                        onAssign={handleAssignTask}
                                    />

                                    {/* Comment typing area */}
                                    <form onSubmit={handleSubmitOffer}>
                                        <div className='flex items-center bg-card-border-2 p-2 rounded text-sm w-full mt-5'>
                                            
                                            <textarea 
                                                className='w-full border-color-input rounded' 
                                                rows="3"
                                                placeholder="Type your offer..."
                                                value={offerMessage}
                                                onChange={(e) => setOfferMessage(e.target.value)}
                                            />
                                            <div className='px-4'>
                                                <div
                                                    onClick={isAuthenticated ? handleSubmitOffer : handleShowWarning}
                                                    role="button"
                                                    tabIndex="0"
                                                    className="cursor-pointer"
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleSubmitOffer(); }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentcolor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                                                    </svg>
                                                </div> 
                                            </div>
                                            
                                        </div>
                                    </form>
                                    <LoginRequiredDialog
                                        open={loginDialogOpen}
                                        onClose={() => handleCloseWarning(false)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TaskView