import { combineReducers, configureStore } from "@reduxjs/toolkit";
<<<<<<< HEAD
import userSlice from "./reducers/userSlice.js";
import { categoryClubListReducer, clubListReducer, getClubMemberReducer, getClubReducer, meetingListReducer } from "./reducers/clubReducer.js"; // 명시적으로 임포트
import storage from "redux-persist/lib/storage"; // 로컬 스토리지
=======
import userSlice from "./reducers/userSlice";
import { categoryClubListReducer, clubListReducer, getClubReducer, meetingListReducer } from "./reducers/clubReducer.js";  // 명시적으로 임포트
import storage from 'redux-persist/lib/storage'; // 로컬 스토리지
>>>>>>> 0fb9ce85bcffcb87915821b2fa9fbb167ba0661d
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user", "club", "getClub", "meetingList", "categoryClub", "getClubMember"],
};

const rootReducer = combineReducers({
  user: userSlice,
  club: clubListReducer, // clubList 리듀서
  getClub: getClubReducer, // getClub 리듀서
  getClubMember: getClubMemberReducer, // 클럽에서의 멤버 리듀서
  meetingList: meetingListReducer,
  categoryClub: categoryClubListReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
