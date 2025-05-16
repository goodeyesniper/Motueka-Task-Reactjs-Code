import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from './ThemeContext'; // Adjust path if needed
import NotificationBell from './NotificationBell'


const Navbar = ({ notifications }) => {
    const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists
    const { theme, toggleTheme } = useTheme();
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const url = "http://127.0.0.1:8000/api/current-user/";
    
                const headers = token && token !== 'undefined'
                    ? {
                        Authorization: `Token ${token}`,
                    }
                    : {};
    
                const response = await fetch(url, { headers });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch user info");
                }
    
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };
    
        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);
    

    const handleLogout = async () => {
        const token = localStorage.getItem("token"); // Retrieve token from localStorage
        try {
          const response = await fetch("http://127.0.0.1:8000/api/logout/", {
            method: "POST",
            headers: {
              Authorization: `Token ${token}`, // Pass token in the header for authentication
            },
          });
      
          if (response.ok) {
            localStorage.removeItem("token"); // Remove token from localStorage
            window.location.href = "/"; // Redirect to home page or login page
          } else {
            console.error("Logout failed");
          }
        } catch (err) {
          console.error("An error occurred while logging out:", err);
        }
    };

    // State to toggle sidebar visibility
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    // Ref to track the sidebar element
    const sidebarRef = useRef(null);

    // Function to toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    // Function to hide the sidebar when clicking outside
    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsSidebarVisible(false); // Hide sidebar
        }
    };

    // Add/remove event listener for clicks
    useEffect(() => {
        if (isSidebarVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarVisible]);

    return (
        <>
            <div className="navbar-container container-fluid flex justify-center content-center bg-color-container sticky top-0 z-50">
                <div className="container max-w-6xl">
                    <nav className="navbar">
                        
                        {/* Navigation Sidebar */}
                        <ul ref={sidebarRef} className={`bg-card-border rounded navbar-ul ul-style nav-sidebar ${isSidebarVisible ? 'show-sidebar' : 'hide-sidebar'}`}>

                            {/* Show when logged in */}
                            {isAuthenticated && (
                                <>
                                    <li className='navbar-li nav-li-sidebar'><Link to='/mytasks' className='navbar-links nav-link-sidebar'>My Tasks</Link></li>
                                    <li className='navbar-li nav-li-sidebar'><Link to={`/profile/${profile?.username}`} className='navbar-links nav-link-sidebar'>My Profile</Link></li>
                                    <li className='navbar-li nav-li-sidebar'><Link to='/mysettings' className='navbar-links nav-link-sidebar'>Settings</Link></li>
                                    <li className='navbar-li nav-li-sidebar'><Link to="/mysettings?tab=Notifications" className='navbar-links nav-link-sidebar'>Notifications</Link></li>
                                    <li className='navbar-li nav-li-sidebar' 
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation
                                            handleLogout();
                                        }}
                                    >
                                        <Link to='#' className='navbar-links nav-link-sidebar'>Logout</Link>
                                    </li>
                                </>
                            )}

                            {/* Show when logged off */}
                            {!isAuthenticated && (
                                <>
                                    <li className='navbar-li nav-li-sidebar'><Link to='/register' className='navbar-links nav-link-sidebar'>Sign Up</Link></li>
                                    <li className='navbar-li nav-li-sidebar'><Link to='/login' className='navbar-links nav-link-sidebar'>Login</Link></li>
                                </>
                            )}
                        </ul>

                        {/* Navigation Big Screen */}
                        <ul className='navbar-ul ul-style flex'>
                            {/* Always show */}
                            <li className='navbar-li'><Link to='/' className='navbar-links whitespace-nowrap'>Motueka Task</Link></li>
                            
                            {/* Show when logged in */}
                            {isAuthenticated && (
                                <>
                                    <li className='navbar-li hideOnMobile flex items-center pr-5'><Link to="/mytasks" className='custom-btn-container custom-btn'>My Tasks</Link></li>
                                    {profile?.username && (
                                        <li className='navbar-li hideOnMobile'>
                                            <Link to={`/profile/${profile.username}`} className='navbar-links'>My Profile</Link>
                                        </li>
                                    )}
                                    <li className='navbar-li hideOnMobile'><Link to='/mysettings' className='navbar-links'>Settings</Link></li>
                                    <li className='navbar-li hideOnMobile' 
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation
                                            handleLogout();
                                        }}
                                    >
                                        <Link to='#' className='navbar-links'>Logout</Link>
                                    </li>

                                    <NotificationBell notifications={notifications} />
                                </>
                            )}

                            {/* Show when logged off */}
                            {!isAuthenticated && (
                                <>
                                    <li className='hideOnMobile px-2 flex items-center'><Link to="/register" className='custom-btn-container custom-btn m-2'>Sign Up</Link></li>
                                    <li className='navbar-li hideOnMobile'><Link to='/login' className='navbar-links'>Login</Link></li>
                                </>
                            )}
                            
                            {/* Always show */}

                            <li className="navbar-li px-3 flex items-center cursor-pointer" onClick={toggleTheme}>
                                {theme === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                        {/* Moon Icon for Light Mode */}
                                        <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                        {/* Sun Icon for Dark Mode */}
                                        <path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/>
                                    </svg>
                                )}
                            </li>
                            
                            {/* Show on small screen */}
                            <li className='navbar-li menu-button' onClick={toggleSidebar}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )
}

export default Navbar