import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const AlbumGrid = ({ 
  albums,
  handleCreateAlbum,
  handleAddImage,
  handleDeleteAlbum,
  albumTitle,
  setAlbumTitle,
  isCreatingAlbum,
  setIsCreatingAlbum,
  selectedAlbum,
  setSelectedAlbum,
  imageFile,
  setImageFile,
  imageDescription,
  setImageDescription,
  notification,
}) => {

  const [isAlbumDialogOpen, setAlbumDialogOpen] = useState(false);
  const [isImageDialogOpen, setImageDialogOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const openAlbum = (index) => {
    setSelectedAlbum(index);
  };

  const getAlbumCover = (album) => {
    const lastImage = album.images[album.images.length - 1];
    return lastImage ? lastImage.image : null;
  };

  const renderAlbumTile = (album, index) => (
    <div
      key={index}
      className="col-span-2 md:col-span-1 bg-input-card-border rounded-lg overflow-hidden cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      onClick={() => openAlbum(index)}
    >
      {getAlbumCover(album) ? (
        <img src={getAlbumCover(album)} alt="cover" className="w-full h-full object-cover object-center" />
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-200">No Image</div>
      )}
      <h1 className="text-center p-2 font-bold">{album.title}</h1>
    </div>
  );

  const renderAddButton = (onClick) => (
    <div
      className="col-span-2 md:col-span-1 bg-input-card-border flex justify-center items-center rounded-lg cursor-pointer hover:scale-110 transition-transform duration-300 ease-in-out"
      onClick={onClick}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="50px" viewBox="0 -960 960 960" width="50px" fill="currentColor">
        <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
      </svg>
    </div>
  );

  const currentAlbum = selectedAlbum !== null ? albums[selectedAlbum] : null;
  const images = currentAlbum?.images || [];

  return (
    <div className="w-full pt-2">
      <h1 className="border-b mb-2 text-xl font-bold">My Portfolio</h1>

      {!currentAlbum && (
        <>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {renderAddButton(() => setAlbumDialogOpen(true))}
            {albums.map(renderAlbumTile)}
          </div>

        </>
      )}

      {currentAlbum && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
            <h2 className="text-md font-bold py-2">Album Name: {currentAlbum.title}</h2>
            <div className="flex justify-between sm:justify-end w-full sm:w-auto gap-2">
                <Button onClick={() => setSelectedAlbum(null)}>← Back</Button>
                <Button color="error" onClick={() => handleDeleteAlbum(selectedAlbum)}>Delete Album</Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {renderAddButton(() => setImageDialogOpen(true))}
            {images.slice().reverse().map((img, idx) => (
              <div key={idx} className="col-span-2 md:col-span-1 bg-input-card-border rounded-lg overflow-hidden hover:scale-110 transition-transform duration-300 ease-in-out">
                <img 
                    src={img.image} 
                    alt="Album" 
                    className="w-full h-full object-cover object-center" 
                    onClick={() => {
                        setCurrentImageIndex(images.length - 1 - idx); // since you reversed earlier
                        setLightboxOpen(true);
                    }}
                />
                <p className="p-2 text-sm">{img.description}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Album Dialog */}
      <Dialog open={isAlbumDialogOpen} onClose={() => setAlbumDialogOpen(false)}>
        <DialogTitle>Create New Album</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Album Title"
            fullWidth
            value={albumTitle}
            onChange={(e) => setAlbumTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlbumDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            handleCreateAlbum();
            setAlbumDialogOpen(false);
          }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onClose={() => setImageDialogOpen(false)}>
        <DialogTitle>Add Image to {currentAlbum?.title}</DialogTitle>
        <DialogContent>
            <div className="file-input-wrapper my-5 flex items-center">
                <label 
                    htmlFor="file-upload" 
                    className="custom-btn-container custom-btn rounded-2xl cursor-pointer"
                >
                    {imageFile ? imageFile.name : "Choose File"}
                </label>
                <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="hidden" // Hide the default file input button
                />
            </div>

          {/* <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} /> */}

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={imageDescription}
            onChange={(e) => setImageDescription(e.target.value)}
            className="mt-2"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            handleAddImage(selectedAlbum, imageFile, imageDescription);
            setImageDialogOpen(false);
            setImageFile(null);
            setImageDescription("");
          }}>Upload</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="md" fullWidth>
            <DialogContent className="flex flex-col items-center justify-center">
                {images.length > 0 && (
                <img 
                    src={images[currentImageIndex].image}
                    alt="Enlarged"
                    className="max-h-[70vh] object-contain"
                />
                )}
                <div className="flex justify-between w-full mt-4">
                <Button 
                    onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                >
                    ← Previous
                </Button>
                <Button 
                    onClick={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                >
                    Next →
                </Button>
                </div>
            </DialogContent>
        </Dialog>

    </div>
  );
};

export default AlbumGrid;
