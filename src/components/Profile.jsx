const Profile = ({ img }) => {
    return (
      <div className="flex justify-center items-center w-full">
        <img
          src={img || "https://placehold.co/100x100.png?text=No+Image"}
          alt="Profile"
          className="w-[100px] h-[100px] rounded-full object-cover border-2 border-gray-300 shadow-md"
        />
      </div>
    );
  };
  
  export default Profile;
  