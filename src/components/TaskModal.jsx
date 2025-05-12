import React, { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, TextField, Box, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import { useMediaQuery } from '@mui/material';
import { useNavigate } from "react-router-dom";

const TaskModal = ({ onClose, onTaskAdded }) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)'); // Detect small screens
  const [page, setPage] = useState(1);
  const [formValues, setFormValues] = useState({
    taskTitle: "",
    taskDetails: "",
    address: "",
    date: "",
    timeFrom: "",
    timeTo: "",
    budgetOption: "", // For "Not sure" or "Approx"
    budgetValue: "", // For numerical budget
  });

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false); // Tracks the submission state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false); // For confirmation dialog
  const [successOpen, setSuccessOpen] = useState(false); // For success message

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handler for radio button change
  const handleRadioChange = (e) => {
    setFormValues({
      ...formValues,
      budgetOption: e.target.value,
    });
  };

  // Handler for file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setUploadedFile(file);
  };

  // Handler for drag-over event
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  // Handler for drag-leave event
  const handleDragLeave = () => {
    setDragging(false);
  };

  // Handler for drop event
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setUploadedFile(file);
    setDragging(false);
  };

  // Validation for disabling the Next button on Page 1 only
  const isNextDisabled =
    page === 1 &&
    (formValues.taskTitle.trim() === "" || formValues.taskDetails.trim() === "") ||
    (page === 3 &&
        (formValues.address.trim() === "" ||
          formValues.date.trim() === "" ||
          formValues.timeFrom.trim() === "" ||
          formValues.timeTo.trim() === "")) ||
    (page === 4 &&
      formValues.budgetOption === "Approx" &&
      formValues.budgetValue.trim() === "");

  // Handler to move to the next page
  const handleNext = () => {
    if (page < 5) setPage(page + 1);
  };

  // Handler to move to the previous page
  const handleBack = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleCloseConfirmation = () => setConfirmationOpen(false);

  const handleConfirmSubmit = async () => {
    setConfirmationOpen(false);
    if (isSubmitting) return; // Prevent duplicates
    setIsSubmitting(true);    // Lock submission process

    try {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append('task_title', formValues.taskTitle);
        formData.append('task_details', formValues.taskDetails);

        // Optional image upload
        if (uploadedFile) {
          formData.append('image', uploadedFile);
        }

        formData.append('address', formValues.address);
        formData.append('date', formValues.date);
        formData.append('time_from', formValues.timeFrom);
        formData.append('time_to', formValues.timeTo);
        formData.append('budget_option', formValues.budgetOption);
        formData.append('budget_value', formValues.budgetValue || 0);

        const response = await fetch('http://127.0.0.1:8000/api/posts/', {
            method: 'POST',
            headers: {
              Authorization: `Token ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            const newTask = await response.json();
            if (onTaskAdded) {  // Prevents error if undefined
              onTaskAdded(newTask);
            } else {
                console.error("onTaskAdded is not defined in TaskModal props.");
            }
      
            // onTaskAdded(newTask); // Update BrowseTask

            // Reset form values
            setFormValues({
              taskTitle: "",
              taskDetails: "",
              address: "",
              date: "",
              timeFrom: "",
              timeTo: "",
              budgetOption: "",
              budgetValue: "",
            });
            setSuccessOpen(true); // Open success dialog
        } else {
            console.error('Error submitting task:', response.statusText);
        }
    } catch (error) {
        console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false); // Unlock submission
    }
  };


  return (
    <>
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm" fullScreen={isSmallScreen}>
      {/* Custom Dialog Title with Close Button */}
      <DialogTitle>
        Page {page} of 5
        <IconButton onClick={onClose} style={{ position: "absolute", right: 16, top: 16 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Page 1: Task Details */}
        {page === 1 && (
          <Box>
            <h2>What do you need done?</h2>
            <TextField
              fullWidth
              label="Task Title"
              name="taskTitle"
              value={formValues.taskTitle}
              onChange={handleChange}
              inputProps={{ maxLength: 50 }}
              margin="normal"
              required
            />
            <h2 className="pt-4">Details of your task:</h2>
            <TextField
              fullWidth
              label="Task Details"
              name="taskDetails"
              value={formValues.taskDetails}
              onChange={handleChange}
              inputProps={{ maxLength: 2000 }}
              multiline
              rows={4}
              margin="normal"
              required
            />
          </Box>
        )}

        {/* Page 2: Upload Photo */}
        {page === 2 && (
          <Box textAlign="center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <h2>Upload a Photo</h2>
            <p>It will help explain what you need done. (OPTIONAL)</p>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              border="2px dashed #ccc"
              borderRadius="8px"
              padding="20px"
              marginTop="16px"
              style={{ 
                cursor: "pointer", 
                backgroundColor: dragging ? "#f0f8ff" : "transparent",
            }}
            >
              <CloudUploadIcon style={{ fontSize: 50, color: "#999" }} onClick={() => document.getElementById("fileUpload").click()} />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileUpload}
                id="fileUpload"
              />
              <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>
                {uploadedFile
                  ? `File: ${uploadedFile.name}`
                  : "Click to upload or drag and drop"}
              </label>
            </Box>
          </Box>
        )}
        {/* Page 3: Location and Time */}
        {page === 3 && (
          <Box>
            <h2>Where are you located?</h2>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formValues.address}
              onChange={handleChange}
              margin="normal"
              required
            />
            <h2 className="pt-5">When do you need it done?</h2>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={formValues.date}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <h2 className="pt-5 pb-3">Between the hours of:</h2>
            <Box display="flex" gap="10px">
              <TextField
                label="From"
                type="time"
                name="timeFrom"
                value={formValues.timeFrom}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                label="To"
                type="time"
                name="timeTo"
                value={formValues.timeTo}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>
          </Box>
        )}
        {/* Page 4: Budget */}
        {page === 4 && (
          <Box>
            <h2>What is your estimated budget for this task?</h2>
            <FormControl component="fieldset" margin="normal">
              <RadioGroup
                row
                name="budgetOption"
                value={formValues.budgetOption}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="Not sure"
                  control={<Radio />}
                  label="Not sure"
                />
                <FormControlLabel
                  value="Approx"
                  control={<Radio />}
                  label="Approx"
                />
              </RadioGroup>
            </FormControl>
            {formValues.budgetOption === "Approx" && (
              <Box display="flex" alignItems="center" marginTop="16px">
                <span style={{ fontSize: "1.2rem", marginRight: "8px" }}>$</span>
                <TextField
                  type="number"
                  name="budgetValue"
                  value={formValues.budgetValue}
                  onChange={handleChange}
                  InputProps={{ inputProps: { min: 0 } }}
                  placeholder="Enter your budget"
                />
              </Box>
            )}
          </Box>
        )}
        {/* Page 5: Review Your Details */}
        {page === 5 && (
            <Box>
              <h2 className="pb-5 font-bold">Review your details</h2>
              <ul>
                <li>Task Title: {formValues.taskTitle}</li>
                <li>Task Details: {formValues.taskDetails}</li>
                <li>Address: {formValues.address}</li>
                <li>Date: {formValues.date}</li>
                <li>Time: From {formValues.timeFrom} to {formValues.timeTo}</li>
                {/* <li>
                  Budget: {formValues.budgetOption}{" "}
                  {formValues.budgetOption === "Approx" && `$${formValues.budgetValue}`}
                </li> */}
                <li>
                  Budget: {formValues.budgetValue ? `$${formValues.budgetValue}` : "Not sure"}
                </li>


              </ul>
              <IconButton onClick={() => setPage(1)} style={{ marginTop: "20px" }}>
                <EditIcon />
              </IconButton>
            </Box>
        )}
      </DialogContent>

      <Box display="flex" justifyContent="space-between" p={2}>
        <Button onClick={handleBack} disabled={page === 1}>
          Back
        </Button>
        {page === 5 ? (
            <Button
              variant="contained"
              onClick={() => setConfirmationOpen(true)} // Open confirmation dialog
              disabled={isSubmitting}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isNextDisabled}
            >
              Next
            </Button>
          )}
        </Box>
    </Dialog>

      {/* Confirmation Dialog */}
      {confirmationOpen && (
        <Dialog open={confirmationOpen} onClose={handleCloseConfirmation} fullWidth maxWidth="xs">
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to make this post?</p>
          </DialogContent>
          <Box display="flex" justifyContent="space-between" p={2}>
            <Button onClick={handleCloseConfirmation}>No</Button>
            <Button variant="contained" onClick={handleConfirmSubmit}>
              Yes
            </Button>
          </Box>
        </Dialog>
      )}

      {/* Success Message Dialog */}
      {successOpen && (
        <Dialog 
            open={successOpen} 
            onClose={() => {
                setSuccessOpen(false)
                onClose();
                navigate("/browsetask")
            }} 
            fullWidth 
            maxWidth="xs"
        >
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <p>Post has been made. Thank you!</p>
          </DialogContent>
          <Box display="flex" justifyContent="center" p={2}>
            <Button 
                variant="contained" 
                onClick={() => {
                 setSuccessOpen(false);
                 onClose();
                 navigate("/browsetask")
                }}
            >
              Close
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default TaskModal;