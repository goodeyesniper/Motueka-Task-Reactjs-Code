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
import { useTheme } from './ThemeContext'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: 2,
    bgcolor: '#fff',
    color: '#000',
    boxShadow: 24,
    p: 4,
};

const AssignmentModal = ({ open, onClose, offerAuthors, onAssign }) => {
    const theme = useTheme();
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Assign Task</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography variant="h7" sx={{ mt: 1 }}>Select a user to assign:</Typography>

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
                                    className='custom-btn-container custom-btn'
                                >
                                    Assign
                                </Button>
                            }
                        >
                            <ListItemText 
                                primary={author.full_name || author.username}
                                primaryTypographyProps={{ fontSize: '1.0rem', fontWeight: '800' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Modal>
    );
};

export default AssignmentModal;
