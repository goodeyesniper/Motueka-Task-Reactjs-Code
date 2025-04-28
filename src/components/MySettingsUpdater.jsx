import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api";
const authHeader = () => ({
  Authorization: `Token ${localStorage.getItem("token")}`,
});

export const fetchAlbumsWithImages = async () => {
  try {
    const res = await axios.get(`${API_BASE}/albums/`, {
      headers: authHeader(),
    });

    const albumsWithImages = await Promise.all(
      res.data.map(async (album) => {
        const imageRes = await axios.get(`${API_BASE}/album-images/?album=${album.id}`, {
          headers: authHeader(),
        });
        return { ...album, images: imageRes.data };
      })
    );

    return albumsWithImages;
  } catch (error) {
    console.error("Error fetching albums:", error);
    throw error;
  }
};

export const createAlbum = async (title) => {
  try {
    const res = await axios.post(
      `${API_BASE}/albums/`,
      { title },
      { headers: authHeader() }
    );
    return { ...res.data, images: [] };
  } catch (error) {
    console.error("Error creating album:", error);
    throw error;
  }
};

export const addImageToAlbum = async (albumId, imageFile, description) => {
  const formData = new FormData();
  formData.append("album", albumId);
  formData.append("image", imageFile);
  formData.append("description", description);

  try {
    const res = await axios.post(`${API_BASE}/album-images/`, formData, {
      headers: {
        ...authHeader(),
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteAlbum = async (albumId) => {
  try {
    await axios.delete(`${API_BASE}/albums/${albumId}/`, {
      headers: authHeader(),
    });
  } catch (error) {
    console.error("Error deleting album:", error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/profile/`, {
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
      const response = await fetch(`${API_BASE}/profile/update/`, {
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
    const response = await fetch(`${API_BASE}/password/change/`, {
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
    const response = await fetch(`${API_BASE}/profile/upload-image/`, { // ✅ Correct endpoint
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

export const fetchUserProfileData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/user-profile/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const saveUserProfile = async (payload, profileId) => {
  try {
    const headers = {
      Authorization: `Token ${localStorage.getItem("token")}`,
    };

    if (profileId) {
      await axios.put(`${API_BASE}/user-profile/${profileId}/`, payload, { headers });
    } else {
      const response = await axios.post(`${API_BASE}/user-profile/`, payload, { headers });
      return response.data; // Return to get the new ID
    }
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
};

// For fetching other user's profile
export const fetchSpecificUserProfile = async (username) => {
  if (!username) {
      console.error("Error: username is undefined.");
      return null;
  }

  try {
      const response = await axios.get(`${API_BASE}/public-user-profile/${username}/`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });
      
      return response.data;
  } catch (error) {
      console.error(`Error fetching profile for ID ${username}:`, error);
      return null;
  }
};

export const fetchUserAlbums = async (username) => {
  if (!username) {
    console.error("Error: username is undefined.");
    return [];
  }

  try {
      const response = await axios.get(`${API_BASE}/albums/?user=${username}`, {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      });

      console.log("Fetched albums for", username, response.data);
      return response.data; // Returns album data
  } catch (error) {
      console.error(`Error fetching albums for username ${username}:`, error);
      return [];
  }
};
