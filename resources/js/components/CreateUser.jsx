import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default function CreateUser() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'student',
        course: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});
        setSuccess(null);
        setLoading(true);

        try {
            const token = getCookie('XSRF-TOKEN');

            const response = await fetch('/api/users', {
                method: 'POST',
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
                setSuccess(data);
                setForm({ name: '', email: '', role: 'student', course: '' });
            } else if (response.status === 422) {
                setErrors(data.errors || {});
            } else {
                setErrors({ general: data.message || 'Something went wrong.' });
            }
        } catch (err) {
            console.error(err);
            setErrors({ general: 'Could not connect to the server.' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
                Add User
            </h2>

            {/* General error */}
            {errors.general && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errors.general}
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                    <p>
                        <strong>{success.user.name}</strong> created as {success.user.role}.
                    </p>
                    {success.student && (
                        <p className="mt-1">
                            Student ID: <strong>{success.student.student_id}</strong>
                        </p>
                    )}
                    <p className="mt-1">
                        Default password:{' '}
                        <code className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-xs">
                            {success.default_password}
                        </code>{' '}
                        (they'll be asked to change it on first login)
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <Field label="Name" error={errors.name?.[0]}>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                                   placeholder:text-gray-400
                                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </Field>

                <Field label="Email" error={errors.email?.[0]}>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                                   placeholder:text-gray-400
                                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </Field>

                <Field label="Role">
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                                   focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="student">Student</option>
                        {isAdmin && <option value="teacher">Teacher</option>}
                    </select>
                </Field>

                {form.role === 'student' && (
                    <Field label="Course" error={errors.course?.[0]}>
                        <input
                            name="course"
                            value={form.course}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm
                                       placeholder:text-gray-400
                                       focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </Field>
                )}

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white
                                   transition-colors
                                   hover:bg-blue-700 active:bg-blue-800
                                   focus:outline-none focus:ring-2 focus:ring-blue-400
                                   disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? 'Creating…' : 'Add User'}
                    </button>
                </div>
            </form>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Field — label + input + error, keeps form JSX flat                        */
/* -------------------------------------------------------------------------- */

function Field({ label, error, children }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
        </div>
    );
}