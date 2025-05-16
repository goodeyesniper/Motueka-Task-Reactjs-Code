const Profile = ({ img, size = 100 }) => {
  return (
    <div className="flex justify-center items-center w-full">
      <img
        src={img || "https://placehold.co/100x100.png?text=No+Image"}
        alt="Profile"
        className={`rounded-full object-cover border-2 border-gray-300 shadow-md`}
        style={{ width: `${size}px`, height: `${size}px` }} // Dynamic size
      />
    </div>
  );
};

export default Profile;