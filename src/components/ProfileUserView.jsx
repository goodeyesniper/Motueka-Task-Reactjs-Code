import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Hero from './Hero';
import { getLastSeenStatus } from "../utils/lastSeen";
import { fetchSpecificUserProfile } from "./MySettingsUpdater";

const ProfileUserView = () => {
    const [profile, setProfile] = useState(null);
    // const [reviews, setReviews] = useState([]);
    // const [rating, setRating] = useState(0);
    // const [comment, setComment] = useState("");
    const [lastSeen, setLastSeen] = useState(null);

    const { username } = useParams();
    console.log("Extracted username from URL:", username);
    

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
    
            // const reviewsRes = await fetch(`/profile/${username}/reviews/`, {
            //   headers: {
            //     "Content-Type": "application/json",
            //     Authorization: `Token ${localStorage.getItem("token")}`,
            //   },
            // });
    
            // if (!reviewsRes.ok) throw new Error("Failed to load reviews");
            // const reviewsData = await reviewsRes.json();
            // setReviews(reviewsData);
          } catch (error) {
            console.error("Error fetching profile or reviews:", error);
          }
        };
    
        fetchData();
    }, [username]);
    

    // const submitReview = () => {
    //     fetch("/profile/review/", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ username, rating, comment }),
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             alert(data.message);
    //             setReviews([...reviews, { reviewer: "You", rating, comment, created_at: new Date().toISOString() }]);
    //         });
    // };

    const handleTaskAdded = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]);
      };

    return (
        <>
            <Hero onTaskAdded={handleTaskAdded} />

            <div className="container-fluid flex justify-center pb-10">
                <div className="container max-w-6xl pt-3 px-2">
                    <div className="grid grid-cols-4 gap-x-2 mt-3 gap-y-4">
                        {/* Profile Information */}
                        {profile && (
                        <div className="flex flex-col col-span-4 sm:col-span-1">
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

                        {/* Portfolio Section */}
                        <div className="flex flex-col col-span-4 sm:col-span-3 px-5 pt-2 pb-10 bg-card-border-2 rounded">
                            <h1 className="border-bottom mb-5 font-bold">My Portfolio</h1>
                            {/* Portfolio content remains unchanged */}

                            {/* Review Section */}
                            {/* <div className="pt-10">
                                <h1 className="font-bold">Reviews</h1>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => (
                                        <div key={index} className="border p-3 rounded my-2">
                                            <p className="font-bold">{review.reviewer} - {review.rating}/5</p>
                                            <p>{review.comment}</p>
                                            <p className="text-sm text-gray-500">{new Date(review.created_at).toDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No reviews yet.</p>
                                )}

                                <div className="mt-4">
                                    <h2 className="font-bold">Leave a Review</h2>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={rating}
                                        onChange={e => setRating(e.target.value)}
                                        className="border p-2 rounded"
                                        placeholder="Rating (1-5)"
                                    />
                                    <textarea
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        className="border p-2 rounded mt-2 w-full"
                                        placeholder="Write your review..."
                                    />
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2" onClick={submitReview}>
                                        Submit Review
                                    </button>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileUserView;