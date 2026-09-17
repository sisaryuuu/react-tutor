import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import '../../css/Layout.css';

export default function Layout() {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="app-layout__body">
                <Sidebar />
                <main className="app-layout__content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}