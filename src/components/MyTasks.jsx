import Hero from './Hero';

const MyTasks = () => {
    const handleTaskAdded = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
      };
      
    return (
        <>
            <Hero onTaskAdded={handleTaskAdded} />
            
        </>
    )
}

export default MyTasks