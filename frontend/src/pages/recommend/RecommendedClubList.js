import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, Tooltip, IconButton, Snackbar,CircularProgress } from "@mui/material";
import ClubListCard from "../../components/club/ClubListCard.js";
import { useSelector } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

// 클럽 정보를 가져오는 함수
const fetchClubs = async ({ pageParam = 1, email, filters }) => {
  const response = await axios.get(`http://localhost:4000/clubs/recommend/scroll/${pageParam}`, {
    params: {
      email,
      homeLocation: filters.homeLocation,
      interestLocation: filters.interestLocation,
      workplace: filters.workplace,
      category: filters.userCategory,
      job: filters.job,
    },
  });
  return response.data;
};

const ClubsList = () => {
  const email = useSelector((state) => state.user?.userData?.user?.email || null);
  const initialInterestLocation = useSelector(state => state.user?.userData?.user?.interestLocation || {});
  const initialHomeLocation = useSelector(state => state.user?.userData?.user?.homeLocation || {});
  const initialWorkplace = useSelector(state => state.user?.userData?.user?.workplace || {});
  const initialUserCategory = useSelector(state => state.user?.userData?.user?.category || []);
  const initialJob = useSelector(state => state.user?.userData?.user?.job || []);

  // 필터 상태 관리
  const [filters, setFilters] = useState({
    interestLocation: initialInterestLocation,
    homeLocation: initialHomeLocation,
    workplace: initialWorkplace,
    userCategory: Array.isArray(initialUserCategory) ? initialUserCategory : [],
    job: Array.isArray(initialJob) ? initialJob : [],
  });

  // 스낵바 상태 관리
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // 클럽 목록 가져오기  (로딩중 화면 바꿔놓기// isfetching// 프론트 )
  const {
    data: clubList = [],
    error,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["clubList", email, filters],
    queryFn: ({ pageParam = 1 }) => fetchClubs({ pageParam, email, filters }),
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
    keepPreviousData: true,
  });

  // 필터 삭제 함수
  const handleDeleteFilter = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (Array.isArray(updatedFilters[filterType])) {
        const updatedArray = updatedFilters[filterType].filter(item => item !== value);

        if (filterType === 'userCategory' && updatedArray.length === 0) {
          setSnackbar({ open: true, message: '관심 정보가 1개 이상 있어야 합니다.' });
          return prevFilters;
        }

        updatedFilters[filterType] = updatedArray;
      } else {
        updatedFilters[filterType] = null;
      }
      return updatedFilters;
    });
  };
  
  //지역정보 필터 삭제
  const handleDeleteLocationFilter = (filterType) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (updatedFilters[filterType]) {
        const areTwoLocationFiltersEmpty =
          (!updatedFilters.homeLocation ? 1 : 0) +
          (!updatedFilters.interestLocation ? 1 : 0) +
          (!updatedFilters.workplace ? 1 : 0) >= 2;
  
        if (areTwoLocationFiltersEmpty) {
          setSnackbar({ open: true, message: '지역 정보가 1개 이상 있어야 합니다.' });
          return prevFilters; // 필터 업데이트 하지 않음
        }
  
        updatedFilters[filterType] = null; // 또는 삭제하는 로직 추가
      }
      return updatedFilters;
    });
  };

  // 스낵바 닫기 함수
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 스크롤 이벤트 추가
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasNextPage) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [fetchNextPage, hasNextPage]);

  // 로딩 및 에러 처리
  if (isLoading) return 
  <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  }}
>
  <CircularProgress />
</Box>;
  if (isError) return <div>Error: {error.message}</div>;

  // 툴팁 텍스트
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

        <Container maxWidth="lg" sx={{ paddingBottom: "40px" }}>
          {email && (
            <Grid container spacing={2} sx={{ display: "flex" }}>
              <Grid item xs={12}>
                <Box sx={{ mb: 4, backgroundColor: "#fff", padding: "10px 20px", borderRadius: "20px", boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)", opacity: "0.8" }}>
                  <Typography variant="body1">지역 정보</Typography>
                  <Box sx={{ display: "flex" }}>
                    {filters.interestLocation && (
                      <Grid item xs={12}>
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                          <Typography variant={"h6"} style={{
                            backgroundColor: "#fff",
                            padding: "10px 20px",
                            borderRadius: "20px",
                            color: "#A6836F",
                            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                            position: "relative",
                            opacity: "0.8",
                          }}>
                            <Typography variant="body2">관심 지역: {filters.interestLocation.neighborhood}</Typography>
                            <Box style={{
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
                            }}>
                              <DeleteForeverIcon sx={{ paddingTop: "2px" }} onClick={() => handleDeleteLocationFilter('interestLocation')} />
                            </Box>
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {filters.homeLocation && (
                      <Grid item xs={12}>
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                          <Typography variant={"h6"} style={{
                            backgroundColor: "#fff",
                            padding: "10px 20px",
                            borderRadius: "20px",
                            color: "#A6836F",
                            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                            position: "relative",
                            opacity: "0.8",
                          }}>
                            <Typography variant="body2">거주 지역: {filters.homeLocation.neighborhood}</Typography>
                            <Box style={{
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
                            }}>
                              <DeleteForeverIcon sx={{ paddingTop: "2px" }} onClick={() => handleDeleteLocationFilter('homeLocation')} />
                            </Box>
                          </Typography>
                        </Box>
                      </Grid>
                    )}

                    {filters.workplace && (
                      <Grid item xs={12}>
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                          <Typography variant={"h6"} style={{
                            backgroundColor: "#fff",
                            padding: "10px 20px",
                            borderRadius: "20px",
                            color: "#A6836F",
                            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                            position: "relative",
                            opacity: "0.8",
                          }}>
                            <Typography variant="body2">직장: {filters.workplace.neighborhood}</Typography>
                            <Box style={{
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
                            }}>
                              <DeleteForeverIcon sx={{ paddingTop: "2px" }} onClick={() => handleDeleteLocationFilter('workplace')} />
                            </Box>
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Box>

                  {/* 사용자 카테고리 표시 */}
                  <Typography variant="body1">관심정보</Typography>
                  <Box sx={{ display: "flex" }}>
                    {filters.userCategory.map((category, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px", marginLeft: "20px" }}>
                          <Typography variant={"h6"} style={{
                            backgroundColor: "#fff",
                            padding: "10px 20px",
                            borderRadius: "20px",
                            color: "#A6836F",
                            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                            position: "relative",
                            opacity: "0.8",
                          }}>
                            <Typography variant="body2">{category.main}: {category.sub.join(', ')}</Typography>
                            <Box style={{
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
                            }}>
                              <DeleteForeverIcon sx={{ paddingTop: "2px" }} onClick={() => handleDeleteFilter('userCategory', category)} />
                            </Box>
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}

          <Grid container spacing={2} sx={{ display: "flex" }}>
            <ClubListCard clubList={clubList.pages.flat()} />
          </Grid>

          {isLoading && <div>더 로딩 중...</div>}
        </Container>

        {/* 스낵바 컴포넌트 추가 */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbar.message}
        />
      </Container>
    </Box>
  );
};

export default ClubsList;
