import React, { useState } from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import club from "../../data/Club.js";
import { useNavigate } from "react-router-dom";

const ClubCard = ({ clubList }) => {
  const [list, setList] = useState(club);

  const navigate = useNavigate();

  return (
    <Box
    >
      <Grid container spacing={3}>
        {clubList.map((club, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={8}
            key={club._id}
            sx={{
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
              },
            }}
          >
            <Paper
              elevation={3}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                cursor: "pointer",
                transition: "box-shadow 0.3s ease",
                backgroundColor: "white",
              }}
              onClick={() => navigate(`/clubs/main?clubNumber=${club._id}`)}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "300px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <img
                  src={`http://localhost:4000/` + club.img}
                  alt={club.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px 12px 0 0",
                  }}
                />
                {/* 메인 카테고리 */}
                <Box
                  sx={{
                    position: "absolute",
                    backgroundColor: "#ffffff",
                    padding: "8px",
                    borderRadius: "12px",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "#3f51b5", fontWeight: "bold" }}>
                    {club.mainCategory}
                  </Typography>
                </Box>
                {/* 메인 카테고리.end */}
              </Box>
              {/* 클럽 */}
              <Box
                sx={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  height: "230px",
                }}
              >
                {/* 클럽 제목 */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "700",
                    fontSize: "20px",
                    color: "#383535",
                    marginBottom: "8px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {club.title}
                </Typography>
                {/* 클럽 제목.end */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "500",
                    fontSize: "18px",
                    color: "#777777",
                    marginBottom: "8px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                >
                  {club.subTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9F9E9D",
                    marginBottom: "8px",
                  }}
                >
                  {club.region.district}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CommentRoundedIcon sx={{ color: "#BF5B16", fontSize: "18px" }} />
                  <Typography variant="body2" sx={{ color: "#BF5B16", marginLeft: "5px" }}>
                    {list[index].chat}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "auto",
                    borderTop: "1px solid #e0e0e0",
                    paddingTop: "8px",
                    paddingBottom: "8px",
                  }}
                >
                  <AvatarGroup max={4}>
                    {club.members.map((member, idx) => (
                      <Avatar key={idx} alt={`Member ${idx + 1}`} src={member.img} sx={{ width: 32, height: 32 }} />
                    ))}
                  </AvatarGroup>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "8px",
                      fontSize: "14px",
                      color: "#666666",
                    }}
                  >
                    <PeopleRoundedIcon sx={{ fontSize: "18px" }} />
                    <span style={{ marginLeft: "5px" }}>
                      {club.members.length}/{club.maxMember}
                    </span>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClubCard;
