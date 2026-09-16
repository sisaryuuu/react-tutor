import { useEffect, useState } from "react";

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default function EnrollStudent({ student, onEnrolled }){
    const [subjects, setSubjects] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        fetch('/api/subjects', {
            credentials: 'include',
            headers: { 'Accept': 'application/json' },
        })
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
        try {
            const token = getCookie('XSRF-TOKEN');

            const response = await fetch(`/api/students/${student.id}/enroll`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': token,
                },
                body: JSON.stringify({ subject_ids: selected }),
            });

            if(response.ok){
                const updated = await response.json();
                onEnrolled(updated);
            }else{
                alert('Failed to enroll.');
            }
        } catch (error) {
            console.error(error);
            alert('Could not connect to the server.');
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