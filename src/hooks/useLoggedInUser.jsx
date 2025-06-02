import { useEffect, useState } from 'react';
import { API_BASE, authHeader1 } from "../api/config";

const useLoggedInUser = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch(`${API_BASE}/current-user/`, {
          headers: authHeader1(),
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setLoggedInUser(data);
        // console.log("Logged-in user:", data);
      } catch (error) {
        console.error("Error fetching logged-in user:", error);
      }
    };

    fetchLoggedInUser();
  }, []);

  return loggedInUser;
};

export default useLoggedInUser;
