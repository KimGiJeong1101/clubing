import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BrushIcon from '@mui/icons-material/Brush';
import ScubaDivingIcon from '@mui/icons-material/ScubaDiving';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import StarIcon from '@mui/icons-material/Star';
import FlightIcon from '@mui/icons-material/Flight';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SavingsIcon from '@mui/icons-material/Savings';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import club from '../../data/Club.js';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const Clubs = () => {
  const getClubList = async () => {
    const response = await fetch("http://localhost:4000/clubs");
    const data = await response.json();
    return data;
  };
  const { data: clubList, error, isLoading, isError } = useQuery({
    queryKey: ['clubList'],
    queryFn: getClubList,
  });

  const [value, setValue] = useState(0);
  const [list, setList] = useState(club);

  const handleChange = (event, newValue) => {

    let copy = [];
    for (let i = 0; i < club.length; i++) {
      if (club[i].detailTag == value) {
        copy.push(club[i]);
        setList(copy);
      }
    }
    setValue(newValue);
  };

  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Box sx={{ width: '100%', backgroundColor: '#F0EDED' }} >
      {/* 글작성 버튼 */}
      <Fab
        onClick={() => {
          navigate('/clubs/create');
        }}
        color="primary"
        aria-label="add"
        style={{
          position: 'fixed',
          bottom: '50px',
          right: '50px',
        }}
      >
        <AddIcon />
      </Fab>
      {/* 모달창 버튼.end */}

      <Box
        sx={{
          width: '100%',
          height: '580px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          backgroundColor: 'white'
        }}
      >
        <Box sx={{ marginTop: '60px' }}>
          <Typography variant="h5" sx={{ margin: '10px', color: '#1c8a6a', fontWeight: '700' }}>
            <AutoAwesomeIcon sx={{ marginBottom: '4px' }} /> 클럽
          </Typography>
        </Box>

        <Typography variant="h3" sx={{ margin: '5px', fontWeight: '900', fontFamily: 'Pretendard', letterSpacing: '-.3rem' }}>
          지속형 모임으로
        </Typography>
        <Typography variant="h3" sx={{ margin: '5px', fontWeight: '900', fontFamily: 'Pretendard', letterSpacing: '-.3rem' }}>
          계속해서 친하게 지내요
        </Typography>

        <Typography variant="h5" sx={{ marginTop: '30px', fontFamily: 'Pretendard', letterSpacing: '-.1rem' }}>
          나와 같은 관심사를 가진 친구들과
        </Typography>
        <Typography variant="h5" sx={{ marginBottom: '150px', fontFamily: 'Pretendard', letterSpacing: '-.1rem' }}>
          매일 함께하고 싶다면 클럽에서 만나요!
        </Typography>
        {/* 게시글들 분류 텝 */}

        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
          sx={{
            '& .MuiTab-root': {
              fontWeight: '700',
              fontSize: '1.1rem',
              textAlign: 'center',
              color: 'black'
            },
          }}
        >
          <Tab
            icon={<BrushIcon sx={{ color: 'green' }} />}
            label="문화·예술" />
          <Tab icon={<ScubaDivingIcon sx={{ color: 'blue' }} />} label="액티비티" />
          <Tab icon={<FastfoodIcon sx={{ color: '#B2561A' }} />} label="푸드·드링크" />
          <Tab icon={<StarIcon sx={{ color: 'yellow' }} />} label="취미" />
          <Tab icon={<FlightIcon sx={{ color: 'skyblue' }} />} label="여행·동행" />
          <Tab icon={<MenuBookIcon sx={{ color: 'brown' }} />} label="자기계발" />
          <Tab icon={<Diversity3Icon sx={{ color: '#D6B095' }} />} label="동네·또래" />
          <Tab icon={<CelebrationIcon sx={{ color: '#B855B9' }} />} label="파티·게임" />
          <Tab icon={<SavingsIcon sx={{ color: '#F47378' }} />} label="재테크" />
          <Tab icon={<CastForEducationIcon />} label="외국어" />
          <Tab icon={<FavoriteOutlinedIcon sx={{ color: 'red' }} />} label="연애·사랑" />
        </Tabs>
        {/* 게시글들 분류 텝.end */}
      </Box>
      <Container maxWidth="lg" sx={{ marginTop: '40px', paddingBottom: '40px' }}>
        <Grid container spacing={2}>
          {/* 반복되는 구간 (하나하나의 게시물들) */}
          {////////////////////////////클럽 게시글들 목록 //////////////////////////
            list.map((a, i) => {
              return (
                <Grid item xs={12} sm={12} md={6} sx={{ height: '200px', marginBottom: '30px' }} key={i}>
                  <Paper elevation={2} sx={{ padding: '16px', display: 'flex', borderRadius: '20px' }}>
                    <Grid item xs={12} sm={12} md={4}>
                      <Box
                        sx={{
                          width: '160px',
                          height: '160px',
                          overflow: 'hidden',  // 박스 영역을 넘어서는 이미지 잘리기
                          borderRadius: '20px', // 원하는 경우 둥근 모서리 적용
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f0f0f0', // 박스 배경 색상 (선택 사항)
                        }}
                      >
                        <img
                          src={list[i].src} // 이미지 경로
                          alt="Example"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',  // 박스 크기에 맞게 이미지 잘리기
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                      <Box sx={{
                        color: '#666060',
                        backgroundColor: '#F4F4F4',
                        display: 'inline-flex',
                        borderRadius: '20px',
                        padding: '5px 20px',
                        margin: '10px 0px',
                        fontWeight: '700',
                        fontSize: '18px'
                      }}>{list[i].subTitle}</Box>
                      <Typography variant="h5" sx={{
                        fontWeight: '700',
                        fontSize: '22px',
                        color: '#383535'
                      }}>{list[i].title}</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'left', color: '#9F9E9D', display: 'inline-flex' }}>{list[i].tag} · {list[i].where} ·</Typography>
                      <CommentRoundedIcon sx={{ color: 'green', fontSize: '18px' }} />
                      <Typography variant="h6" sx={{ color: 'green', display: 'inline-flex' }}> {list[i].chat}</Typography>
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',  // 수직 중앙 정렬
                        margin: '10px 0px'
                      }}>
                        <AvatarGroup max={4}>
                          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                        </AvatarGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                          <PeopleRoundedIcon sx={{ fontSize: '18px' }} />
                          <span style={{ marginLeft: '5px' }}>{list[i].member.length}/{list[i].maxMember}</span>
                        </Box>
                      </Box>
                    </Grid>
                  </Paper>
                </Grid>
              )
            })
            ////////////////////////////클럽 게시글들 목록.end //////////////////////////


          }
          {
            clubList.map((a, i) => {
              return (
                <Grid item onClick={() => {
                  navigate(`/clubs/main?clubNumber=${clubList[i]._id}`);
                }} xs={12} sm={12} md={6} sx={{ height: '200px', marginBottom: '30px' }} key={i}>
                  <Paper elevation={2} sx={{ padding: '16px', display: 'flex', borderRadius: '20px' }}>
                    <Grid item xs={12} sm={12} md={4}>
                      <Box
                        sx={{
                          width: '160px',
                          height: '160px',
                          overflow: 'hidden',  // 박스 영역을 넘어서는 이미지 잘리기
                          borderRadius: '20px', // 원하는 경우 둥근 모서리 적용
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f0f0f0', // 박스 배경 색상 (선택 사항)
                        }}
                      >
                        <img
                          src={list[i].src} // 이미지 경로
                          alt="Example"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',  // 박스 크기에 맞게 이미지 잘리기
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                      <Box sx={{
                        color: '#666060',
                        backgroundColor: '#F4F4F4',
                        display: 'inline-flex',
                        borderRadius: '20px',
                        padding: '5px 20px',
                        margin: '10px 0px',
                        fontWeight: '700',
                        fontSize: '18px'
                      }}>{clubList[i].subTitle}</Box>
                      <Typography variant="h5" sx={{
                        fontWeight: '700',
                        fontSize: '22px',
                        color: '#383535',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden', 
                        whiteSpace: 'nowrap'
                      }}>{clubList[i].title}</Typography>
                      <Typography variant="h6" sx={{ textAlign: 'left', color: '#9F9E9D', display: 'inline-flex' }}>{clubList[i].mainCategory} · {clubList[i].region.district
                      } ·</Typography>
                      <CommentRoundedIcon sx={{ color: 'green', fontSize: '18px' }} />
                      <Typography variant="h6" sx={{ color: 'green', display: 'inline-flex' }}> {list[i].chat}</Typography>
                      <Box sx={{
                        display: 'inline-flex',
                        alignItems: 'center',  // 수직 중앙 정렬
                        margin: '10px 0px'
                      }}>
                        <AvatarGroup max={4}>
                          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
                        </AvatarGroup>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                          <PeopleRoundedIcon sx={{ fontSize: '18px' }} />
                          <span style={{ marginLeft: '5px' }}>{list[i].member.length}/{clubList[i].maxMember}</span>
                        </Box>
                      </Box>
                    </Grid>
                  </Paper>
                </Grid>
              )
            })
          }
        </Grid>

      </Container>


    </Box>
  )
}

export default Clubs