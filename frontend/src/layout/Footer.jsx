import React ,{  useState , useEffect } from "react";

import {  Link, useLocation, useNavigate } from "react-router-dom";
import { IconButton, Container, Tooltip , Box, Grid,Typography,Toolbar  } from "@mui/material";

function Footer() {
  return (
    <>
    <Box sx={{ width: "100%", height: "100px" }}>
    <Box
        sx={{
          mt:1,
          width: "100%",
          height: "75px",
          backgroundColor: "white",
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100, // Header와 동일한 z-index로 설정
          transition: "transform 0.3s ease",
        }}
      >
        <Container maxWidth="xl" sx={{ padding: "0px !important" }}>
          <Grid
            container
            sx={{
              alignItems: "left",
              justifyContent: "center",
              textAlign: "center",
              fontSize: "20px",
            }}
          >
            <Box>
              <img src="/logo/khaki_long.png" alt="Logo" style={{ height: '45px' }} />
            </Box>
          </Grid>
        </Container>
      </Box>
    </Box>
    </>

  );
  
}

export default Footer;
