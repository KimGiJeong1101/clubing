import { createSlice } from '@reduxjs/toolkit'
import { registerUser, loginUser, authUser, logoutUser, myPage, updateUser } from '../actions/userActions.js';
import { toast } from "react-toastify";
import { Snackbar, Alert } from '@mui/material';

const initialState ={
    userData: {
        id: '',
        email: '',
        name: '',
        nickName: '',
        profilePic: {
            originalImage:  '',
            thumbnailImage:'',
            introduction: '',
        },
        roles: '', // 역할 필드 추가
    },
    isAuth: false, //true면 로그인되어 있는
    isLoading: false, // 데이터를 가져오는 중이면 true
    error: "",
    snackbar: {
        open: false,
        message: '',
        severity: 'info', // 'success', 'error', 'warning', 'info'
    }
}

const userReducer = createSlice({
    name:'user',
    initialState,
    reducers: {
        closeSnackbar: (state) => {
            state.snackbar.open = false;
        }
    },
    setUserData: (state, action) => {
        state.userData = action.payload;
        state.isAuth = true;
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
            localStorage.setItem('accessToken', action.payload.accessToken);
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
            localStorage.removeItem('accessToken');
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
            localStorage.removeItem('accessToken');
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
        })
    }
});

export const { closeSnackbar, setUserData } = userReducer.actions;
export default userReducer.reducer;
// 여기서는 createSlice로 생성된 reducer를 export 합니다.