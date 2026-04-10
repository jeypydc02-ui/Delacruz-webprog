import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = () => {
  return (
    <div className="min-h-screen text-[#3d4a2e]" style={{ background: '#FBE8CE' }}>
      <NavBar />
      <main className="pb-16 pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;