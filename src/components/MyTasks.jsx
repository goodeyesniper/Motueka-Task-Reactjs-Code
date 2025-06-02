import Hero from './Hero';
import { useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import useLoggedInUser from '../hooks/useLoggedInUser';
import { API_BASE, authHeader1 } from "../api/config";


const MyTasks = () => {
    const navigate = useNavigate();
    const loggedInUser = useLoggedInUser();

    const [tasks, setTasks] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const fetchUserTasks = async () => {
            if (!loggedInUser) return; // Ensure we have user data before fetching

            try {
            const response = await fetch(`${API_BASE}/posts/`, {
                method: "GET",
                headers: {
                ...authHeader1(),
                "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data = await response.json();

            // Filter tasks to show only those created by the logged-in user
            const userTasks = data.filter(
                (task) => task.author_username === loggedInUser.username
            );
            setTasks(userTasks);
            } catch (error) {
            console.error("Error fetching tasks:", error);
            }
        };

        fetchUserTasks();
    }, [loggedInUser]);



    // Function to handle selecting/unselecting tasks
    const toggleTaskSelection = (taskId) => {
        setSelectedTasks(prev =>
            prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
        );
    };

    // Function to select/unselect all tasks
    const handleSelectAll = (event) => {
        setSelectedTasks(event.target.checked ? tasks.map(task => task.id) : []);
    };

    // Function to delete selected tasks
    const handleDeleteSelected = async () => {
        if (selectedTasks.length === 0) return;

        try {
            await Promise.all(
            selectedTasks.map(async (taskId) => {
                await fetch(`${API_BASE}/posts/${taskId}/`, {
                method: "DELETE",
                headers: authHeader1(),
                });
            })
            );

            // Filter out deleted tasks from UI
            setTasks((prevTasks) =>
            prevTasks.filter((task) => !selectedTasks.includes(task.id))
            );
            setSelectedTasks([]); // Clear selection after delete
        } catch (error) {
            console.error("Error deleting tasks:", error);
        }
    };

    const handleTaskAdded = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
      };

      const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    return (
        <>
            <Hero onTaskAdded={handleTaskAdded} />

            <div className="container-fluid flex justify-center">
                <div className="container max-w-6xl px-2 pt-3 pb-5 bg-card-border-2 mt-6">
                    {/* <h1 className="pt-2 pb-5 px-2">Task list here</h1> */}
                    {tasks.length > 0 && (
                        <div className='flex items-center mb-5 px-2 border-bottom py-2'>
                            <input
                                type="checkbox"
                                name="select-all"
                                className="w-4 h-4 mr-4 self-center"
                                onChange={handleSelectAll}
                                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                            />

                            {selectedTasks.length === 0 ? (
                                <span className="">Select All</span>
                            ) : (
                                <div className=''>
                                    <button
                                        className="custom-btn-container custom-btn m-2 whitespace-nowrap"
                                        onClick={handleOpenDialog}
                                    >
                                        {selectedTasks.length === tasks.length ? "Delete All" : "Delete Task"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {tasks.length === 0 ? (
                        <p className="text-center py-2">No tasks found</p>
                    ) : (
                        <>
                            {/* Table header goes here */}
                            <div className='flex items-center overflow-hidden task-header pb-1'>
                                <div className="px-4 flex justify-center w-[20px] hideOnMobile"></div>
                                <div className="px-2 flex justify-center sm:w-[120px]">
                                    <p className='font-bold'>Posted on</p>
                                </div>
                                <div className="px-2 flex-grow flex justify-center">
                                    <p className='font-bold'>Task Title</p>
                                </div>
                                <div className="px-2 flex justify-center sm:w-[100px]">
                                    <p className='font-bold'>Status</p>
                                </div>
                            </div>

                            {/* Task rows */}
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className={`flex items-center overflow-hidden border-bottom border-top text-center mb-2 ${selectedTasks.includes(task.id) ? 'bg-blue-400 text-white' : ''}`}
                                >
                                    <div className="px-4 flex justify-center w-[20px]">
                                        <input type="checkbox"
                                            className="w-4 h-4"
                                            checked={selectedTasks.includes(task.id)}
                                            onChange={() => toggleTaskSelection(task.id)} />
                                    </div>
                                    <div 
                                        className="flex-grow flex items-center cursor-pointer py-2"
                                        onClick={() => navigate(`/mytasks/${task.id}`)}
                                    >
                                        <div className="px-2 flex justify-center sm:w-[120px] text-start">
                                            <p>{new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                        <div className="px-2 flex-grow flex justify-center">
                                            <p>{task.task_title}</p>
                                        </div>
                                        <div className="px-2 flex justify-center sm:w-[100px]">
                                            <p>{task.status.charAt(0).toUpperCase() + task.status.slice(1)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>
                        {selectedTasks.length === tasks.length 
                            ? "Are you sure you want to delete all tasks?" 
                            : selectedTasks.length === 1 
                            ? "Are you sure you want to delete this task?" 
                            : `Are you sure you want to delete these ${selectedTasks.length} tasks?`}
                    </DialogTitle>
                        <DialogContent>
                            <p>This action cannot be undone.</p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">No</Button>
                            <Button onClick={() => { handleDeleteSelected(); handleCloseDialog(); }} color="error">
                                Yes
                            </Button>
                            {/* <Button onClick={handleDeleteSelected} color="error">Yes</Button> */}
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </>
    );
}

export default MyTasks