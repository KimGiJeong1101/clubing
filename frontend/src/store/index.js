import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer.js";
import { clubListReducer, getClubReducer, meetingListReducer } from "./reducers/clubReducer.js";  // 명시적으로 임포트
import storage from 'redux-persist/lib/storage/index.js';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["user","club", "getClub", "meetingList"], 

};

const rootReducer = combineReducers({
  user: userReducer,
  club: clubListReducer,  // clubList 리듀서
  getClub: getClubReducer,  // getClub 리듀서
  meetingList: meetingListReducer,  // getClub 리듀서
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
