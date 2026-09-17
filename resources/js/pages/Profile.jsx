import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default function Profile() {
    const { refreshUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        fetch('/api/profile', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal,
        })
            .then((r) => r.json())
            .then((data) => {
                setProfile(data);
                setForm({ name: data.name, email: data.email });
            })
            .catch(() => { /* leave profile null → error state below */ })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});
        setSuccess(false);
        setSaving(true);

        try {
            const token = getCookie('XSRF-TOKEN');

            const response = await fetch('/api/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': token,
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (response.ok) {
                setProfile({ ...profile, ...data });
                setSuccess(true);
                await refreshUser();
            } else if (response.status === 422) {
                setErrors(data.errors || {});
            } else {
                setErrors({ general: data.message || 'Something went wrong.' });
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: 'Could not connect to the server.' });
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
                <p className="py-8 text-center text-sm text-gray-500">Loading…</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
                <p className="py-8 text-center text-sm font-medium text-red-600">
                    Could not load profile.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-6 flex items-center gap-4">
                <div
                    aria-hidden="true"
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-600 text-2xl font-semibold text-white"
                >
                    {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                    <h1 className="truncate text-2xl font-bold text-gray-900">
                        {profile.name}
                    </h1>
                    <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize">
                        {profile.role}
                    </span>
                </div>
            </header>

            {/* Student details */}
            {profile.student && (
                <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-3 text-base font-semibold text-gray-900">
                        Student details
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Student ID
                            </p>
                            <p className="mt-0.5 text-sm text-gray-900">
                                {profile.student.student_id}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Course
                            </p>
                            <p className="mt-0.5 text-sm text-gray-900">
                                {profile.student.course}
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 text-xs font-medium uppercase tracking-wide text-gray-500">
                        Subjects
                    </p>
                    {profile.student.subjects && profile.student.subjects.length > 0 ? (
                        <ul className="mt-2 flex flex-wrap gap-2">
                            {profile.student.subjects.map((s) => (
                                <li
                                    key={s.id}
                                    className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700"
                                >
                                    {s.code} — {s.name}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-2 text-sm italic text-gray-400">
                            No subjects enrolled yet.
                        </p>
                    )}
                </section>
            )}

            {/* Account details */}
            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-gray-900">
                    Account details
                </h2>

                {errors.general && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                        {errors.general}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                        Profile updated.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">{errors.name[0]}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
                                       transition-colors
                                       hover:bg-blue-700 active:bg-blue-800
                                       focus:outline-none focus:ring-2 focus:ring-blue-400
                                       disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>

                        <Link
                            to="/change-password"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Change Password
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
}