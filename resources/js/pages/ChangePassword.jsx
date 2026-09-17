import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default function ChangePassword() {
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { refreshUser } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = getCookie('XSRF-TOKEN');

            const response = await fetch('/api/profile/password', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    password,
                    password_confirmation: confirmation,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                await refreshUser();
                navigate('/');
            } else {
                setError(data.message || 'Could not update password.');
            }
        } catch (err) {
            console.error(err);
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <Link
                    to="/"
                    className="inline-block text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                    ← Back
                </Link>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    Set a new password
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Choose a new password to continue.
                </p>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            New password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmation"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Confirm password
                        </label>
                        <input
                            id="confirmation"
                            type="password"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
                                   transition-colors
                                   hover:bg-blue-700 active:bg-blue-800
                                   focus:outline-none focus:ring-2 focus:ring-blue-400
                                   disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Saving…' : 'Save password'}
                    </button>
                </form>
            </div>
        </div>
    );
}