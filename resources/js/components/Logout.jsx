import { useNavigate } from 'react-router-dom';
import { getCookie } from '../utils/csrf';

export default function Logout() {
    const navigate = useNavigate();

    async function handleLogout() {
        const token = getCookie('XSRF-TOKEN');

        const response = await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-XSRF-TOKEN': token,
            },
        });

        if (response.ok) {
            navigate('/login');
        } else {
            alert('Failed to log out. Please try again.');
        }
    }

    return (
        <button onClick={handleLogout} className="btn">
            Log Out
        </button>
    );
}