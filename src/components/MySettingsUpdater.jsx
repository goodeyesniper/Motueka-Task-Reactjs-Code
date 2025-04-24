export const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile/", {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`, // Pass the auth token
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }
      return await response.json();  
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  };

export const updateProfile = async (data) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/profile/update/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`, // Pass the auth token
        },
        body: JSON.stringify(data),
      });
      return response.ok ? await response.json() : Promise.reject(await response.json());
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  };
  
export const changePassword = async (data) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/password/change/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`, // Pass the auth token
      },
      body: JSON.stringify(data),
    });
    return response.ok ? await response.json() : Promise.reject(await response.json());
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
};

export const uploadProfileImage = async (selectedImage) => {
  const formData = new FormData();
  formData.append("image", selectedImage);

  try {
    const response = await fetch("http://127.0.0.1:8000/api/profile/upload-image/", { // ✅ Correct endpoint
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return await response.json();
  } catch (error) {
    console.error("Image upload error:", error);
    throw error;
  }
};