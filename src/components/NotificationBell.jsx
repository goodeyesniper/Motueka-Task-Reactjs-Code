import { Link } from 'react-router-dom'
import React, { useState, useEffect, useRef } from "react";
import { fetchUserNotifications } from "../api/notifications";

const NotificationBell = ({ notifications = [] }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown

  // Toggle Dropdown Visibility
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false); // Close dropdown if click is outside
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      // Cleanup event listener
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <li className="navbar-li hideOnMobile">
        <Link to="#" onClick={toggleDropdown} className="navbar-links relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#0066A2"
          >
            <path d="M160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" />
          </svg>
        </Link>
      </li>

      {/* Dropdown Notifications */}
      {isDropdownVisible && (
        <div ref={dropdownRef} className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded w-80 max-h-96 overflow-y-auto z-50">
          <Link to="/mysettings?tab=Notifications">
            <div className="p-4">
              <h2 className="font-bold text-gray-700">Notifications</h2>
            </div>
          </Link>
          
          <div className="">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="px-4 py-2 border-t border-[#e5e7eb] hover:bg-gray-100 cursor-pointer">
                  {notification.task_id ? (
                    <Link to={`/mytasks/${notification.task_id}`} className="text-[#101828] text-sm font-bold">
                      {notification.message}
                    </Link>
                  ) : (
                    <p className="text-black font-bold">{notification.message}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No notifications to show</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;