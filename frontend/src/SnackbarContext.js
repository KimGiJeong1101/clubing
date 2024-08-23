import React, { createContext, useContext } from 'react';
import { SnackbarProvider as NotistackSnackbarProvider, useSnackbar as useNotistackSnackbar } from 'notistack';

// SnackbarContext를 생성하고 기본값을 null로 설정
const SnackbarContext = createContext(null);

// SnackbarProvider를 정의하여 NotistackSnackbarProvider로 감싸고, Context를 제공합니다.
export const SnackbarProvider = ({ children }) => {
  return (
    <NotistackSnackbarProvider maxSnack={3}>
      <SnackbarContext.Provider value={{}}>
        {children}
      </SnackbarContext.Provider>
    </NotistackSnackbarProvider>
  );
};

// useSnackbar 훅을 정의하여 notistack의 useSnackbar를 반환
export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return useNotistackSnackbar(); // notistack의 useSnackbar를 반환
};
