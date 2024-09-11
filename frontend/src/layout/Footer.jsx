import React ,{  useState , useEffect } from "react";

import {  Link, useLocation, useNavigate } from "react-router-dom";
import { IconButton, Container, Tooltip , Box, Grid,Typography,Toolbar  } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        width: '100%',
        height: '75px',
        backgroundColor: '#565903',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        mt: 'auto', // Footer가 자동으로 하단으로 이동
      }}
    >
      <Container maxWidth="xl" sx={{ padding: '0px !important' }}>
        <Grid
          container
          sx={{
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '20px',
          }}
        >
          <Box>
            <img src="/logo/khaki_long.png" alt="Logo" style={{ height: '45px' }} />
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}

export default Footer;
