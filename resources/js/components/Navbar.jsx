import { useAuth } from '../context/AuthContext';
import Logout from './Logout';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <header className="navbar">
            <span className="navbar__brand">Student Management System</span>
            <div className="navbar__right">
                {user && (
                    <span className="navbar__user">
                        {user.name} <span className="navbar__role">({user.role})</span>
                    </span>
                )}
                <Logout />
            </div>
        </header>
    );
}