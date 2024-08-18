import React, { useState, useEffect } from 'react';
import {ListItemText, ListItem, List, TextField, Box} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';

const InterestSearch = ({ setInterestSido, setInterestSigoon, setInterestDong }) => {
  const [interestResults, setInterestResults] = useState([]);
  const { formState: { errors }, register, setValue, watch } = useForm();

  const interestSearchTerm = watch('interestSearchTerm');
  const port = process.env.REACT_APP_ADDRESS_API;

  useEffect(() => {
    if (interestSearchTerm) {
      fetch(`api/req/data?service=data&request=GetFeature&data=LT_C_ADEMD_INFO&key=286E5CAE-A8D1-3D02-AB4E-2DF927614303&domain=${port}&attrFilter=emd_kor_nm:like:${interestSearchTerm}`)
        .then(response => response.json())
        .then(data => {
          if (data.response && data.response.status === 'OK' && data.response.result && data.response.result.featureCollection.features) {
            setInterestResults(data.response.result.featureCollection.features.map(item => item.properties));
          } else {
            setInterestResults([]);
            //console.error('Invalid API response:', data);
          }
        })
        .catch(error => {
          setInterestResults([]);
          //console.error('Error fetching data:', error);
        });
    } else {
      setInterestResults([]);
    }
  }, [interestSearchTerm]);

  const handleInterestSelect = (item) => {
    const [i_sido, i_sigoon, i_dong] = item.full_nm.split(' ');
    setInterestSido(i_sido);
    setInterestSigoon(i_sigoon);
    setInterestDong(i_dong);
    setInterestResults([]);
    setValue('interestSearchTerm', item.full_nm);
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (interestResults.length > 0) {
        handleInterestSelect(interestResults[0]);
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
        id="interestSearchTerm"
        type="text"
        fullWidth
        variant="outlined"
        margin="normal"
        {...register('interestSearchTerm', {
          pattern: {
            value: /^[가-힣\s]*$/,
            message: "한글만 입력 가능합니다."
          }
        })}
        onKeyDown={handleInterestKeyDown} 
        onChange={(e) => {
          setValue('interestSearchTerm', e.target.value, { shouldValidate: true }); // 변경된 값을 즉시 검증하도록 설정합니다
        }}
        placeholder='*읍면동 중 하나 입력해주세요 예) 강화읍'
        error={!!errors.interestSearchTerm} // 수정: errors.searchTerm을 직접 사용하여 에러 상태를 표시합니다.
        helperText={errors.interestSearchTerm ? errors.interestSearchTerm.message : ''} // 수정: errors.searchTerm 메시지를 helperText로 표시합니다.
      />
     <List sx={{ mt: -1, pt: 0, pb: 0 }}>
        {interestResults.map((item, index) => (
        <StyledListItem 
          key={index} 
          onClick={() => handleInterestSelect(item)}>
            <ListItemText primary={item.full_nm} />
          </StyledListItem>
        ))}
      </List>
    </Box>
  );
};
export default InterestSearch;
