import { useEffect, useState } from 'react';
import Hero from './Hero';
import Profile from './Profile';

import { getTimeDifference, getLastSeenStatus } from "../utils/lastSeen";

const BrowseTask = () => {
  const [tasks, setTasks] = useState([]);
  const [lastSeen, setLastSeen] = useState(null);
  const MEDIA_ROOT = "http://127.0.0.1:8000";

  // 🔄 Fetch tasks from backend (decide if user is logged in or not)
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

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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


  return (
    <>
      <Hero onTaskAdded={handleTaskAdded} />

      <div className="container-fluid flex justify-center">
        <div className="container max-w-6xl pt-3 px-2">
          <div className="max-w-6xl border border-gray-200 mb-5">
            <h1><strong>This is where the tasks goes!</strong></h1>
          </div>

          {tasks?.map(task => (
            <div
              key={task.id}
              className="max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-0 sm:gap-4 gap-y-2 mb-5 bg-card-border-2 rounded py-4 px-4"
            >
              <div className="flex flex-col justify-start items-center pt-2">
              {task.author_profile?.image_url && (
                <Profile 
                  img={task.author_profile?.image_url || null} 
                />
              )}
                <p className="pt-2 pb-5 font-semibold text-center">
                    {task.author_profile?.full_name ||
                    task.author_username ||
                    'No Name'}
                </p>

                {task.author_profile?.last_seen && (
                  <div className="text-sm">
                    <div className="flex justify-center items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          getLastSeenStatus(task.author_profile.last_seen).online ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></span>
                      <span>{getLastSeenStatus(task.author_profile.last_seen).status}</span>
                    </div>
                    <div className="items-center py-2 text-center">
                      {getLastSeenStatus(task.author_profile.last_seen).lastSeenText}
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-3 pt-1">
                <p className="text-sm">Posted on: {formatDate(task.created_at)}</p>
                <h4 className="pb-2 text-xl font-bold">{task.task_title}</h4>
                <p className="pb-2">{task.task_details}</p>

                {task.image && (
                  <img
                    src={task.image}
                    alt="Task"
                    className="max-w-full h-auto my-2"
                  />
                )}

                <p className="pt-2">Address: {task.address}</p>
                <p className="py-2">When do I need it done: {formatDate(task.date)}</p>
                <p className="py-2">Between {task.time_from} to {task.time_to}</p>
                <p className="py-2 font-semibold">
                  Budget: {task.budget_option} {task.budget_option === 'Approx' ? `$${task.budget_value}` : ''}
                </p>

                <div className="grid grid-cols-3 gap-4 border-t mt-5 pt-2 text-sm text-center text-blue-700 font-medium">
                  <div className="cursor-pointer hover:underline">Open/Close</div>
                  <div className="cursor-pointer hover:underline">Comments</div>
                  <div className="cursor-pointer hover:underline">Offers</div>
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
