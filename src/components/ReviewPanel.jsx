import React, { useState } from "react";

const ReviewPanel = () => {
  const [isReviewVisible, setIsReviewVisible] = useState(false); // Toggle review input visibility
  const [title, setTitle] = useState(""); // State for the review title
  const [review, setReview] = useState(""); // State for the review content
  const [charCount, setCharCount] = useState(0); // State for character count
  const [rating, setRating] = useState(0); // State for star rating
  const [notification, setNotification] = useState(""); // State for notification message

  const handleReviewSubmit = () => {
    if (title.trim() === "" || review.trim() === "" || rating === 0) {
      // Display notification if any field is unfilled
      setNotification(
        "Please fill out all fields: title, review, and select a star rating."
      );
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(""), 3000);
    } else {
      alert(`Review Submitted:
        Title: ${title}
        Review: ${review}
        Rating: ${rating} star(s)`);
      // Clear states after submission
      setTitle("");
      setReview("");
      setRating(0);
      setIsReviewVisible(false);
      setCharCount(0);
      setNotification(""); // Clear any notifications
    }
  };

  // Check if all required fields are filled
  const isFormValid = title.trim() !== "" && review.trim() !== "" && rating > 0;

  const handleCancel = () => {
    setTitle("");
    setReview("");
    setRating(0);
    setCharCount(0);
    setNotification("");
    setIsReviewVisible(false);
  };

  return (
    <div className="review-panel p-4 w-full mx-auto overflow-hidden">
      <button
        onClick={() => setIsReviewVisible(true)}
        className="custom-btn-container custom-btn"
      >
        Add Review
      </button>

      {isReviewVisible && (
        <div className="mt-4">
          {/* Notification */}
          {notification && (
            <div className="bg-red-100 border border-red-500 text-red-500 p-2 rounded mb-4">
              {notification}
            </div>
          )}

          {/* Title Field */}
          <div className="mb-4">
            <label className="block font-bold">Review Title</label>
            <input
              type="text"
              className="w-full border-color-input rounded-md p-2"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Textarea for Review */}
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
            <p className="text-right text-sm text-gray-500">
              {charCount}/2000 max characters
            </p>
          </div>

          {/* Star Rating */}
          <div className="mb-4">
            <label className="block font-bold pb-2">Rating: {rating}/5</label> {/* Dynamically show the selected rating */}
            <div className="flex flex-wrap gap-2"> {/* Enable wrapping */}
                {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    className={`text-sm custom-btn-container custom-btn ${
                    star <= rating ? "text-yellow-500" : "text-gray-400"
                    }`}
                    onClick={() => setRating(star)} // Update rating state on click
                >
                    ★
                </button>
                ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="grid grid-cols-2 place-content-between pt-10 pb-5">
            <div className="text-start">
                <button
                    onClick={handleReviewSubmit} // Always clickable
                    className={`custom-btn-container custom-btn ${
                        isFormValid
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white cursor-pointer"
                    }`}
                    >
                    Submit
                </button>
            </div>
            <div className="text-end">
                <button
                    onClick={handleCancel}
                    className="custom-btn-container custom-btn"
                    >
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