return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', mt: 5, maxWidth: 400, mx: 'auto' }}>
      <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" align="center">
          회원가입
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ mb: 2 }}>
            <InputLabel htmlFor="email">이메일</InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                type="email"
                id="email"
                variant="outlined"
                fullWidth
                sx={{ mt: 1, mr: 2 }}
                InputProps={{ readOnly: isEmailChecked }}
                {...register('email')}
              />
              <Button
                variant="contained"
                color={isEmailChecked ? 'success' : 'primary'}
                onClick={isEmailChecked ? () => {} : () => {}}
                disabled={isEmailChecked}
              >
                {isEmailChecked ? '인증하기' : '중복검사'}
              </Button>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
            {message && <Typography color="success">{message}</Typography>}
            {errors.email && <Typography color="error">{errors.email.message}</Typography>}
          </Box>
aaaaaaaaaaaaaaaaaaaaaaaaaaa
          <Box sx={{ mb: 2 }}>
            <InputLabel htmlFor="verification">인증번호</InputLabel>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                type="text"
                id="verification"
                variant="outlined"
                fullWidth
                sx={{ mt: 1, mr: 2 }}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                InputProps={{ readOnly: isVerified }}
              />
              <Button
                variant="contained"
                color={isVerified ? 'default' : 'primary'}
                onClick={() => {}}
                disabled={isVerified}
              >
                {isEmailChecked ? '인증확인' : '인증완료'}
              </Button>
            </Box>
            {error && <Typography color="error">{error}</Typography>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel htmlFor="password">비밀번호</InputLabel>
            <TextField
              type="password"
              id="password"
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              {...register('password')}
            />
            {errors.password && <Typography color="error">{errors.password.message}</Typography>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel htmlFor="passwordCheck">비밀번호 확인</InputLabel>
            <TextField
              type="password"
              id="passwordCheck"
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              {...register('passwordCheck')}
            />
            {errors.passwordCheck && <Typography color="error">{errors.passwordCheck.message}</Typography>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel htmlFor="name">이름</InputLabel>
            <TextField
              type="text"
              id="name"
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              {...register('name', { validate: validateUserName })}
            />
            {errors.name && <Typography color="error">{errors.name.message}</Typography>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel htmlFor="nickName">닉네임</InputLabel>
            <TextField
              type="text"
              id="nickName"
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
              {...register('nickName')}
            />
            {errors.nickname && <Typography color="error">{errors.nickname.message}</Typography>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel htmlFor="age">생년월일</InputLabel>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="year">년</InputLabel>
                <Select
                  id="year"
                  {...register('age.year', { required: '출생년도는 필수입니다.' })}
                >
                  <MenuItem value="">선택</MenuItem>
                  {/* 여기에 years 배열을 사용하여 옵션 추가 */}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="month">월</InputLabel>
                <Select
                  id="month"
                  {...register('age.month', { required: '월은 필수입니다.' })}
                >
                  <MenuItem value="">선택</MenuItem>
                  {/* 여기에 months 배열을 사용하여 옵션 추가 */}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="day">일</InputLabel>
                <Select
                  id="day"
                  {...register('age.day', { required: '일은 필수입니다.' })}
                >
                  <MenuItem value="">선택</MenuItem>
                  {/* 여기에 days 배열을 사용하여 옵션 추가 */}
                </Select>
              </FormControl>
            </Box>
            {errors.age?.year && <Typography color="error">{errors.age.year.message}</Typography>}
            {errors.age?.month && <Typography color="error">{errors.age.month.message}</Typography>}
            {errors.age?.day && <Typography color="error">{errors.age.day.message}</Typography>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <InputLabel>성별</InputLabel>
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Button
                variant="contained"
                color={watch('gender') === '남성' ? 'primary' : 'default'}
                onClick={() => {}}
              >
                남자
              </Button>
              <Button
                variant="contained"
                color={watch('gender') === '여성' ? 'secondary' : 'default'}
                onClick={() => {}}
              >
                여자
              </Button>
            </Box>
            {errors.gender && <Typography color="error">{errors.gender.message}</Typography>}
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkboxState.all}
                  onChange={() => handleCheck('all')}
                />
              }
              label="전체 동의"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkboxState.terms}
                  onChange={() => handleCheck('terms')}
                />
              }
              label="이용약관 동의"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkboxState.privacy}
                  onChange={() => handleCheck('privacy')}
                />
              }
              label="개인정보처리방침 동의"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkboxState.marketing}
                  onChange={() => handleCheck('marketing')}
                />
              }
              label="마케팅 정보 수신 동의"
            />
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            회원가입
          </Button>
        </form>
      </Box>

      {/* 팝업 컴포넌트들 */}
      {isJobPopupOpen && <JobPopup onClose={() => handlePopupClose('job')} />}
      {isCategoryPopupOpen && <CategoryPopup onClose={() => handlePopupClose('category')} />}
      {/* 추가적인 팝업 컴포넌트들을 필요에 따라 추가 */}
    </Box>
  );

