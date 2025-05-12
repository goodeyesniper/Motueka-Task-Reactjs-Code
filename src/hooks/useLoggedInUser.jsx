import { useEffect, useState } from 'react';

export const useLoggedInUser = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);
    const API_BASE = "http://127.0.0.1:8000/api";
  
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
          console.log('Logged-in user:', data);
        } catch (error) {
          console.error('Error fetching logged-in user:', error);
        }
      };
  
      fetchLoggedInUser();
    }, []);
  
    return loggedInUser;
  };
  