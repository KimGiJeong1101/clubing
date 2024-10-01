//정보 출력만 하는 중
import React from "react";
import { Box, Container, Grid, Typography, Tooltip, IconButton } from "@mui/material";
import ClubListCard from "../../components/club/ClubListCard.js";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useEffect } from "react";


const fetchClubs = async ({ pageParam = 1, email }) => {
  const response = await axios.get(`http://localhost:4000/clubs/recommend/scroll/${pageParam}`, {
    params: { email },
  });
  return response.data;
};

const ClubsList = () => {
  const email = useSelector((state) => state.user?.userData?.user?.email || null);
  const interestLocation = useSelector(state => state.user?.userData?.user?.interestLocation?.neighborhood || null);
  const homeLocation = useSelector(state => state.user?.userData?.user?.homeLocation?.neighborhood || null);
  const workplace = useSelector(state => state.user?.userData?.user?.workplace?.neighborhood || null);
  const userCategory = useSelector(state => state.user?.userData?.user?.category || null);
  const job = useSelector(state => state.user?.userData?.user?.job || null);

  console.log("userCategory: ", userCategory)
  console.log("job: ", job)

  const {
    data: clubList = [],
    error,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["clubList", email],
    queryFn: ({ pageParam = 1 }) => fetchClubs({ pageParam, email }),
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
    keepPreviousData: true,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, loadMore]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const tooltipText = email
    ? `선택한 지역 및 관심사 기준으로 추천해드립니다.  
       지역 및 관심사 변경은
       마이페이지-회원정보-정보수정 에서 가능합니다.`
    : `선택한 지역 및 관심사 기준으로 추천해드립니다. 로그인 시 정확한 추천 정보를 받을 수 있습니다.`;

  return (
    <Box sx={{ width: "100%", paddingTop: "20px", backgroundColor: "#F2F2F2", position: "relative" }}>
      <Container maxWidth="lg" sx={{ paddingBottom: "40px" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Typography variant="h5">정보기반 추천</Typography>

          <Tooltip
            title={tooltipText}
            arrow
            sx={{
              "& .MuiTooltip-tooltip": {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                fontSize: "0.75rem",
                borderRadius: "4px",
              },
            }}
          >
            <IconButton sx={{ color: "gray", fontSize: "1.5rem" }}>
              <InfoOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 회원의 지역, 직업, 선호 카테고리 표시 */}
        <Container maxWidth="lg" sx={{ marginTop: "40px", paddingBottom: "40px" }}>
        <Grid container spacing={2} sx={{ display: "flex" }}>

          {/* 회원 정보 박스 추가 */}
          <Grid item xs={12}>
            <Box sx={{ mb: 4, backgroundColor: "#fff", padding: "10px 20px", borderRadius: "20px", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", opacity: "0.8" }}>
              <Typography variant="h6">지역 정보</Typography>

              <Box sx={{ display: "flex" }}>
              {interestLocation && (
                <Grid item xs={12}>
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                  <Typography
                    variant={"h6"}
                    style={{
                      backgroundColor: "#fff",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      color: "#A6836F",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      opacity: "0.8",
                    }}
                  >
                    <Typography>관심 지역: {interestLocation}</Typography>
                    <Box
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#A6836F",
                        borderRadius: "15px",
                        color: "#ffffff",
                        fontSize: "12px",
                        opacity: "0.9",
                        transition: "opacity 0.3s ease",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        zIndex: "1",
                        margin: "0",
                        padding: "0",
                        textAlign: "center",
                      }}
                      onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    >
                      <DeleteForeverIcon sx={{ paddingTop: "2px" }} />
                    </Box>
                  </Typography>
                </Box>
                </Grid>        
              )}

              {interestLocation && (
                <Grid item xs={12}>
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                  <Typography
                    variant={"h6"}
                    style={{
                      backgroundColor: "#fff",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      color: "#A6836F",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      opacity: "0.8",
                    }}
                  >
                    <Typography>거주 지역: {homeLocation}</Typography>
                    <Box
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#A6836F",
                        borderRadius: "15px",
                        color: "#ffffff",
                        fontSize: "12px",
                        opacity: "0.9",
                        transition: "opacity 0.3s ease",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        zIndex: "1",
                        margin: "0",
                        padding: "0",
                        textAlign: "center",
                      }}
                      onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    >
                      <DeleteForeverIcon sx={{ paddingTop: "2px" }} />
                    </Box>
                  </Typography>
                </Box>
                </Grid>        
              )}
              {homeLocation && (
                <Grid item xs={12}>
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                  <Typography
                    variant={"h6"}
                    style={{
                      backgroundColor: "#fff",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      color: "#A6836F",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      opacity: "0.8",
                    }}
                  >
                      <Typography>직장: {workplace}</Typography>
                    <Box
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#A6836F",
                        borderRadius: "15px",
                        color: "#ffffff",
                        fontSize: "12px",
                        opacity: "0.9",
                        transition: "opacity 0.3s ease",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        zIndex: "1",
                        margin: "0",
                        padding: "0",
                        textAlign: "center",
                      }}
                      onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    >
                      <DeleteForeverIcon sx={{ paddingTop: "2px" }} />
                    </Box>
                  </Typography>
                </Box>
                </Grid>   
              )}
              </Box>

              <Typography variant="h6">관심정보</Typography>
              <Box sx={{ display: "flex" }}>


              {userCategory && userCategory.map((category) => (
                <Grid item xs={12}>
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                  <Typography
                    variant={"h6"}
                    style={{
                      backgroundColor: "#fff",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      color: "#A6836F",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      opacity: "0.8",
                    }}
                  >
                    <Typography key={category._id}>{category.main}: {category.sub}</Typography>
                    <Box
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#A6836F",
                        borderRadius: "15px",
                        color: "#ffffff",
                        fontSize: "12px",
                        opacity: "0.9",
                        transition: "opacity 0.3s ease",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        zIndex: "1",
                        margin: "0",
                        padding: "0",
                        textAlign: "center",
                      }}
                      onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    >
                      <DeleteForeverIcon sx={{ paddingTop: "2px" }} />
                    </Box>
                  </Typography>
                </Box>
                </Grid>   
              ))}


              {job && job.map((j) => (
                <Grid item xs={12}>
                <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                  <Typography
                    variant={"h6"}
                    style={{
                      backgroundColor: "#fff",
                      padding: "10px 20px",
                      borderRadius: "20px",
                      color: "#A6836F",
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      opacity: "0.8",
                    }}
                  >
                    <Typography key={j}>직업:{j}</Typography>
                    <Box
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        width: "30px",
                        height: "30px",
                        backgroundColor: "#A6836F",
                        borderRadius: "15px",
                        color: "#ffffff",
                        fontSize: "12px",
                        opacity: "0.9",
                        transition: "opacity 0.3s ease",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        zIndex: "1",
                        margin: "0",
                        padding: "0",
                        textAlign: "center",
                      }}
                      onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    >
                      <DeleteForeverIcon sx={{ paddingTop: "2px" }} />
                    </Box>
                  </Typography>
                </Box>
                </Grid>   
              ))}


              {/* <Box sx={{ display: "flex" }}>
                {userCategory && userCategory.map((category) => (
                  <Typography key={category._id}>
                    {category.main}: {category.sub.join(", ")}
                  </Typography>
                ))}
              </Box>


              <Box>
                {job && job.map((j) => (
                  <Typography key={j}>직업:{j}</Typography>
                ))}
              </Box> */}
              </Box>
              
            </Box>
          </Grid>
        </Grid>
        
      </Container>

        <Grid container spacing={2} sx={{ display: "flex" }}>
          <ClubListCard clubList={clubList.pages.flat()} />
        </Grid>

        {isLoading && <div>더 로딩 중...</div>}
      </Container>
    </Box>
  );
};

export default ClubsList;
