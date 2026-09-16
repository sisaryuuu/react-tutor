import { useEffect, useState } from "react";

export default function EnrollStudent({ student, onEnrolled }){
    const [subjects, setSubjects] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        fetch('/api/subjects')
            .then((r) => r.json())
            .then((data) => {
                setSubjects(data);

                const enrolledIds = (student.subjects || []).map((s) =>s.id);
                setSelected(enrolledIds);
            })
            .catch(console.error);
    },[student]);

    function toggle(id){
        setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev,id]);
    }

     async function handleSave() {
        const response = await fetch(`/api/students/${student.id}/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ subject_ids: selected }),
        });


        if(response.ok){
            const updated = await response.json();
            onEnrolled(updated);
        }else{
            alert('Failed to enroll.');
        }
    }
    
    return (
        <div className ="enroll-panel">
            <h4>Enroll in Subjects</h4>
            {subjects.length === 0 && <p>No subjects available</p>}
            <ul style={{ listStyle: 'none', padding: 0}}>
                {subjects.map((subject) => (
                    <li key={subject.id}>
                        <label>
                            <input 
                                type="checkbox"
                                checked={selected.includes(subject.id)}
                                onChange={() => toggle(subject.id)}
                            />{' '}
                            {subject.code} - {subject.name}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleSave}>Save Enrollment</button>
        </div>
    );
}
