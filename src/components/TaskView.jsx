import Hero from './Hero'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Profile from './Profile';
import { getLastSeenStatus } from "../utils/lastSeen";

const TaskView = () => {
    const { taskId } = useParams();
    const [taskdetail, setTaskDetail] = useState(null);

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem("token");
            if (!token || !taskId) return;
        
            try {
                console.log("Fetching task with ID:", taskId);
        
                const response = await fetch(`http://127.0.0.1:8000/api/posts/${taskId}/`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });
        
                console.log("Response status:", response.status);
        
                // If response is not OK, get the response as text and log it
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Backend error:", errorText);
                    throw new Error("Failed to fetch task");
                }
        
                // Now that we know it's a valid response, parse it as JSON
                const data = await response.json();
                console.log("Task data:", data);
                setTaskDetail(data);
        
            } catch (error) {
                console.error("Error fetching task:", error);
            }
        };

        fetchTask();
    }, [taskId]);

    const handleTaskAdded = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
      };

    if (!taskdetail) return <p className="text-center mt-10">Loading task...</p>;

    return (
        <>
            <Hero onTaskAdded={handleTaskAdded} />

            <div className="container-fluid flex justify-center">
                <div className="container max-w-6xl pt-3 px-2">
                    <h1>test!</h1>
                    <div className="max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-0 sm:gap-4 gap-y-2 mb-3 bg-card-border-2 rounded py-4 px-2">
                        <div className="flex flex-row sm:flex-col justify-start items-center pt-2 gap-2">

                            <div className="flex-shrink-0">
                                {taskdetail.author_profile?.image_url && (
                                    <Profile img={taskdetail.author_profile?.image_url || null} />
                                )}
                            </div>
                            <div className="flex flex-col items-start sm:items-center text-start sm:text-center overflow-hidden">
                                <p className="py-2 font-semibold text-sm px-2">
                                    {taskdetail.author_profile?.full_name || taskdetail.author_username || 'No Name'}
                                </p>
                            </div>
                            {taskdetail.author_profile?.last_seen && (
                                <div className="text-sm place-items-start sm:place-items-center px-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                        className={`w-2 h-2 rounded-full ${
                                            getLastSeenStatus(taskdetail.author_profile.last_seen).online
                                            ? 'bg-green-500'
                                            : 'bg-gray-400'
                                        }`}
                                        ></span>
                                        <span className='text-xs'>{getLastSeenStatus(taskdetail.author_profile.last_seen).status}</span>
                                    </div>
                                    <div className="py-2 text-xs">
                                        {getLastSeenStatus(taskdetail.author_profile.last_seen).lastSeenText}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="col-span-3 pt-5 sm:pt-1">
                            <p className="text-sm border-bottom">Posted on: {formatDate(taskdetail.created_at)}</p>
                            <div className='py-5 flex items-center overflow-hidden'>
                                <p className='pr-5'>Status:</p>
                                <div className='flex items-center'>
                                    <button className='custom-btn-container custom-btn text-sm'>{taskdetail.status}</button>
                                </div>
                            </div>

                            <h4 className="pb-1">Title: {taskdetail.task_title}</h4>
                            <p className="pb-1 border-bottom">Details: {taskdetail.task_details}</p>

                            <div className="grid grid-cols-2 text-sm sm:text-md py-2">
                                <div className="col-span-2 sm:col-span-1">
                                    <div className="pb-1 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg> 
                                        <span className='font-bold p-2'>{taskdetail.date}</span>
                                    </div>
                                    <div className="flex items-center pb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                                        </svg>
                                        <span className='font-bold p-2'>
                                            {new Date(`1970-01-01T${taskdetail.time_from}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} 
                                            &nbsp; to &nbsp;
                                            {new Date(`1970-01-01T${taskdetail.time_to}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <div className="flex items-center pb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
                                        </svg>
                                        <span className='font-bold p-2'>{taskdetail.address}</span>
                                    </div>
                                    <div className="flex items-center pb-1 overflow-hidden">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z"/></svg>
                                        <span className='font-bold p-2'><button className="whitespace-nowrap">{taskdetail.budget_option} {taskdetail.budget_option === 'Approx' ? `$${taskdetail.budget_value}` : ''}</button></span>
                                    </div>
                                </div>
                            </div>

                            <p className='border-top pt-2'>Attached Photo:</p>
                            {/* <img src="https://placehold.co/400x200.png?text=No+Image" alt="Task" className="w-[400px] sm:max-w-full h-auto my-2" /> */}
                                {taskdetail.image ? (
                                    <img src={taskdetail.image} alt="Task" className="w-[400px] sm:max-w-full h-auto my-2" />
                                ) : (
                                <p className='text-sm px-2 py-5'>No photo(s) attached</p>
                                
                                )}
                            
                            <div className='border-top py-5 mt-5'>
                                {/* Start of offers area */}
                                <div className='bg-input-container rounded px-2 pb-5 w-full sm:w-5/6 mt-5 mb-10'>
                                    <h1 className='pt-2 font-bold'>Offers (x)</h1>

                                    {/* There will be 3 instances of this view:
                                    1. First view is for the task creator, "Assign Task" button will be visible to them along with the other contents of the page. All comments/offers will also be visible to the task creator.
                                    2. Second view is for logged-in users/tasker who wish to quote or posted a quote for the task. "Assign Task" button will not be visible to him since this feature is for the task creator who has the ability to choose whom he/she wants to assign the task. Other comments/offers will not be visible to him, only his posted comment(s) on the task and the reply of the task creator. 
                                    3. Third view is for unregistered users who browse the task. Comments/offers and "Assign Task" button will not be visible to them and the comments/offers of other users, only the number of comments/offers which is the "x" on this line: <h1 className='pt-2 font-bold'>Offers (x)</h1> */}

                                    {/* Sample submitted comments */}
                                    <div className='p-2 my-4 bg-card-border-2 rounded w-full'>
                                        <div className='flex justify-between items-start'>
                                            <div className='flex items-center'>
                                                <img src="https://placehold.co/60x60" alt="" className='rounded-full sm:block hidden' />
                                                <div className='px-2 sm:px-4'>
                                                    <p className=''>Tony Stark</p>
                                                    <span className='text-xs'>Online</span>
                                                </div>
                                            </div>

                                            <div className='flex overflow-hidden'>
                                                <button className='text-sm custom-btn-container custom-btn whitespace-nowrap'>Assign Task</button>
                                            </div>
                                        </div>
                                        <div className='px-2 py-4'>
                                            <p>Hi I can do this job for you.</p>
                                        </div>
                                    </div>

                                    {/* Comment typing area */}
                                    <div className='flex items-center bg-card-border-2 p-2 rounded text-sm w-full mt-5'>
                                        <textarea className='w-full border-color-input rounded' rows="3"></textarea>
                                        <div className='px-4'>
                                            <Link to="#">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> <path fill="currentcolor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
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