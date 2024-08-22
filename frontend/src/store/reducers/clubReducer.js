import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// AsyncThunk 정의
const fetchClubList = createAsyncThunk("clubList/fetchClubList", async () => {
  const response = await fetch("http://localhost:4000/clubs");
  const data = await response.json();
  return data;
});

const fetchGetClub = createAsyncThunk("clubList/fetchGetClub", async (id) => {
  const response = await fetch(`http://localhost:4000/clubs/read2/${id}`);
  const data = await response.json();
  return data;
});

const fetchMeetingList = createAsyncThunk(
  "meetingList/fetchMeetingList",
  async (clubNumber) => {
    const response = await fetch(`http://localhost:4000/meetings/${clubNumber}`);
    const data = await response.json();
    return data;
  }
);

const fetchCategoryClubList = createAsyncThunk("CategoryClubList/fetchCategoryClubList", async (Category) => {
  const response = await fetch(`http://localhost:4000/clubs/category/${Category}`);
  const data = await response.json();
  console.log('data')
  console.log(data)
  console.log('data')
  return data;
});

// Slice 정의
const clubList = createSlice({
  name: "clubList",
  initialState: { clubs: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClubList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchClubList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clubs = action.payload;
      })
      .addCase(fetchClubList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

const getClub = createSlice({
  name: "getClub",
  initialState: { clubs: {}, status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGetClub.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchGetClub.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clubs = action.payload;
      })
      .addCase(fetchGetClub.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Slice 정의
const meetingList = createSlice({
  name: "meetingList",
  initialState: { meetings: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetingList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMeetingList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.meetings = action.payload;
      })
      .addCase(fetchMeetingList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

const categoryClubList = createSlice({
  name: "categoryClubList",
  initialState: { clubs: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryClubList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoryClubList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.clubs = action.payload;
      })
      .addCase(fetchCategoryClubList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// 리듀서 export
export const clubListReducer = clubList.reducer;
export const categoryClubListReducer = categoryClubList.reducer;
export const meetingListReducer = meetingList.reducer;
export const getClubReducer = getClub.reducer;
export { fetchClubList, fetchGetClub, fetchMeetingList ,fetchCategoryClubList};
