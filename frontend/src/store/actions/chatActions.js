import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// 채팅방 세부정보 가져오기
export const fetchClubDetailByChatRoomId = createAsyncThunk(
  'chat/fetchClubDetailByChatRoomId',
  async (chatRoomId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/clubs/chatrooms/room/${chatRoomId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching club detail by chat room ID:', error);
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }
  }
);

// 채팅방 생성
export const enterChatRoom = createAsyncThunk(
  'chat/enterChatRoom',
  async ({ clubId, participants }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/clubs/chatrooms/room', {
        clubId,
        participants
      });
      return response.data;
    } catch (error) {
      console.error('Error entering chat room:', error);
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }
  }
);

// 초기 메시지 가져오기
export const fetchInitialMessages = createAsyncThunk(
  'chat/fetchInitialMessages',
  async (roomId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/clubs/chatrooms/${roomId}/messages?limit=30`);
      return response.data;
    } catch (error) {
      console.error('Error fetching initial messages:', error);
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }
  }
);

// 이전 메시지 가져오기
export const fetchOlderMessages = createAsyncThunk(
  'chat/fetchOlderMessages',
  async ({ roomId, skip }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/clubs/chatrooms/${roomId}/messages?skip=${skip}&limit=30`);
      return response.data;
    } catch (error) {
      console.error('Error fetching older messages:', error);
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }
  }
);
