import { useEffect, useState } from 'react';
import Hero from './Hero';
import Profile from './Profile';
import { Link, useNavigate } from 'react-router-dom'
import { getLastSeenStatus } from "../utils/lastSeen";

const BrowseTask = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [lastSeen, setLastSeen] = useState(null);
  // const loggedInUser = useLoggedInUser();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = "http://127.0.0.1:8000/api/posts/";  // New API endpoint for posts
  
        const headers = token && token !== 'undefined'
          ? {
              Authorization: `Token ${token}`,  // Pass token for authenticated users
            }
          : {};  // For unauthenticated users, no headers needed
  
        const response = await fetch(url, { headers });
  
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
  
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
  
    fetchTasks();
  }, []);
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined') return;
  
    const updateLastSeen = () => {
      fetch('http://127.0.0.1:8000/api/current-user/', {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch current user');
          }
          return res.json();
        })
        .then(data => {
          const username = data?.username;
          if (username) {
            // Once we have the username, fetch the profile and last seen data
            fetch(`http://127.0.0.1:8000/api/profile/${username}/`, {
              headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json'
              },
            })
              .then(res => {
                if (!res.ok) {
                  throw new Error('Failed to fetch last seen');
                }
                return res.json();
              })
              .then(seenData => {
                if (seenData?.last_seen) {
                  setLastSeen(seenData.last_seen);
                }
              })
              .catch(error => {
                console.error('Error fetching last seen:', error);
              });
          }
        })
        .catch(error => {
          console.error('Error fetching current user:', error);
        });
    };
  
    updateLastSeen();
    const interval = setInterval(updateLastSeen, 60000);
  
    return () => clearInterval(interval);
  }, []);
  

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
        <div className="container max-w-6xl px-2 py-3">
          {/* <div className="max-w-6xl mb-5">
            <h1><strong>This is where the tasks goes!</strong></h1>
          </div> */}

          {tasks?.map(task => (
            <div
              key={task.id}
              className="max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-0 sm:gap-4 gap-y-2 mb-3 bg-card-border-2 rounded py-4 px-2 mt-3"
            >
              <div className="flex flex-row sm:flex-col justify-center sm:justify-start items-center pt-2 gap-2">
                
                {/* Info Container */}
                <div className="flex flex-col items-center text-center overflow-hidden">
                  <Link to={`/profile/${task.author_profile?.username}`}>
              
                    {/* Image Container */}
                    <div className="flex-shrink-0">
                      {task.author_profile?.image_url && (
                        <Profile img={task.author_profile?.image_url || null} />
                      )}
                    </div>

                    <p className="py-2 font-semibold text-sm px-2">
                      {task.author_profile?.full_name ||
                        task.author_username ||
                        'No Name'}
                    </p>
                  </Link>

                    {task.author_profile?.last_seen && (
                      <div className="text-sm place-items-center px-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              getLastSeenStatus(task.author_profile.last_seen).online
                                ? 'bg-green-500'
                                : 'bg-gray-400'
                            }`}
                          ></span>
                          <span className='text-xs'>{getLastSeenStatus(task.author_profile.last_seen).status}</span>
                        </div>
                        <div className="py-2 text-xs">
                          {getLastSeenStatus(task.author_profile.last_seen).lastSeenText}
                        </div>
                      </div>
                    )}
                </div>
              </div>

              <div className="col-span-3 pt-5 sm:pt-1">
                <p className="text-sm border-bottom">Posted on: {formatDate(task.created_at)}</p>
                <div className='py-5 flex items-center overflow-hidden'>
                  <p className='pr-5'>Status:</p>
                  <div className='flex items-center'>
                    <button className='custom-btn-container custom-btn text-sm'>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</button>
                  </div>
                </div>
                <div>
                  <h4 className="pb-1">Title: &nbsp;
                    <span className='font-bold cursor-pointer' onClick={() => navigate(`/mytasks/${task.id}`)}>{task.task_title}</span>
                  </h4>
                  <p className="pb-1 border-bottom" >Details: &nbsp;
                    <span className='font-bold cursor-pointer' onClick={() => navigate(`/mytasks/${task.id}`)}>{task.task_details}</span>
                  </p>
                </div>
                  <div className="grid grid-cols-2 text-sm sm:text-md py-2">
                    <div className="col-span-2 sm:col-span-1">
                      <div className="pb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg> 
                        <span className='font-bold p-2'>{formatDate(task.date)}</span>
                      </div>
                      <div className="flex items-center pb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                        </svg>
                        <span className='font-bold p-2'>
                          {new Date(`1970-01-01T${task.time_from}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} 
                          &nbsp; to &nbsp;
                          {new Date(`1970-01-01T${task.time_to}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <div className="flex items-center pb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/>
                        </svg>
                        <span className='font-bold p-2'>{task.address}</span>
                      </div>
                      <div className="flex items-center pb-1 overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 flex-shrink-0" viewBox="0 -960 960 960" fill="#0066A2"><path d="M441-120v-86q-53-12-91.5-46T293-348l74-30q15 48 44.5 73t77.5 25q41 0 69.5-18.5T587-356q0-35-22-55.5T463-458q-86-27-118-64.5T313-614q0-65 42-101t86-41v-84h80v84q50 8 82.5 36.5T651-650l-74 32q-12-32-34-48t-60-16q-44 0-67 19.5T393-614q0 33 30 52t104 40q69 20 104.5 63.5T667-358q0 71-42 108t-104 46v84h-80Z"/></svg>
                        <span className='font-bold p-2'>
                          {/* <button className="whitespace-nowrap">{task.budget_option} {task.budget_option === 'Approx' ? `$${task.budget_value}` : ''}</button> */}
                          {task.budget_option === 'Approx' ? (
                              <button>{`$${task.budget_value}`}</button>
                          ) : (
                              <p>Not sure</p>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className='border-top pt-2'>Attached Photo:</p>
                  
                    {task.image ? (
                        <img src={task.image} alt="Task" className="w-[400px] sm:max-w-full h-auto my-2" />
                    ) : (
                      <p className='text-sm px-2 py-5'>No photo(s) attached</p>
                      
                    )}
                  

                  <div className="grid grid-cols-2 gap-4 border-top mt-5 pt-2 text-center">
                    <div
                      onClick={() => navigate(`/mytasks/${task.id}`)}
                      className='flex justify-center cursor-pointer' 
                    >
                      <Link to="#" className='navbar-links text-sm'>Comments</Link>
                    </div>
                    <div 
                      onClick={() => navigate(`/mytasks/${task.id}`)}
                      className='flex justify-center cursor-pointer'
                    >
                      <Link to="#" className='navbar-links text-sm'>Offers</Link>
                    </div>
                  </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BrowseTask;
