// src/components/AssignmentModal.jsx
import React from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const AssignmentModal = ({ open, onClose, offerAuthors, onAssign }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Assign Task</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography sx={{ mt: 2 }}>Select a user to assign:</Typography>

                <List>
                    {offerAuthors.map((author) => (
                        <ListItem
                            key={author.username}
                            secondaryAction={
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        onAssign(author.username);
                                        onClose(); // Close modal after assignment
                                    }}
                                >
                                    Assign
                                </Button>
                            }
                        >
                            <ListItemText primary={author.full_name || author.username} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Modal>
    );
};

export default AssignmentModal;
