import React, { useState } from "react";
import ReviewPanel from './ReviewPanel'

const ProfileView = () => {
    const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
    const [albumTitle, setAlbumTitle] = useState("");
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [notification, setNotification] = useState("");

    const handleCreateAlbum = () => {
    if (!albumTitle.trim()) {
        setNotification("Album title cannot be empty.");
        return;
    }
    setAlbums([...albums, { title: albumTitle, images: [] }]);
    setAlbumTitle("");
    setIsCreatingAlbum(false);
    setNotification("");
    };

    const handleDeleteAlbum = (albumIndex) => {
    const updatedAlbums = albums.filter((_, index) => index !== albumIndex);
    setAlbums(updatedAlbums);
    };

    const handleAddImage = (albumIndex, file, description) => {
    const updatedAlbums = [...albums];
    const reader = new FileReader();

    // Read the file and add to album once loaded
    reader.onload = () => {
        updatedAlbums[albumIndex].images.push({ image: reader.result, description });
        setAlbums(updatedAlbums);
    };
    reader.readAsDataURL(file);
    };

    return (
        <>
            <div className="container-fluid flex justify-center pb-10">
                <div className="container max-w-6xl pt-3 px-2">
                    <div className="grid grid-cols-4 gap-x-2 mt-3 gap-y-4">
                        <div className="flex flex-col col-span-4 sm:col-span-1">
                            <div className="place-items-center text-center pb-10 bg-card-border-2 rounded">
                                <div className="pt-10">
                                    <img src="https://placehold.co/120x120.png" alt="" />
                                </div>
                                <p className="py-2 text-2xl">John Smith</p>
                                <p>Address here..</p>
                                <p className="">Member Since (date of reg)</p>

                                <h1 className="font-bold pt-10 pb-5">About Me</h1>
                                <p className="">Get details from user settings/personal details</p>

                                <h1 className="font-bold pt-10 pb-5">Skills</h1>
                                <p className="">Get details from user settings/personal details</p>
                            </div>

                        </div>
                        <div className="flex flex-col col-span-4 sm:col-span-3 px-5 pt-2 pb-10 bg-card-border-2 rounded">
                            <div>
                                <h1 className="font-bold">Portfolio</h1>
                                <p>Settings / My Portfolio</p>
                                {/* Notification Area */}
                                {notification && (
                                    <div className="text-red-500 text-sm pb-2">{notification}</div>
                                )}

                                {/* Albums */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                    {albums.map((album, index) => (
                                    <div key={index} className="bg-card-color-2 bg-card-border p-2 rounded">
                                        <h2 className="font-bold">{album.title}</h2>
                                        <button
                                        onClick={() => setSelectedAlbum(index)}
                                        className="mt-2 ml-2 text-blue-500"
                                        >
                                        + Add Images
                                        </button>
                                        <button
                                        onClick={() => handleDeleteAlbum(index)}
                                        className="mt-2 ml-2 text-red-500"
                                        >
                                        Delete Album
                                        </button>
                                        <div className="pt-2">
                                        {album.images.map((imageData, imgIndex) => (
                                            <div key={imgIndex} className="pt-1">
                                            <img
                                                src={imageData.image}
                                                alt="album item"
                                                className="w-full h-32 object-cover"
                                            />
                                            <p className="text-sm pt-1">{imageData.description}</p>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    ))}
                                </div>

                                {/* + Icon to Create Album */}
                                <div className="pt-4">
                                    <button
                                    className="border border-gray-400 rounded-full w-10 h-10 custom-btn-container custom-btn flex items-center justify-center text-2xl"
                                    onClick={() => setIsCreatingAlbum(true)}
                                    >
                                    +
                                    </button>
                                </div>

                                {/* Album Creation Form */}
                                {isCreatingAlbum && (
                                    <div className="pt-4 bg-card-color-2 bg-card-border p-4 rounded w-full max-w-sm">
                                    <input
                                        type="text"
                                        placeholder="Album title"
                                        value={albumTitle}
                                        onChange={(e) => setAlbumTitle(e.target.value)}
                                        className="w-full border-color-input p-2 rounded"
                                    />
                                    <div className="flex justify-between pt-4">
                                        <button
                                        onClick={handleCreateAlbum}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                        Create Album
                                        </button>
                                        <button
                                        onClick={() => setIsCreatingAlbum(false)}
                                        className="bg-gray-300 px-4 py-2 rounded"
                                        >
                                        Cancel
                                        </button>
                                    </div>
                                    </div>
                                )}

                                {/* Add Image Section */}
                                {selectedAlbum !== null && (
                                    <div className="pt-4 bg-card-color-2 bg-card-border p-4 rounded w-full max-w-sm">
                                    <h2 className="font-bold">Add Image to {albums[selectedAlbum].title}</h2>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="w-full border-color-input p-2 rounded mt-2"
                                        onChange={(e) =>
                                        handleAddImage(selectedAlbum, e.target.files[0], "")
                                        }
                                    />
                                    <textarea
                                        placeholder="Description"
                                        className="w-full border-color-input p-2 rounded mt-2"
                                        onBlur={(e) =>
                                        handleAddImage(
                                            selectedAlbum,
                                            albums[selectedAlbum].images.length
                                            ? albums[selectedAlbum].images[
                                                albums[selectedAlbum].images.length - 1
                                                ].image
                                            : "",
                                            e.target.value
                                        )
                                        }
                                    ></textarea>
                                    <button
                                        onClick={() => setSelectedAlbum(null)}
                                        className="bg-gray-300 px-4 py-2 rounded mt-2"
                                    >
                                        Done
                                    </button>
                                    </div>
                                )}
                            </div>
                            <div className="pt-10">
                                <h1 className="font-bold">Reviews</h1>
                                <p>Reviews from different users here..</p>
                                <ReviewPanel />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileView