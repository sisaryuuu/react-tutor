import { useState } from 'react';

export default function CreateSubject({ onSubjectCreated }) {
    const [form, setForm] = useState({
        code: '',
        name: '',
        course: '',
    });
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErrors({});

        const response = await fetch('/api/subjects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(form),
        });

        const data = await response.json();

        if (response.ok) {
            onSubjectCreated(data);
            setForm({
                code: '',
                name: '',
                course: '',
            });
        } else if (response.status === 422) {
            setErrors(data.errors);
        } else {
            setErrors({ general: data.message || 'Something went wrong.' });
        }
    }

    return (
        <div>
            <h2>Add Subject</h2>
            {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Code</label><br />
                    <input name="code" value={form.code} onChange={handleChange} />
                    {errors.code && <p style={{ color: 'red' }}>{errors.code[0]}</p>}
                </div>
                <br />

                <div>
                    <label>Name</label><br />
                    <input name="name" value={form.name} onChange={handleChange} />
                    {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                </div>
                <br />

                <div>
                    <label>Course</label><br />
                    <input name="course" value={form.course} onChange={handleChange} />
                    {errors.course && <p style={{ color: 'red' }}>{errors.course[0]}</p>}
                </div>
                <br />

                <button type="submit">Add Subject</button>
            </form>
        </div>
    );
}