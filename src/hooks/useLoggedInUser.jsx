import { useEffect, useState } from 'react';
import { API_BASE } from "../api/config";


const useLoggedInUser = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
  
    useEffect(() => {
      const fetchLoggedInUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
  
        try {
          const response = await fetch(`${API_BASE}/current-user/`, {
            headers: { Authorization: `Token ${token}` },
          });
  
          if (!response.ok) throw new Error('Failed to fetch user data');
  
          const data = await response.json();
          setLoggedInUser(data);
          // console.log('Logged-in user:', data);
        } catch (error) {
          console.error('Error fetching logged-in user:', error);
        }
      };
  
      fetchLoggedInUser();
    }, []);
  
    return loggedInUser;
  };

export default useLoggedInUser;
