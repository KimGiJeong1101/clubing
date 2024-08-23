import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  authUser,
  logoutUser,
  myPage,
  updateUser,
} from "../actions/userActions.js";
import { toast } from "react-toastify";
import { Snackbar, Alert } from "@mui/material";

const initialState = {
  userData: {
    user: {
      email: "", // 사용자 이메일
      name: "", // 사용자 이름
      nickName: "", // 사용자 닉네임
      age: {
        year: null, // 생년
        month: null, // 생월
        day: null, // 생일
      },
      gender: "", // 성별
      profilePic: {
        originalImage: "", // 원본 프로필 이미지 URL
        thumbnailImage: "", // 썸네일 프로필 이미지 URL
        introduction: "", // 프로필 소개글
      },
      homeLocation: {
        city: "", // 거주지 도시 이름
        district: "", // 거주지 구/군 이름
        neighborhood: "", // 거주지 동/읍/면 이름
      },
      interestLocation: {
        city: "", // 관심 지역 도시 이름
        district: "", // 관심 지역 구/군 이름
        neighborhood: "", // 관심 지역 동/읍/면 이름
      },
      workplace: {
        city: "", // 직장 도시 이름
        district: "", // 직장 구/군 이름
        neighborhood: "", // 직장 동/읍/면 이름
      },
      category: {
        main: "", // 카테고리 메인
        sub: [], // 카테고리 서브
      },
      job: [], // 업종 또는 직무 (최대 3개 선택 가능)
      roles: 1, // 사용자 역할 (기본값: 일반 사용자)
      phone: "", // 전화번호
      termsAccepted: false, // 이용약관 동의 여부
      privacyAccepted: false, // 개인정보 처리방침 동의 여부
      marketingAccepted: false, // 마케팅 정보 수신 동의 여부
      wish: [], // 찜한 모임
      history: [], // 최근 본 모임
    },
  },
  isAuth: false, //true면 로그인되어 있는
  isLoading: false, // 데이터를 가져오는 중이면 true
  error: "",
  token: {
    value: "", // JWT 값
    iat: null, // 발급 시간
    exp: null, // 만료 시간
  },
  snackbar: {
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', 'info'
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    closeSnackbar: (state) => {
      state.snackbar.open = false;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuth = true;
    },
  },
  extraReducers: (builder) => {
    builder
    // 회원가입        
    .addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false;
      state.snackbar = {
          open: true,
          message: '회원가입을 성공했습니다.',
          severity: 'success',
      };
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || '회원가입 실패';
      state.snackbar = {
          open: true,
          message: action.payload || '회원가입 실패',
          severity: 'error',
      };
    })
    // 로그인
    .addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
      state.isAuth = true;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || '로그인 실패';
      toast.error(action.payload || '로그인 실패');
    })

    // 토큰        
    .addCase(authUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(authUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
      state.isAuth = true;
    })
    .addCase(authUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || '인증 실패';
      state.userData = initialState.userData;
      state.isAuth = false;
      console.error("인증실패", action.error)
    })

    // 로그아웃
    .addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(logoutUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userData = initialState.userData;
      state.isAuth = false;
    })
    .addCase(logoutUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || '로그아웃 실패';
      toast.error(action.payload || '로그아웃 실패');
    })
    //myPage
    .addCase(myPage.pending, (state) => {
    state.isLoading = true;
    })
    .addCase(myPage.fulfilled, (state, action) => {
    state.isLoading = false;
    state.userData = action.payload;
    state.isAuth = true;
    })
    .addCase(myPage.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload || '정보 가져오기 실패';
    state.isAuth = false;
    })
    //myPage 수정
    .addCase(updateUser.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userData = action.payload;
      state.snackbar = {
          open: true,
          message: '정보가 성공적으로 업데이트되었습니다.',
          severity: 'success',
      };
    })
    .addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || '정보 업데이트 실패';
      state.snackbar = {
          open: true,
          message: '정보 업데이트에 실패했습니다.',
          severity: 'error',
      };
    });
    }
});

export const { closeSnackbar, setUserData } = userSlice.actions;
export default userSlice.reducer;
// 여기서는 createSlice로 생성된 reducer를 export 합니다.
