import React, { useState } from "react";
import { Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Sidebar = ({ selectedItem, handleSelection }) => {
  const [open, setOpen] = useState(false);

  // Correct function definitions
  const handleShowSidebar = () => {
    document.activeElement?.blur();
    setOpen(true);
  };

  const handleCloseSidebar = () => setOpen(false);

  return (
    <>
      {/* Static Sidebar (Visible on ALL screens, hidden in small screens with sm:hidden) */}
      <div className="menu-button-mysettings">
        <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="currentColor" onClick={handleShowSidebar}>
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
      </div>

      <div className="hideOnMobile1 col-span-4 sm:col-span-1">
        <ul className="bg-card-border rounded">
          {[
            "Account Settings",
            "Personal Profile",
            "My Portfolio",
            "Notifications",
            "Verification",
            "Deactivate Account",
          ].map((item) => (
            <li
              key={item}
              className={`px-5 py-2 sm:py-3 cursor-pointer ${
                selectedItem === item ? "font-bold highlight-selector" : ""
              }`}
              onClick={() => handleSelection(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Sliding Sidebar (Drawer for small screens) */}
      <Drawer 
        anchor="left" 
        open={open} 
        onClose={handleCloseSidebar} 
        className="custom-drawer"
      >
        <div>
          <p className="text-xs font-bold px-2 pt-2">My Settings</p>
        </div>
        <List className="w-full">
          {[
            "Account Settings",
            "Personal Profile",
            "My Portfolio",
            "Notifications",
            "Verification",
            "Deactivate Account",
          ].map((item) => (
            <ListItem
              key={item}
              onClick={() => {
                handleSelection(item);
                handleCloseSidebar; // Close drawer on selection
              }}
            >
              <ListItemText primary={item} className={selectedItem === item ? "highlight-selector" : ""} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;