import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
    const { user } = useAuth();
    const canManage = user?.role === 'admin' || user?.role === 'teacher';
    const isAdmin = user?.role ==='admin';
    return (
        <nav className="sidebar">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
                Home
            </NavLink>

            {canManage && (
                <>
                    <NavLink to="/add-student" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
                        Add Student
                    </NavLink>
                    <NavLink to="/add-subject" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
                        Add Subject
                    </NavLink>

                    {isAdmin &&(
                    <NavLink to="/add-user" className={({ isActive }) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
                        Add User
                    </NavLink>
                    )}
                    <NavLink to="/profile" className={({isActive}) => isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'}>
                        Profile
                    </NavLink>
                </>
            )}
        </nav>
    );
}