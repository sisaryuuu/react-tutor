import { useState } from 'react';

export default function CreateStudent({ onStudentCreated }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        course: '',
    });

    const [error, setError] = useState('');

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        const response = await fetch('/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(form),
        });

        const data = await response.json();

        if (response.ok) {
            onStudentCreated(data);

            setForm({
                name: '',
                email: '',
                course: '',
            });
        } else {
            setError('Something went wrong.');
            console.log(data);
        }
    }

    return (
        <div>
            <h2>Add Student</h2>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <br />

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Email</label>
                    <br />

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <label>Course</label>
                    <br />

                    <input
                        type="text"
                        name="course"
                        value={form.course}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <button type="submit">
                    Add Student
                </button>
            </form>
        </div>
    );
}

