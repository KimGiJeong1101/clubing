// AlertModal.js
import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const AlertModal = ({
  open,
  handleClose,
  handleConfirm,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
}) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "300px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography id="alert-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="alert-modal-description" sx={{ mt: 2 }}>
          {description}
        </Typography>
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            sx={{ left: cancelText ? 0 : 240 }}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
          {cancelText && (
            <Button variant="outlined" onClick={handleClose}>
              {cancelText}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default AlertModal;
