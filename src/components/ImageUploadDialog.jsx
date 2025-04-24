import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const ImageUploadDialog = ({ open, handleClose, handleImageUpload }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} disableEnforceFocus disableRestoreFocus>
      <DialogTitle>Upload Profile Picture</DialogTitle>
      <DialogContent>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {selectedImage && (
          <div className="mt-2">
            <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="w-32 h-32 rounded-full"/>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">Cancel</Button>
        <Button 
          onClick={() => handleImageUpload(selectedImage)} 
          color="primary" 
          disabled={!selectedImage}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadDialog;