import React, { useState, useEffect } from 'react';
import {ListItemText, ListItem, List, TextField, Box} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

const HomeSearch = ({ setSelectedSido, setSelectedSigoon, setSelectedDong }) => {
  const [results, setResults] = useState([]);
  const { formState: { errors }, register, setValue, watch } = useForm();

  // Redux에서 user 데이터를 가져옵니다
  const { user } = useSelector((state) => state.user?.userData || {});

  // workplace 데이터를 가져옵니다
  const homeLocation = user?.homeLocation || { city: '', district: '', neighborhood: '' };

   // 초기 렌더링 시, workplace 데이터를 검색 필드에 반영합니다
   useEffect(() => {
    if (homeLocation.neighborhood) {
      setValue('searchTerm', homeLocation.neighborhood);
    }
  }, [homeLocation.neighborhood, setValue]);

  const searchTerm = watch('searchTerm'); // watch로 searchTerm의 값을 실시간으로 가져옵니다.
  const port = process.env.REACT_APP_ADDRESS_API;

  useEffect(() => {
    if (searchTerm) {
      fetch(`/api/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=286E5CAE-A8D1-3D02-AB4E-2DF927614303&domain=${port}&attrFilter=emd_kor_nm:like:${searchTerm}`)
        .then(response => response.json())
        .then(data => {
          if (data.response && data.response.status === 'OK' && data.response.result && data.response.result.featureCollection.features) {
            setResults(data.response.result.featureCollection.features.map(item => item.properties));
          } else {
            setResults([]);
           // console.error('Invalid API response:', data);
          }
        })
        .catch(error => {
          setResults([]);
        // console.error('Error fetching data:', error);
        });
    } else {
      setResults([]);
    }
  }, [searchTerm]); // searchTerm이 변경될 때마다 호출됩니다.

  const handleSelect = (item) => {
    const [sido, sigoon, dong] = item.full_nm.split(' ');
    setSelectedSido(sido);
    setSelectedSigoon(sigoon);
    setSelectedDong(dong);
    setResults([]);
    setValue('searchTerm', item.full_nm); 
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (results.length > 0) {
        handleSelect(results[0]);
      }
    }
  };

  const StyledListItem = styled(ListItem)(({ theme }) => ({
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    cursor: 'pointer',
  }));

  return (
<Box sx={{ width: '100%' }}>
      <TextField
        id="searchTerm"
        type="text"
        fullWidth
        variant="outlined"
        margin="normal"
        {...register('searchTerm', {
          pattern: {
            value: /^[가-힣\s]*$/,
            message: "한글만 입력 가능합니다."
          }
        })}
        onKeyDown={handleKeyDown} // Enter 키 처리
        onChange={(e) => {
          setValue('searchTerm', e.target.value, { shouldValidate: true }); // 변경된 값을 즉시 검증하도록 설정합니다
        }}
        placeholder="*읍면동 중 하나 입력해주세요 예) 상도동"
        sx={{
          bgcolor: 'white',
        }}
        error={!!errors.searchTerm} // 수정: errors.searchTerm을 직접 사용하여 에러 상태를 표시합니다.
        helperText={errors.searchTerm ? errors.searchTerm.message : ''} // 수정: errors.searchTerm 메시지를 helperText로 표시합니다.
      />
     <List sx={{ mt: -1, pt: 0, pb: 0 }}>
        {results.map((item, index) => (
          <StyledListItem
            key={index}
            onClick={() => handleSelect(item)} // 클릭 시 항목 선택
          >
            <ListItemText primary={item.full_nm} />
          </StyledListItem>
        ))}
      </List>
    </Box>
  );
};
export default HomeSearch;
