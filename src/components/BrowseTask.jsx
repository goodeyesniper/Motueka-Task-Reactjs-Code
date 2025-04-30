import { useEffect, useState } from 'react';
import Hero from './Hero';
import Profile from './Profile';
import { Link } from 'react-router-dom'
import { getLastSeenStatus } from "../utils/lastSeen";

const BrowseTask = () => {
  const [tasks, setTasks] = useState([]);
  const [lastSeen, setLastSeen] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/current-user/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setLoggedInUser(data);
        console.log('Logged-in user:', data);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = token && token !== 'undefined'
          ? "http://127.0.0.1:8000/api/posts/"
          : "http://127.0.0.1:8000/api/public-posts/";

        const headers = token && token !== 'undefined'
          ? {
              Authorization: `Token ${token}`,
            }
          : {};

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
      fetch("http://127.0.0.1:8000/api/profile/", {
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
        .then(data => {
          if (data?.last_seen) {
            setLastSeen(data.last_seen);
          }
        })
        .catch(error => {
          console.error('Error updating last seen:', error);
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

  if (!loggedInUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Hero onTaskAdded={handleTaskAdded} />

      <div className="container-fluid flex justify-center">
        <div className="container max-w-6xl pt-3 px-2">
          <div className="max-w-6xl mb-5">
            <h1><strong>This is where the tasks goes!</strong></h1>
          </div>

          {tasks?.map(task => (
            <div
              key={task.id}
              className="max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-0 sm:gap-4 gap-y-2 mb-3 bg-card-border-2 rounded py-4 px-4"
            >
              <div className="flex flex-row sm:flex-col justify-start items-center pt-2 gap-2">
                {/* Image Container */}
                <div className="flex-shrink-0">
                  {task.author_profile?.image_url && (
                    <Profile img={task.author_profile?.image_url || null} />
                  )}
                </div>

                {/* Info Container */}
                <div className="flex flex-col items-center sm:items-start text-start sm:text-center overflow-hidden">
                  <Link
                    to={
                      loggedInUser?.username === (task.author_profile?.username || task.author_username)
                        ? `/profile`
                        : `/profileuser/${task.author_profile?.username || task.author_username}`
                    }
                  >
                    <p className="py-2 font-semibold text-sm px-2">
                      {task.author_profile?.full_name ||
                        task.author_username ||
                        'No Name'}
                    </p>

                    {task.author_profile?.last_seen && (
                      <div className="text-sm place-items-start sm:place-items-center px-2">
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
                  </Link>
                </div>
              </div>

              <div className="col-span-3 pt-5 sm:pt-1">
                <p className="text-sm border-bottom">Posted on: {formatDate(task.created_at)}</p>
                <div className='py-5 flex items-center overflow-hidden'>
                  <p className='pr-5'>Status:</p>
                  <div className='flex items-center'>
                    <button className='custom-btn-container custom-btn'>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</button>
                  </div>
                </div>
                <h4 className="pb-1">Title: &nbsp;<span className='font-bold'>{task.task_title}</span></h4>
                <p className="pb-1 border-bottom">Details: &nbsp;<span className='font-bold'>{task.task_details}</span></p>
                <p className="pt-5 pb-1 text-xs">Date: &nbsp;<span className='font-bold'>{formatDate(task.date)}</span></p>

                <p className="pb-1 text-xs">
                  Time: &nbsp;<span className='font-bold'>
                    {new Date(`1970-01-01T${task.time_from}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} 
                    &nbsp; to &nbsp;
                    {new Date(`1970-01-01T${task.time_to}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </span>
                </p>

                <p className="pb-1 text-xs">Address: &nbsp;<span className='font-bold'>{task.address}</span></p>
                <p className="pt-5 text-xs">
                  Task Budget: &nbsp;<span className='font-bold text-md'><button>{task.budget_option} {task.budget_option === 'Approx' ? `$${task.budget_value}` : ''}</button></span>
                </p>
                {/* <p className="pt-5 text-xs">
                  Task Budget: &nbsp;
                  <span className='font-bold text-md'>
                    <button>
                      {task.budget_value ? `$${task.budget_value}` : 'No budget set'}
                    </button>
                  </span>
                </p> */}

                <p className='pt-5 text-xs'>Attached Photo:</p>
                {task.image ? (
                  <img src={task.image} alt="Task" className="w-[500px] sm:max-w-full h-auto my-2" />
                ) : (
                  <p className='text-sm px-2 py-5'>No photo(s) attached</p>
                )}

                <div className="grid grid-cols-2 gap-4 border-top mt-5 pt-2 text-center">
                  <div className="flex justify-center"><Link to="#" className='navbar-links text-sm'>Comments</Link></div>
                  <div className="flex justify-center"><Link to="#" className='navbar-links text-sm'>Offers</Link></div>
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
