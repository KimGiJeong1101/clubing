import { createSlice } from '@reduxjs/toolkit'
import { registerUser, loginUser, authUser, logoutUser } from '../actions/userActions.js';
import { toast } from "react-toastify";

const initialState ={
    userData: {
        id:'',
        email:'',
        name:'',
        role:0,
        image:'',
    },
    isAuth: false, //true면 로그인되어 있는
    isLoading: false, // 데이터를 가져오는 중이면 true
    error: ""
}

const userReducer = createSlice({
    name:'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

// 회원가입        
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.isLoading = false;
            toast.info('회원가입을 성공했습니다.');
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || '회원가입 실패';
            toast.error(action.payload || '회원가입 실패');
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
    }
});

export default userReducer.reducer;
// 여기서는 createSlice로 생성된 reducer를 export 합니다.