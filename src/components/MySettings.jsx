import React, { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom";
import { updateProfile, changePassword, fetchUserProfile, uploadProfileImage, fetchUserProfileData, saveUserProfile, fetchAlbumsWithImages, createAlbum, addImageToAlbum, deleteAlbum, } from './MySettingsUpdater'
import ImageUploadDialog from "./ImageUploadDialog";
import AlbumGrid from './AlbumGrid'
import Hero from './Hero';

const MySettings = () => {
  // Step 1: State to keep track of the selected item
  // const [selectedItem, setSelectedItem] = useState("Account Settings");
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "Account Settings";
  const [selectedItem, setSelectedItem] = useState(initialTab);

  // Step 2: Function to handle item selection
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && tab !== selectedItem) {
      setSelectedItem(tab);
    }
  }, [searchParams]);
  
  const handleSelection = (item) => {
    setSelectedItem(item);
    setSearchParams({ tab: item }); // updates the URL
  };
  
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [notification, setNotification] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageDescription, setImageDescription] = useState("");

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const data = await fetchAlbumsWithImages();
        setAlbums(data);
      } catch (err) {
        // handle error
      }
    };
  
    loadAlbums();
  }, []);
  
  const handleCreateAlbum = async () => {
    if (!albumTitle.trim()) {
      setNotification("Album title cannot be empty.");
      return;
    }
  
    try {
      const newAlbum = await createAlbum(albumTitle);
      setAlbums([...albums, newAlbum]);
      setAlbumTitle("");
      setIsCreatingAlbum(false);
      setNotification("");
    } catch {
      setNotification("Failed to create album.");
    }
  };

  const handleAddImage = async () => {
    if (!imageFile || selectedAlbum === null) return;
  
    try {
      const albumId = albums[selectedAlbum].id;
      const newImage = await addImageToAlbum(albumId, imageFile, imageDescription);
  
      const updatedAlbums = albums.map((album, index) => {
        if (index === selectedAlbum) {
          return {
            ...album,
            images: [...album.images, newImage], // create new array, not push
          };
        }
        return album;
      });
  
      setAlbums(updatedAlbums);
      setImageFile(null);
      setImageDescription("");
      setSelectedAlbum(null);
    } catch {
      setNotification("Failed to upload image.");
    }
  };

  const handleDeleteAlbum = async (albumIndex) => {
    const album = albums[albumIndex];
    const confirmed = window.confirm("Are you sure you want to delete this album?");
    if (!confirmed) return;
  
    try {
      await deleteAlbum(album.id);
      setAlbums(albums.filter((_, index) => index !== albumIndex));
    } catch {
      setNotification("Failed to delete album.");
    }
  };

  const [selectedFilter, setSelectedFilter] = useState("None");
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Notification 1", read: false, fullDetails: "Details of Notification 1" },
    { id: 2, text: "Notification 2", read: true, fullDetails: "Details of Notification 2" },
    { id: 3, text: "Notification 3", read: false, fullDetails: "Details of Notification 3" },
  ]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    const updatedSelection = notifications.filter((notif) => {
      if (filter === "Read") return notif.read;
      if (filter === "Unread") return !notif.read;
      if (filter === "All") return true;
      return false; // "None"
    }).map((notif) => notif.id);
    setSelectedNotifications(updatedSelection);
  };

  const handleCheckboxChange = (id) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((notifId) => notifId !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    setNotifications((prev) => prev.filter((notif) => !selectedNotifications.includes(notif.id)));
    setSelectedNotifications([]);
  };

  const handleMarkAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) =>
        selectedNotifications.includes(notif.id) ? { ...notif, read: true } : notif
      )
    );
  };

  const [deactivateConfirmation, setDeactivateConfirmation] = useState(false); // Checkbox state
  const [selectedReason, setSelectedReason] = useState(""); // Track selected radio button
  const [otherDetails, setOtherDetails] = useState(""); // Track textarea input

  const handleDeactivateAccount = () => {
    if (selectedReason === "Others - please tell us a bit more") {
      // Include textarea input in alert if "Others" is selected
      alert(`Reason for deactivation: ${selectedReason}\nDetails: ${otherDetails}`);
    } else {
      // Show alert with only the selected reason
      alert(`Reason for deactivation: ${selectedReason}`);
    }
    alert("Your account has been deactivated.");
    // Add further actions, like an API call or navigation
  
  };

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileSuccessMessage, setProfileSuccessMessage] = useState(""); // For profile updates
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(""); // For password changes

  const [userData, setUserData] = useState({
    first_name: "",
    email: "",
    date_of_birth: "",
    address: "",
    contact_number: "",
    image_url: "https://placehold.co/120x120.png", // Stores user's profile picture URL
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Load profile details when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUserData({
          full_name: userProfile.full_name || "",
          email: userProfile.email || "",
          date_of_birth: userProfile.date_of_birth || "",
          address: userProfile.address || "",
          contact_number: userProfile.contact_number || "",
          image_url: userProfile.image_url || "https://placehold.co/120x120.png", // Placeholder if no image
        });
      } catch (error) {
        console.error("Error loading user profile:", error);
      }
    };

    loadUserProfile();
  }, []);


  // Handle input changes for profile
  const handleInputChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleProfileSave = async () => {
    try {
      await updateProfile(userData);
      setProfileSuccessMessage("Profile updated successfully!");
      setProfileError("");

      // Refresh data after update
      const updatedProfile = await fetchUserProfile();
      setUserData({
        full_name: updatedProfile.full_name || "",
        email: updatedProfile.email || "",
        date_of_birth: updatedProfile.date_of_birth || "",
        address: updatedProfile.address || "",
        contact_number: updatedProfile.contact_number || "",
        image_url: updatedProfile.image_url || "https://placehold.co/120x120.png",
      });
    } catch (error) {
      setProfileError("Error updating profile.");
      setProfileSuccessMessage("");
    }
  };

  // Handle input changes for password
  const handleInputChangePassword = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("Passwords do not match.");
      setPasswordSuccessMessage("");
      return;
    }

    try {
      await changePassword(passwordData);
      setPasswordSuccessMessage("Password updated successfully!");
      setPasswordError("");
      setPasswordData({ current_password: "", new_password: "", confirm_password: "" }); // Reset fields
    } catch (error) {
      setPasswordError("Error changing password.");
      setPasswordSuccessMessage("");
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  // Handle opening/closing the popup
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setTimeout(() => {
      document.querySelector("#imageUploadInput")?.focus(); // ✅ Force focus shift inside the dialog
    }, 100);
  };  
  const handleCloseDialog = () => setOpenDialog(false);

  // Handle image upload (send to backend)
  const handleImageUpload = async (selectedImage) => {
    try {
      await uploadProfileImage(selectedImage);
      setUserData((prev) => ({ ...prev, image_url: URL.createObjectURL(selectedImage) })); // ✅ Show new image preview
      handleCloseDialog();
    } catch (error) {
      console.error("Image upload error:", error);
    }
  };

  const [aboutMe, setAboutMe] = useState("");
  const charCount2 = aboutMe.length;
  const [taskPreferences, setTaskPreferences] = useState([]);
  const [expertise, setExpertise] = useState([]);
  const [profileId, setProfileId] = useState(null); // Needed for PUT

  const toggleCheckbox = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await fetchUserProfileData();
        if (profile) {
          setProfileId(profile.id);
          setAboutMe(profile.about_me);
          setExpertise(profile.expertise || []);
          setTaskPreferences(profile.task_preferences || []);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const payload = {
      about_me: aboutMe,
      expertise: expertise,
      task_preferences: taskPreferences
    };
  
    try {
      const newProfile = await saveUserProfile(payload, profileId);
      if (newProfile?.id) {
        setProfileId(newProfile.id);
      }
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };
  
  
  // Step 3: Content based on the selected item
  const renderContent = () => {
    switch (selectedItem) {
      case "Account Settings":
        return (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <div className="col-span-3">
                        <h1 className="font-bold border-bottom">Personal Information</h1>
                        <p className="text-xs pt-1 mb-5">Manage your personal information</p>
                    </div>
                    <div className="flex flex-col col-span-3 md:col-span-1 place-items-center">
                        <p className="pb-10">Your display picture</p>
                        <div className="w-[120px] h-[120px] mb-5">
                          <img src={userData.image_url ? userData.image_url : "https://placehold.co/120x120.png"} alt="Profile" className="rounded-full object-cover w-full h-full" />
                        </div>
                        <div>
                            <button className="custom-btn-container custom-btn" onClick={handleOpenDialog}>Upload Photo</button>
                        </div>
                    </div>
                    {/* Image Upload Popup */}
                    <ImageUploadDialog open={openDialog} handleClose={handleCloseDialog} handleImageUpload={handleImageUpload} />
 
                    {/* Profile Edit Section */}
                    <div className="flex flex-col pt-10 md:pt-0 col-span-3 md:col-span-2 place-items-center items-start">
                      <p>Name</p>
                      <input type="text" name="full_name" value={userData.full_name || ""} onChange={handleInputChangeUserData} className="w-3/4 lg:w-2/3 border border-gray-300" />

                      <p className="pt-5">Email</p>
                      <input type="email" name="email" value={userData.email || ""} onChange={handleInputChangeUserData} className="w-3/4 lg:w-2/3 border border-gray-300" />

                      <p className="pt-5">Date of Birth</p>
                      <input type="date" name="date_of_birth" value={userData.date_of_birth || ""} onChange={handleInputChangeUserData} className="w-1/2 border border-gray-300" />

                      <p className="pt-5">Address</p>
                      <input type="text" name="address" value={userData.address || ""} onChange={handleInputChangeUserData} className="w-3/4 border border-gray-300" />

                      <p className="pt-5">Contact Number</p>
                      <input type="text" name="contact_number" value={userData.contact_number || ""} onChange={handleInputChangeUserData} className="w-3/4 border border-gray-300" />

                      <div className="pt-5 flex justify-center sm:justify-start w-full">
                        <button className="custom-btn-container custom-btn" onClick={handleProfileSave}>Save Changes</button>
                        {profileError && <p className="text-red-500 text-xs">{profileError}</p>}
                        {profileSuccessMessage && <p className="text-green-500 text-xs">{profileSuccessMessage}</p>}
                      </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 mt-10">
                    <div className="flex flex-col place-items-center items-start col-span-3 md:col-span-1 pb-3">
                        <h1 className="font-bold">Password Details</h1>
                        <p className="text-xs">Change your password</p>
                    </div>
                    <div className="flex flex-col col-span-3 md:col-span-2 place-items-center items-start">
                      <p>Current Password</p>
                      <input type="password" name="current_password" value={passwordData.current_password} onChange={handleInputChangePassword} className="w-3/4 lg:w-2/3 border border-gray-300" />
                      <p className="pt-5">New Password</p>
                      <input type="password" name="new_password" value={passwordData.new_password} onChange={handleInputChangePassword} className="w-3/4 lg:w-2/3 border border-gray-300" />
                      <p className="pt-5">Re-enter Password</p>
                      <input type="password" name="confirm_password" value={passwordData.confirm_password} onChange={handleInputChangePassword} className="w-3/4 lg:w-2/3 border border-gray-300" />
                      <div className="pt-5 pb-10 flex justify-center sm:justify-start w-full">
                          <button className="custom-btn-container custom-btn" onClick={handlePasswordChange}>Save Changes</button>
                          {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                          {passwordSuccessMessage && <p className="text-green-500 text-xs">{passwordSuccessMessage}</p>}
                      </div>
                    </div>
                </div>
            </>
        );

      case "Personal Profile":
        return (
            <>
              <div className="w-full pt-2">
                <h1 className="border-bottom">
                  This is where you display your expertise, skills, and what sets you apart from others.
                </h1>
                <p className="pt-10 pb-2 font-bold">What are you here for?</p>
                <div className="flex flex-col space-y-4 pl-2">
                  <ul>
                    {["I need help with tasks", "I'm a tasker", "Just looking around"].map((item) => (
                      <li key={item} className="flex items-center space-x-3 py-1">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4"
                          checked={taskPreferences.includes(item)}
                          onChange={() => toggleCheckbox(item, taskPreferences, setTaskPreferences)}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
        
                {/* About Me Section with Text Area */}
                <h1 className="pt-10 font-bold">About Me</h1>
                <textarea
                  maxLength={2000}
                  rows={4}
                  placeholder="Write about yourself here..."
                  className="w-full border border-gray-300 p-2"
                  onChange={(e) => setAboutMe(e.target.value)}
                  value={aboutMe}
                ></textarea>
                {/* Dynamic character count */}
                <div className="text-right text-sm text-gray-500">
                  {charCount2}/2000 max characters
                </div>
        
                {/* My Expertise Section */}
                <h1 className="pt-10 pb-5 font-bold">My Expertise</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    "Accounting",
                    "Furniture assembly",
                    "Carpentry",
                    "Cleaning",
                    "Computers & IT",
                    "Delivery",
                    "Electrical",
                    "Gardening",
                    "Handyman",
                    "Painting",
                    "Photography",
                    "Plumbing",
                    "Writing",
                    "Building & Construction",
                    "Others",
                  ].map((skill) => (
                    <div key={skill} className="flex items-center space-x-3">
                      <input type="checkbox" className="form-checkbox h-4 w-4" checked={expertise.includes(skill)} onChange={() => toggleCheckbox(skill, expertise, setExpertise)} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="py-10 text-center sm:text-start">
                <button className="custom-btn-container custom-btn" onClick={handleSave}>Save Changes</button>
              </div>
            </>
          );
        

      case "My Portfolio":
        return (
            <>
              <AlbumGrid 
                albums={albums}
                albumTitle={albumTitle}
                setAlbumTitle={setAlbumTitle}
                handleCreateAlbum={handleCreateAlbum}
                handleAddImage={handleAddImage}
                handleDeleteAlbum={handleDeleteAlbum}
                isCreatingAlbum={isCreatingAlbum}
                setIsCreatingAlbum={setIsCreatingAlbum}
                selectedAlbum={selectedAlbum}
                setSelectedAlbum={setSelectedAlbum}
                imageFile={imageFile}
                setImageFile={setImageFile}
                imageDescription={imageDescription}
                setImageDescription={setImageDescription}
                notification={notification}
              />
            </>
        );

      case "Notifications":
        return (
          <>
            <div className="w-full pt-2">
              <div className="mb-2">
                <div className="grid grid-cols-3 mt-2 mb-5 gap-4 border-bottom place-items-start">
                  <div className="col-span-3 md:col-span-1">
                    <label>Filter Notifications: </label>
                    <select
                      onChange={(e) => handleFilterChange(e.target.value)}
                      value={selectedFilter}
                    >
                      <option value="None">None</option>
                      <option value="All">All</option>
                      <option value="Read">Read</option>
                      <option value="Unread">Unread</option>
                    </select>
                  </div>
                  {selectedNotifications.length > 0 && (
                    <>
                      <div className="flex flex-col md:flex-row col-span-3 md:col-span-2 mr-2 gap-x-2 gap-y-2 md:gap-y-0">
                        <button onClick={handleDelete} className="w-auto">Delete</button>
                        <button onClick={handleMarkAsRead} className="w-auto">Mark as Read</button>
                      </div>
                    </>
                  )}
                </div>
                <div>
                  {notifications.map((notif) => (
                    <div
                    className={`py-1 flex items-center space-x-3 ${
                      selectedNotifications.includes(notif.id) ? "bg-blue-200" : "highlight-selector"
                    }`}
                    key={notif.id}
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4"
                      checked={selectedNotifications.includes(notif.id)}
                      onChange={() => handleCheckboxChange(notif.id)}
                    />
                    <span
                      style={{
                        cursor: "pointer",
                        textDecoration: notif.read ? "line-through" : "none",
                      }}
                      onClick={() => alert(notif.fullDetails)}
                      className="pl-2"
                    >
                      {notif.text}
                    </span>
                  </div>                  
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case "Verification":
        return <p>Manage your account verification here...</p>;
      case "Deactivate Account":
        return (
          <>
            <div className="w-full pt-2">
              <p>
                Deactivating your account will disable your profile, and you would not
                receive notifications from the platform, such as task alerts and push
                notifications.
              </p>
              <p className="py-5">
                Some information may still be visible to others, such as your public
                profile, public reviews, and the tasks that you have completed.
              </p>
              <h1 className="py-5 font-bold">Reasons for deactivating:</h1>
              <ul>
                {/* Render radio buttons */}
                {[
                  "I'll be back. I'm just taking a break",
                  "I get too many emails and notifications",
                  "I accidentally made another account",
                  "I don't feel safe on Motueka Tasks",
                  "I don't understand how to use Motueka Tasks",
                  "I don't find Motueka Tasks useful",
                  "Others - please tell us a bit more",
                ].map((reason, index) => (
                  <li key={index} className="py-2">
                    <label>
                      <input
                        type="radio"
                        name="deactivationReason"
                        value={reason}
                        className="mr-2"
                        onChange={(e) => setSelectedReason(e.target.value)}
                      />
                      {reason}
                    </label>
                  </li>
                ))}
              </ul>
              {/*
                Textarea for "Others" reason; disable unless "Others" is selected
              */}
              <textarea
                className="w-full border rounded-md mt-3 p-2"
                rows="4"
                maxLength="2000"
                placeholder="Tell us a bit more..."
                disabled={selectedReason !== "Others - please tell us a bit more"} // Activate only if "Others" is selected
                value={otherDetails} // Bind value to state
                onChange={(e) => setOtherDetails(e.target.value)} // Update state on change
              ></textarea>
              <p className="text-sm text-gray-500 text-right">
                {otherDetails.length}/2000 max characters
              </p>

              <h1 className="py-5 font-bold">Deactivate account?</h1>
              <div>
                <label>
                  <input
                    type="checkbox"
                    className="mr-2 h-4 w-4"
                    onChange={(e) => setDeactivateConfirmation(e.target.checked)}
                  />
                  Yes, I want to deactivate my account
                </label>
              </div>
              <div className="pt-5 pb-10">
                <button
                  onClick={handleDeactivateAccount}
                  disabled={!deactivateConfirmation}
                  className={`custom-btn-container custom-btn ${
                    deactivateConfirmation
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-gray-700 cursor-not-allowed"
                  }`}
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </>
        );      
      default:
        return <p>Select an option from the menu.</p>;
    }
  };

  return (
    <>
      <Hero onTaskAdded={handleTaskAdded} />

      <div className="container-fluid flex justify-center pb-10">
        <div className="container max-w-6xl pt-3 px-2">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-0 sm:gap-x-2 gap-y-4 mt-3">
            <div className="flex flex-col col-span-4 sm:col-span-1">
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
            <div className="flex flex-col col-span-4 sm:col-span-3 bg-card-border rounded px-5 pt-2">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MySettings;