import React, { useEffect, useState } from "react";
import ReviewPanel from './ReviewPanel';
import { Dialog, DialogContent, Button } from "@mui/material";
import { getLastSeenStatus } from "../utils/lastSeen";
import Hero from './Hero';
import { Link } from 'react-router-dom';
import Profile from './Profile';


import { API_BASE, authHeader1 } from "../api/config";
import { useParams } from "react-router-dom";

const ProfileView = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastSeen, setLastSeen] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const isAuthenticated = localStorage.getItem('token') !== null;

    const [currentUsername, setCurrentUsername] = useState(null);
    const { username } = useParams();

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);
            const response = await fetch(`${API_BASE}/profile/${username}/reviews/`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    // Function that gets called after a review is successfully submitted
    const handleReviewSubmitted = () => {
        fetchReviews(); // Re-fetch reviews after submission
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch current user
                if (isAuthenticated) {
                    const userRes = await fetch(`${API_BASE}/current-user/`, {
                         headers: authHeader1()
                    });

                    if (userRes.ok) {
                        const userData = await userRes.json();
                        setCurrentUsername(userData.username);
                    }
                }

                // Fetch profile based on username
                const response = await fetch(`${API_BASE}/profile/${username}/`, {
                    method: "GET",
                    headers: authHeader1()
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }

                const userData = await response.json();

                if (userData?.detail === "User not authenticated") {
                    setProfile(null); // explicitly mark as anonymous
                } else {
                    setProfile(userData);
                    if (userData?.last_seen) {
                        setLastSeen(userData.last_seen);
                    }
                }

                // Fetch albums (always possible, even for non-authenticated users)
                const albumRes = await fetch(`${API_BASE}/albums/?user=${username}`, {
                    headers: authHeader1()
                });

                if (!albumRes.ok) {
                    throw new Error("Failed to fetch albums");
                }

                const albumsData = await albumRes.json();
                const albumsWithImages = await Promise.all(
                    albumsData.map(async (album) => {
                        const imageRes = await fetch(`${API_BASE}/album-images/?album=${album.id}`, {
                            headers: authHeader1()
                        });

                        if (!imageRes.ok) {
                            throw new Error(`Failed to fetch images for album ${album.id}`);
                        }

                        const imagesData = await imageRes.json();
                        return { ...album, images: imagesData };
                    })
                );
                setAlbums(albumsWithImages);
                await fetchReviews();

            } catch (error) {
                console.error("Error loading profile or albums:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Set up interval to refresh last_seen every 60 seconds
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${API_BASE}/profile/${username}/`, {
                    method: "GET",
                    headers: authHeader1()
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user profile");
                }

                const updatedData = await response.json();
                if (updatedData?.last_seen) {
                    setLastSeen(updatedData.last_seen);
                }

            } catch (error) {
                console.error("Error refreshing last seen:", error);
            }
        }, 60000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [username]); 

    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>Error loading profile.</p>;
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

                                <div className="flex-shrink-0 mt-10">
                                    {profile?.image_url && (
                                        <Profile img={profile?.image_url || null} />
                                    )}
                                </div>
                                <p className="pt-2 pb-5 font-bold text-sm">{profile.full_name}</p>

                                {lastSeen && (
                                    <div className="text-xs">
                                        <div className="flex justify-center items-center gap-2">
                                            <span
                                                className={`w-2 h-2 rounded-full ${getLastSeenStatus(lastSeen).online ? "bg-green-500" : "bg-gray-400"}`}
                                            ></span>
                                            <span>{getLastSeenStatus(lastSeen).status}</span>
                                        </div>
                                        <div className="items-center py-2 text-center">
                                            {getLastSeenStatus(lastSeen).lastSeenText}
                                        </div>
                                    </div>
                                )}

                                <p className="pt-2 pb-5 text-xs">Member Since <span className="">{profile.member_since}</span></p>
                                <p className="pt-5 pb-2 text-sm font-bold">Lives in <span className="">{profile.address}</span></p>
                            
                                <h1 className="pt-5 pb-2 text-sm font-bold">About Me</h1>
                                <p className="pb-2 text-sm">"{profile.about_me || "This person is too lazy to provide details"}"</p>
                                <h1 className="pt-5 pb-2 text-sm font-bold">Skills</h1>
                                <p className="pb-2 text-sm">{profile.skills.length > 0 ? profile.skills.join(", ") : "No skills listed"}</p>
                            </div>
                        </div>
                        <div className="flex flex-col col-span-4 sm:col-span-3 px-5 pt-2 pb-10 bg-card-border-2 rounded">
                            <div>
                                <div className="flex flex-col sm:flex-row justify-between border-bottom mb-5 place-items-start sm:place-items-center">
                                    <h1 className="font-bold py-2">My Portfolio</h1>
                                    <div className="py-2 flex items-center">
                                        {isAuthenticated && currentUsername === username && (
                                            <Link to="/mysettings?tab=My Portfolio" className="custom-btn-container custom-btn">
                                                Edit Portfolio
                                            </Link>
                                        )}
                                    </div>
                                </div>
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
                                        <h2 className="mt-5 font-semibold">Reviews:</h2>
                                        {reviewsLoading ? (
                                            <p>Loading reviews...</p>
                                        ) : (
                                            <ul>
                                                {reviews.map((review, index) => (
                                                    <li key={index} className="bg-input-card-border rounded p-3 my-2 flex gap-4 items-start">
                                                        <div className="flex-shrink-0">
                                                            {review?.reviewer.image && (
                                                                <Profile img={review?.reviewer.image} size={60} />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-sm">
                                                                {review.reviewer.full_name} on {new Date(review.created_at).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric"
                                                                })}
                                                            </div>
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                <span
                                                                    key={star}
                                                                    className={`text-lg ${star <= review.rating ? "text-yellow-500" : "text-gray-400"}`}
                                                                >
                                                                    ★
                                                                </span>
                                                                ))}
                                                            </div>
                                                            <div className="text-sm">{review.comment}</div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileView;
