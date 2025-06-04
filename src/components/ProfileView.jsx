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
    const [tasks, setTasks] = useState([]);
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
    const userHasReviewed = reviews.some(review => review.reviewer.username === currentUsername);
    const averageRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;


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

                                <h1 className="pt-10 pb-5 text-sm font-bold">Socials</h1>
                                <div className="flex justify-center items-center gap-x-4">
                                    {profile.facebook && (
                                        <Link to={profile.facebook}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#0866ff" className="bi bi-facebook" viewBox="0 0 16 16">
                                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                                            </svg>
                                        </Link>
                                    )}
                                    {profile.instagram && (
                                        <Link to={profile.instagram}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#e44569" className="bi bi-instagram" viewBox="0 0 16 16">
                                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                                            </svg>
                                        </Link>
                                    )}
                                    {profile.twitter && (
                                        <Link to={profile.twitter}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                                            <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                                            </svg>
                                        </Link>
                                    )}
                                </div>
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
                                    {isAuthenticated && currentUsername !== username && !userHasReviewed && (
                                        <ReviewPanel username={username} onReviewSubmitted={handleReviewSubmitted} />
                                    )}

                                    {/* Reviews Section */}
                                    <div>
                                        <div className="border-bottom flex flex-col sm:flex-row justify-between mt-5">
                                            <h2 className="font-semibold pb-2">Reviews:</h2>
                                            {averageRating && (
                                                <h2 className="text-sm pb-2 font-semibold">
                                                    Average Rating: &nbsp; <span className="text-yellow-500 text-lg">{averageRating} ★</span>
                                                </h2>
                                            )}
                                        </div>
                                        {reviewsLoading ? (
                                            <p>Loading reviews...</p>
                                        ) : (
                                            <ul className="pt-2">
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
