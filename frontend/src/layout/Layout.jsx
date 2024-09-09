import React from 'react';
import Header from './Header';
import NavBar from './NavBar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div>
      <Header />
      {/* <NavBar /> */}
      <main>
        <Outlet /> {/* 이곳에 페이지 컴포넌트가 렌더링됩니다 */}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
