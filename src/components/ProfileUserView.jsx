import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hero from './Hero';
import { getLastSeenStatus } from "../utils/lastSeen";
import { fetchSpecificUserProfile, fetchUserAlbums } from "./MySettingsUpdater";
import { Dialog, DialogContent, Button } from "@mui/material";
import ReviewPanel from './ReviewPanel';
import axios from "axios";


const ProfileUserView = () => {
    const [profile, setProfile] = useState(null);
    const [lastSeen, setLastSeen] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const { username } = useParams();
    
    // Function to fetch reviews from the backend
    const fetchReviews = async () => {
        try {
        const response = await axios.get(`http://127.0.0.1:8000/profile/${username}/reviews/`);
        setReviews(response.data);
        setLoading(false);
        } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
        }
    };

    // Function that gets called after a review is successfully submitted
    const handleReviewSubmitted = () => {
        fetchReviews(); // Re-fetch reviews after submission
    };

    useEffect(() => {
        const fetchData = async () => {
            
            if (!username) {
                console.error("Username is undefined, cannot fetch profile.");
                return;
            }

            try {
                const profileData = await fetchSpecificUserProfile(username);
                if (!profileData) throw new Error("Profile not found!");
                setProfile(profileData);

                if (profileData.last_seen) {
                    setLastSeen(profileData.last_seen);
                }

                const userAlbums = await fetchUserAlbums(username);
                setAlbums(userAlbums);

                await fetchReviews();
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchData();
    }, [username]);

    const handleTaskAdded = (newTask) => {
        // You can later implement task-related features here
        console.log("New task added:", newTask);
    };

    return (
        <>
            <Hero onTaskAdded={handleTaskAdded} />

            <div className="container-fluid flex justify-center pb-10">
                <div className="container max-w-6xl pt-3 px-2">
                    <div className="grid grid-cols-4 gap-x-2 mt-3 gap-y-4">
                        {profile && (
                            <div className="flex flex-col col-span-4 sm:col-span-1">
                                {/* Profile Sidebar */}
                                <div className="place-items-center text-center pb-10 px-5 bg-card-border-2 rounded">
                                    <div className="w-[120px] h-[120px] mt-10">
                                        <img
                                            src={profile?.image_url || "https://placehold.co/120x120.png"}
                                            alt="Profile"
                                            className="rounded-full object-cover w-full h-full"
                                        />
                                    </div>
                                    <p className="pt-2 pb-5 font-bold text-lg">{profile?.full_name}</p>

                                    {lastSeen && (
                                        <div className="text-sm">
                                            <div className="flex justify-center items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${getLastSeenStatus(lastSeen).online ? "bg-green-500" : "bg-gray-400"}`}></span>
                                                <span>{getLastSeenStatus(lastSeen).status}</span>
                                            </div>
                                            <div className="items-center py-2 text-center">
                                                {getLastSeenStatus(lastSeen).lastSeenText}
                                            </div>
                                        </div>
                                    )}

                                    <p className="pt-2 pb-5 text-sm">Member Since <span>{profile?.member_since}</span></p>
                                    <p className="pt-5 pb-2 text-sm font-bold">Lives in <span>{profile?.address}</span></p>
                                    <h1 className="pt-5 pb-2 text-sm font-bold">About Me</h1>
                                    <p className="pb-2 text-sm">"{profile?.about_me || "This person is too lazy to provide details"}"</p>
                                    <h1 className="pt-5 pb-2 text-sm font-bold">Skills</h1>
                                    <p className="pb-2 text-sm">
                                        {Array.isArray(profile?.skills) && profile.skills.length > 0
                                            ? profile.skills.join(", ")
                                            : "No skills listed"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Portfolio and Reviews */}
                        <div className="flex flex-col col-span-4 sm:col-span-3 px-5 pt-2 pb-10 bg-card-border-2 rounded">
                            {/* Portfolio Section */}
                            <h1 className="border-bottom mb-5 font-bold">{profile?.full_name}'s Portfolio</h1>

                            {selectedAlbum ? (
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {albums.length > 0 ? (
                                        albums.map((album) => (
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
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">No albums yet. Start uploading!</p>
                                    )}

                                </div>
                            )}

                            {/* Lightbox Dialog */}
                            <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="md" fullWidth>
                                <DialogContent className="flex flex-col items-center justify-center">
                                    {selectedAlbum?.images?.[currentImageIndex] ? (
                                        <img
                                            src={selectedAlbum.images[currentImageIndex].image}
                                            alt="Enlarged"
                                            className="max-h-[70vh] object-contain"
                                        />
                                    ) : (
                                        <p className="text-center">No image available</p>
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

                            {/* Reviews Section */}
                            <div className="pt-10">
                                {/* Review Panel */}
                                <ReviewPanel username={username} onReviewSubmitted={handleReviewSubmitted} />

                                {/* Reviews Section */}
                                <div>
                                <h2 className="text-xl mt-5">Reviews</h2>
                                {loading ? (
                                    <p>Loading reviews...</p>
                                ) : (
                                    <ul>
                                    {reviews.map((review, index) => (
                                        <li key={index} className="border p-3 my-2">
                                        <div className="font-semibold">{review.reviewer}</div> {/* 🔥 Show reviewer name */}
                                        <div>{review.comment}</div>
                                        <div>Rating: {review.rating}/5</div>
                                        </li>
                                        // Add reviewer name here
                                    ))}
                                    </ul>
                                )}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileUserView;
