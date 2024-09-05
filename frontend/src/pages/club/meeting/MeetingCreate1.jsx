import { Box,   Fab, Grid,   Modal, Typography } from "@mui/material";
import BrushIcon from "@mui/icons-material/Brush";
import ScubaDivingIcon from "@mui/icons-material/ScubaDiving";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import StarIcon from "@mui/icons-material/Star";
import FlightIcon from "@mui/icons-material/Flight";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import CelebrationIcon from "@mui/icons-material/Celebration";
import SavingsIcon from "@mui/icons-material/Savings";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import React from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 import
dayjs.locale("ko");

const MeetingCreate1 = ({open, handleCloseModal, FadHandleClick}) => {
  const fadStyle = {
    fontSize: "1.8rem",
    width: "70px",
    height: "70px",
    margin: "15px 0px 10px 0px",
  };

  return (
    <Box>
      <Modal open={open} onClose={handleCloseModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: 430,
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ textAlign: "center" }}>
            관심사 선택
          </Typography>
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="0" onClick={FadHandleClick} sx={fadStyle} style={{ color: "green" }}>
                <BrushIcon />
              </Fab>
            </Grid>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="1" onClick={FadHandleClick} sx={fadStyle} style={{ color: "blue" }}>
                <ScubaDivingIcon />
              </Fab>
            </Grid>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="2" onClick={FadHandleClick} sx={fadStyle} style={{ color: "#B2561A" }}>
                <FastfoodIcon />
              </Fab>
            </Grid>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="3" onClick={FadHandleClick} sx={fadStyle} style={{ color: "yellow" }}>
                <StarIcon />
              </Fab>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ margin: "0px 30px 0px 0xp" }}>
              <Typography sx={{ textAlign: "center" }}>문화·예술</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>액티비티</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>푸드·드링크</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>취미</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="4" onClick={FadHandleClick} sx={fadStyle} style={{ color: "skyblue" }}>
                <FlightIcon />
              </Fab>
            </Grid>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="5" onClick={FadHandleClick} sx={fadStyle} style={{ color: "brown" }}>
                <MenuBookIcon />
              </Fab>
            </Grid>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="6" onClick={FadHandleClick} sx={fadStyle} style={{ color: "#D6B095" }}>
                <Diversity3Icon />
              </Fab>
            </Grid>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="7" onClick={FadHandleClick} sx={fadStyle} style={{ color: "#B855B9" }}>
                <CelebrationIcon />
              </Fab>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ margin: "0px 30px 0px 0xp" }}>
              <Typography sx={{ textAlign: "center" }}>여행·동행</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>자기계발</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>동네·또래</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>파티·게임</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="8" onClick={FadHandleClick} sx={fadStyle} style={{ color: "#F47378" }}>
                <SavingsIcon />
              </Fab>
            </Grid>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="9" onClick={FadHandleClick} sx={fadStyle}>
                <CastForEducationIcon />
              </Fab>
            </Grid>
            <Grid item xs={3} container justifyContent="center" alignItems="center">
              <Fab aria-label="10" onClick={FadHandleClick} sx={fadStyle} style={{ color: "red" }}>
                <FavoriteOutlinedIcon />
              </Fab>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={3} sx={{ margin: "0px 30px 0px 0xp" }}>
              <Typography sx={{ textAlign: "center" }}>재테크</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>외국어</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ textAlign: "center" }}>연애·사랑</Typography>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
};

export default MeetingCreate1;
