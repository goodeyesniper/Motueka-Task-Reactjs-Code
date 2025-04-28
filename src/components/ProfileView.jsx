import React, { useEffect, useState } from "react";
import ReviewPanel from './ReviewPanel'
import { fetchUserProfile, fetchAlbumsWithImages } from "./MySettingsUpdater";
import { Dialog, DialogContent, Button } from "@mui/material";
import { getLastSeenStatus } from "../utils/lastSeen";
import Hero from './Hero';

const ProfileView = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastSeen, setLastSeen] = useState(null);

    const [albums, setAlbums] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // ✅ Fetch user profile
            const userData = await fetchUserProfile();
            setProfile(userData);
            if (userData?.last_seen) {
              setLastSeen(userData.last_seen);
            }
      
            // ✅ Fetch albums
            const albumData = await fetchAlbumsWithImages();
            setAlbums(albumData);
            
          } catch (error) {
            console.error("Error loading profile or albums:", error);
          } finally {
            setLoading(false); // ✅ Ensure loading state is updated correctly
          }
        };
      
        fetchData();

        const getAlbums = async () => {
            try {
              const albumData = await fetchAlbumsWithImages();
              setAlbums(albumData);
            } catch (error) {
              console.error("Error loading albums:", error);
            }
          };
          getAlbums();

        // ✅ Auto-update last_seen every 60 sec
        const interval = setInterval(async () => {
          try {
            const updatedData = await fetchUserProfile();
            if (updatedData?.last_seen) {
              setLastSeen(updatedData.last_seen);
            }
          } catch (error) {
            console.error("Error refreshing last seen:", error);
          }
        }, 60000);
      
        return () => clearInterval(interval); // ✅ Cleanup interval on unmount
      }, []);
    
    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>Error loading profile.</p>;
    if (!albums) return <p>Loading albums...</p>;
    if (!albums) return <p>Loading albums...</p>;

    const handleTaskAdded = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
      };
    
    return (
        <>
            <Hero onTaskAdded={handleTaskAdded} />

            <div className="container-fluid flex justify-center pb-10">
                <div className="container max-w-6xl pt-3 px-2">
                    <div className="grid grid-cols-4 gap-x-2 mt-3 gap-y-4">
                        <div className="flex flex-col col-span-4 sm:col-span-1">
                            <div className="place-items-center text-center pb-10 px-5 bg-card-border-2 rounded">
                                <div className="w-[120px] h-[120px] mt-10">
                                    <img
                                        src={profile?.image_url || "https://placehold.co/120x120.png"} // ✅ Use profile image or fallback
                                        alt="Profile"
                                        className="rounded-full object-cover w-full h-full"
                                    />

                                </div>

                                <p className="pt-2 pb-5 font-bold text-lg">{profile.full_name}</p>

                                {lastSeen && (
                                    <div className="text-sm">
                                        <div className="flex justify-center items-center gap-2">
                                        <span
                                            className={`w-2 h-2 rounded-full ${
                                            getLastSeenStatus(lastSeen).online ? "bg-green-500" : "bg-gray-400"
                                            }`}
                                        ></span>
                                        <span>{getLastSeenStatus(lastSeen).status}</span>
                                        </div>
                                        <div className="items-center py-2 text-center">
                                        {getLastSeenStatus(lastSeen).lastSeenText}
                                        </div>
                                    </div>
                                )}

                                <p className="pt-2 pb-5 text-sm">Member Since <span className="">{profile.member_since}</span></p>
                                <p className="pt-5 pb-2 text-sm font-bold">Lives in <span className="">{profile.address}</span></p>
                            
                                <h1 className="pt-5 pb-2 text-sm font-bold">About Me</h1>
                                <p className="pb-2 text-sm">"{profile.about_me || "This person is too lazy to provide details"}"</p>
                                <h1 className="pt-5 pb-2 text-sm font-bold">Skills</h1>
                                <p className="pb-2 text-sm">{profile.skills.length > 0 ? profile.skills.join(", ") : "No skills listed"}</p>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-4 sm:col-span-3 px-5 pt-2 pb-10 bg-card-border-2 rounded">
                            <div>
                                <h1 className="border-bottom mb-5 font-bold">My Portfolio</h1>
                                {selectedAlbum ? (
                                    // ✅ Inside an Album View
                                    <div className="flex flex-col">
                                        <h2 className="font-bold py-2">Album Name: {selectedAlbum.title}</h2>
                                        <div>
                                            <Button onClick={() => setSelectedAlbum(null)}>← Back</Button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {selectedAlbum.images.map((image, index) => (
                                            <img
                                                key={image.id}
                                                src={image.image}
                                                alt={image.description || "Album Image"}
                                                className="w-full h-full object-cover object-center rounded-lg cursor-pointer"
                                                onClick={() => {
                                                setCurrentImageIndex(index);
                                                setLightboxOpen(true);
                                                }}
                                            />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // ✅ Albums View
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {albums.map((album) => (
                                        <div key={album.id} className="bg-card-border p-4 rounded-lg cursor-pointer" onClick={() => setSelectedAlbum(album)}>
                                        <h2 className="font-bold">{album.title}</h2>
                                        <p className="text-sm">Created: {new Date(album.created_at).toDateString()}</p>

                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                            {album.images.slice(0, 3).map((image) => (
                                            <img
                                                key={image.id}
                                                src={image.image}
                                                alt={image.description || "Album Image"}
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            ))}
                                        </div>
                                        <p className="text-sm mt-2">Click to view all images</p>
                                        </div>
                                    ))}
                                    </div>
                                )}

                                {/* ✅ Image Dialog for Enlarged View */}
                                <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="md" fullWidth>
                                    <DialogContent className="flex flex-col items-center justify-center">
                                        {selectedAlbum?.images?.[currentImageIndex] ? (
                                        <img
                                            src={selectedAlbum.images[currentImageIndex].image}
                                            alt="Enlarged"
                                            className="max-h-[70vh] object-contain"
                                        />
                                        ) : (
                                        <p className="text-center">No image available</p> // ✅ Fallback to prevent errors
                                        )}

                                        <div className="flex justify-between w-full mt-4">
                                        <Button
                                            onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : selectedAlbum.images.length - 1))}
                                            disabled={selectedAlbum?.images?.length === 0}
                                        >
                                            ← Previous
                                        </Button>
                                        <Button
                                            onClick={() => setCurrentImageIndex((prev) => (prev < selectedAlbum.images.length - 1 ? prev + 1 : 0))}
                                            disabled={selectedAlbum?.images?.length === 0}
                                        >
                                            Next →
                                        </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            {/* <div className="pt-10">
                                <h1 className="font-bold">Reviews</h1>
                                <p>Reviews from different users here..</p>
                                <ReviewPanel />
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileView