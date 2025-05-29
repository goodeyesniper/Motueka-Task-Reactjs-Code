import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CloseTaskDialog = ({ open, handleClose, handleConfirm }) => {
    
  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="close-task-dialog" disableEnforceFocus={true}>
      <DialogTitle id="close-task-dialog">
        Warning
        {/* X button to close the dialog */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          ⚠️ This is irreversible! Make sure the task has been completed before proceeding.
        </Typography>
        <Typography mt={2}>Are you sure you want to close this task?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          No
        </Button>
        {/* <Button onClick={() => { handleConfirm(); handleClose(); }} color="primary" autoFocus> */}
        <Button
        onClick={async () => {
            await handleConfirm();
            handleClose();
            window.location.reload();
        }}
        color="primary"
        autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CloseTaskDialog;