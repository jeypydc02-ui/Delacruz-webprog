import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen text-[#3d4a2e]" style={{ background: '#FBE8CE' }}>
      <NavBar />
      <main className="pb-0 pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;