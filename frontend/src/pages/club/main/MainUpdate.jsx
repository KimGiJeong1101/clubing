import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material'
import { MuiFileInput } from 'mui-file-input'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const MainUpdate = () => {

  //Clubmember=3 이란 거 가져오기 위해서!
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clubNumber = queryParams.get('clubNumber');

  const [region,setRegion] = useState('');
  const getReadClub = async () => {
    const response = await fetch(`http://localhost:4000/clubs/read2/${clubNumber}`);
    const data = await response.json();
    if (data.region) {
      data.region = data.region.city + ' '+data.region.district+ ' '+data.region.neighborhood;
      console.log(data);
      console.log(data.region.type);
      setRegion(data.region);
      data.region = region;
      return data;
    }
    return data;
  };
  const { data: readClub, error, isLoading, isError } = useQuery({
    queryKey: ['readClub'],
    queryFn: getReadClub,
  });
  //파일
  const [locationImg, setLocationImg] = useState(null)
  const handleLocationImgChange = locationImg => {
    setLocationImg(locationImg)
    console.log(locationImg);
  }
  //파일.end

  const navigate = useNavigate();
  const { register,
    handleSubmit,
    formState: { errors },
    reset }
     = useForm({ defaultValues: readClub,  mode: 'onChange' })


  const onSubmit = (data) => {
    console.log(data);

    axios.post(`http://localhost:4000/clubs/update/${clubNumber}`,data)
      .then(response => {
        console.log(response.data);
        alert('모임 수정 성공')
        navigate(`/clubs/main?clubNumber=${clubNumber}`) 
      })
      .catch(err => {
        console.log(err);
        alert('모임 수정 실패')
      });

  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  return (

    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}>
      <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: '600', padding: '10px', marginTop: '10px' }}>모임수정</Typography>
      <Container
        maxWidth='md'
        sx={{ marginTop: '20px' }}>
        <Grid container spacing={1} sx={{ alignItems: 'center' }}>
          <Grid xs={3} sx={{ padding: '0px' }} >
            <Typography sx={{ fontWeight: '600', padding: '0px' }}>지역</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              InputProps={{
                readOnly: true,
              }}
              id="region"
              label="동,읍,면 찾기"
              placeholder='눌럿을 때 찾기 띄우기'
              sx={{ width: '100%', mb: 2 }}
              {...register('region', { required: ' 필수입력 요소.' })}
            />
          </Grid>
          <Grid xs={3} sx={{ padding: '0px' }} >
            <Typography sx={{ fontWeight: '600', padding: '0px' }}>큰 관심사</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              id="mainCategory"
              label="ex ) 큰 관심사 : 운동,여행,사교 등등"
              placeholder='눌럿을 때 모달띄워서 큰관심 선택 후 작은관심선택 후 자동기입까지'
              sx={{ width: '100%', mb: 2 }}
              {...register('mainCategory', { required: ' 필수입력 요소.' })}
            />
          </Grid>
          <Grid xs={3} sx={{ padding: '0px' }} >
            <Typography sx={{ fontWeight: '600', padding: '0px' }}>상세 관심사</Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              id="subCategory"
              label="상세관심사 : 자전거/야구/서핑/웨이크보드/요트 등등(최대3개)"
              sx={{ width: '100%', mb: 2 }}
              {...register('subCategory', { required: ' 필수입력 요소.' })}
            />
          </Grid>
          <Grid xs={12}>
            <MuiFileInput
              id='img'
              inputProps={{ accept: "image/png, image/gif, image/jpeg" }}
              value={locationImg}
              onChange={handleLocationImgChange}
              multiple
              size="small"
              fullWidth
              placeholder='여기를 클릭해 모임 대표사진을 설정해보세요'
              sx={{
                width: '100%', height: '200px',
                '& .MuiInputBase-root': { width: '100%', height: '200px' }
                ,
                marginBottom: '20px',
                '& input': {
                  width: '100%',
                  height: '200px'
                },
                
              }
            }
            />
          </Grid>
          <Grid xs={8}>
            <TextField
              id="title"
              label="모임 이름"
              multiline
              sx={{ width: '100%', mb: 2 }}
              {...register('title', { required: ' 필수입력 요소.' })}
            />
            </Grid>
            <Grid xs={3} sx={{marginLeft : '70px'}}>
            <TextField
              id="subTitle"
              label="서브 타이틀 ex)카페,친구,운동"
              multiline
              sx={{ width: '100%', mb: 2 }}
              {...register('subTitle', { required: ' 필수입력 요소.' })}
            />
          </Grid>
          <Grid xs={12}>
            <TextField
              id="content"
              label="내용 입력"
              multiline
              rows={10} // 텍스트 영역의 기본 행 수
              variant="outlined" // 텍스트 필드의 스타일 (outlined, filled, standard)
              sx={{ width: '100%', mb: 2 }} // 스타일 설정 (예: 너비, 마진)
              {...register('content', { required: ' 필수입력 요소.' })}
            />
          </Grid>
          <Grid xs={2} >
            <Typography sx={{ fontWeight: '600' }}>정원 (10~300명)</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="maxMember"
              label="숫자만 입력"
              inputProps={{ type: 'number', min: 10, max: 300 }}
              sx={{ width: '100%' }}
              {...register('maxMember', { required: ' 필수입력 요소.' })}
            />
          </Grid>
          <Grid xs={12} sx={{ marginTop: '20px' }}>
            <Button variant="outlined" sx={{ width: '100%' }} type='submit'>모임 만들기</Button>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}

export default MainUpdate