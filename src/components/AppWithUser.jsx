import App from '../App';
import useLoggedInUser from '../hooks/useLoggedInUser';
import { ChatProvider } from '../components/ChatContext';

const AppWithUser = () => {
  const currentUser = useLoggedInUser();
  // if (!currentUser) return <div>Loading...</div>;
  
  return (
    <ChatProvider currentUser={currentUser}>
      <App currentUser={currentUser} />
    </ChatProvider>
  );
};

export default AppWithUser;
