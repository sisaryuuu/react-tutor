import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../../css/Login.css';

// Reads a cookie value by name (Laravel sets XSRF-TOKEN after the
// /sanctum/csrf-cookie request). fetch doesn't auto-attach this as a
// header the way axios does, so we have to do it ourselves.
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Get the CSRF cookie first — Sanctum requires this before
            //    it will trust a login POST request from your SPA.
            await fetch('/sanctum/csrf-cookie', {
                credentials: 'include',
            });

            // 2. Now send the actual login request, manually attaching
            //    the XSRF token Laravel just gave us as a cookie
            const token = getCookie('XSRF-TOKEN');

            const response = await fetch('/api/login', {
                method: 'POST',
                credentials: 'include', // sends the session cookie
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': token,
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Logged in successfully — refresh AuthContext's user
                //    state BEFORE navigating, so ProtectedRoute sees the
                //    real logged-in user instead of the stale null from
                //    initial mount.
                await refreshUser();
                navigate('/');
            } else if (response.status === 422) {
                setError(data.message || 'Invalid credentials.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="login-panel">
                <h2 className="login-heading">Welcome back</h2>
                <p className="login-subtext">Log in to pick up where you left off.</p>

                {error && <p className="login-error">{error}</p>}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="login-field">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in…' : 'Log in'}
                    </button>
                </form>
            </div>
        </div>
    );
}