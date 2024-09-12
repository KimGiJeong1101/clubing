import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Avatar, Button } from "@mui/material";
import CustomButton from "../../../components/club/CustomButton";
import axiosInstance from "../../../utils/axios";

const MemberModal = ({ open, onClose, members, clubNumber }) => {
  console.log(`members`);
  console.log(members);
  const deleteMemberInClub = async (nickName) => {
    const response = await axiosInstance.post(`/clubs/deleteMember/${nickName}/${clubNumber}`);
    alert("강퇴 완료");
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>회원 정보</DialogTitle>
      <DialogContent>
        {members && members.length > 0 ? (
          members.map((member, index) => (
            <Grid
              container
              spacing={2}
              sx={{
                padding: "10px",
                marginBottom: "10px",
                width: "500px",
                cursor: "pointer", // 마우스 포인터를 손가락 모양으로 변경
                transition: "all 0.3s ease", // 부드러운 전환 효과
                "&:hover": {
                  transform: "scale(1.03)", // 호버 시 살짝 확대
                },
              }}
              key={index}
            >
              <Grid item xs={2}>
                <Avatar sx={{ width: 50, height: 50 }} src={member?.thumbnailImage || ""} />
              </Grid>
              <Grid item xs={4} sx={{ marginTop: "8px" }}>
                <Typography variant="h6">{member.name}</Typography>
              </Grid>
              <Grid item xs={6} sx={{ marginTop: "8px", display: "flex", justifyContent: "flex-end" }}>
                {index !== 0 && (
                  <CustomButton
                    variant="contained"
                    onClick={() => {
                      deleteMemberInClub(member.nickName);
                    }}
                    sx={{ color: "white", backgroundColor: "#DBC7B5", borderRadius: "10px" }}
                  >
                    추방하기
                  </CustomButton>
                )}
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography>멤버 정보가 없습니다.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default MemberModal;
