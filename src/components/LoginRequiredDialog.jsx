// src/components/LoginRequiredDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

const LoginRequiredDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="login-required-dialog"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="login-required-dialog">Login Required</DialogTitle>
      <DialogContent>
        <Typography>
          You must be logged in to make a post.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          className="m-2 custom-btn-container custom-btn"
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginRequiredDialog;