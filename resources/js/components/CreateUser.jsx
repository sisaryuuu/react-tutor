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
        <div>
            <h2>Add User</h2>

            {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

            {success && (
                <div style={{ background: '#eafaf1', padding: '12px', marginBottom: '16px' }}>
                    <p><strong>{success.user.name}</strong> created as {success.user.role}.</p>
                    {success.student && <p>Student ID: <strong>{success.student.student_id}</strong></p>}
                    <p>Default password: <strong>{success.default_password}</strong> (they'll be asked to change it on first login)</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label><br />
                    <input name="name" value={form.name} onChange={handleChange} />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                </div>

                <br />

                <div>
                    <label>Email</label><br />
                    <input type="email" name="email" value={form.email} onChange={handleChange} />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
                </div>

                <br />

                <div>
                    <label>Role</label><br />
                    <select name="role" value={form.role} onChange={handleChange}>
                        <option value="student">Student</option>
                        {isAdmin && <option value="teacher">Teacher</option>}
                    </select>
                </div>

                <br />

                {form.role === 'student' && (
                    <div>
                        <label>Course</label><br />
                        <input name="course" value={form.course} onChange={handleChange} />
                        {errors.course && <p style={{ color: 'red' }}>{errors.course[0]}</p>}
                    </div>
                )}

                <br />

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating…' : 'Add User'}
                </button>
            </form>
        </div>
    );
}