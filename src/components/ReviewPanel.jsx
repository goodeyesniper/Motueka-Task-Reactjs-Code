import React, { useState } from "react";
import axios from "axios";

const ReviewPanel = ({ username, onReviewSubmitted }) => {
  const [isReviewVisible, setIsReviewVisible] = useState(false);
  const [review, setReview] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [notification, setNotification] = useState("");

  const handleReviewSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setNotification("Error: You are not logged in.");
      console.error("Token is missing!");
      return;
    }

    if (review.trim() === "" || rating === 0) {
      setNotification("Please provide a review and select a rating.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/profile/review/",
        {
          username,    // person being reviewed
          rating,
          comment: review,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      alert(response.data.message);
      setReview("");
      setRating(0);
      setIsReviewVisible(false);
      setNotification("");

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("Error submitting review:", error.response || error);
      setNotification(error?.response?.data?.detail || "Failed to submit review.");
    }
  };

  const isFormValid = review.trim() !== "" && rating > 0;

  const handleCancel = () => {
    setReview("");
    setRating(0);
    setCharCount(0);
    setNotification("");
    setIsReviewVisible(false);
  };

  return (
    <div className="review-panel py-4 pr-4 w-full mx-auto overflow-hidden">
      {!isReviewVisible && (
        <button
          onClick={() => setIsReviewVisible(true)}
          className="custom-btn-container custom-btn"
          disabled={!username}
        >
          {username ? "Write a Review" : "Loading..."}
        </button>
      )}

      {isReviewVisible && (
        <div className="mt-4">
          {notification && (
            <div className="bg-red-100 border border-red-500 text-red-500 p-2 rounded mb-4">
              {notification}
            </div>
          )}

          <div className="mb-4">
            <label className="block font-bold">Review</label>
            <textarea
              className="w-full border-color-input rounded-md p-2"
              rows="4"
              maxLength="2000"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => {
                setReview(e.target.value);
                setCharCount(e.target.value.length);
              }}
            ></textarea>
            <p className="text-right text-sm text-gray-500">{charCount}/2000 max characters</p>
          </div>

          <div className="mb-4">
            <label className="block font-bold pb-2">Rating: {rating}/5</label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-sm custom-btn-container custom-btn ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 place-content-between pt-10 pb-5">
            <div className="text-start">
              <button
                onClick={handleReviewSubmit}
                className={`custom-btn-container custom-btn ${isFormValid ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                disabled={!isFormValid}
              >
                Submit
              </button>
            </div>
            <div className="text-end">
              <button onClick={handleCancel} className="custom-btn-container custom-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPanel;
