import { createSlice } from '@reduxjs/toolkit';
import {
  fetchClubDetailByChatRoomId,
  enterChatRoom,
  fetchInitialMessages,
  fetchOlderMessages
} from '../actions/chatActions';

const initialState = {
  clubDetail: {},
  chatRooms: {},
  messages: [],
  status: 'idle',
  error: null
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // 채팅방 세부정보 가져오기
    builder
      .addCase(fetchClubDetailByChatRoomId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClubDetailByChatRoomId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clubDetail = action.payload;
      })
      .addCase(fetchClubDetailByChatRoomId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 채팅방 생성
    builder
      .addCase(enterChatRoom.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(enterChatRoom.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // chatRooms를 업데이트하는 로직이 필요할 수 있음
      })
      .addCase(enterChatRoom.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 초기 메시지 가져오기
    builder
      .addCase(fetchInitialMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInitialMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = action.payload;
      })
      .addCase(fetchInitialMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 이전 메시지 가져오기
    builder
      .addCase(fetchOlderMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOlderMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.messages = [...state.messages, ...action.payload];
      })
      .addCase(fetchOlderMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default chatSlice.reducer;
