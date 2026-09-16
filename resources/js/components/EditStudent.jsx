import {useState} from 'react';

export default function EditStudent({ student, onStudentUpdated, onCancel}){
    const [form, setForm] = useState({
        name: student.name,
        email: student.email,
        course: student.course,
    }); 

    const [errors, setError] = useState({});

    function handleChange(e){
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e){
        e.preventDefault();

        setErrors({});

        try{
            const response = await fetch(`/api/students/${student.id}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(form),

            });

            const data = await response.json();

            if(response.ok){
                onStudentUpdated(data);
            return;
            }   

            if(response.status === 422){
                setErrors(data.errors);
            }else
            {
                setErrors({
                    general: data.message || 'Something went wrong.'

                });

            }

        }catch(error){
            console.error(error);

            setErrors({
                general: 'Could not connect to the server. Please try again later.'
            })        
        }
}
    return(
        <div>   
            <h2>Edit Student</h2>

            {errors.general && <p>{errors.general}</p>}

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
                    {errors.name && ( <p style={{ color: 'red' }}> {errors.name[0]} </p> )}

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
                    {errors.email && ( <p style={{ color: 'red' }}> {errors.email[0]} </p> )}
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
                    {errors.course && ( <p style={{ color: 'red' }}> {errors.course[0]} </p> )}
                </div>
                <br />
                <button type="submit">
                    Update Student
                </button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        </div>


    )

}