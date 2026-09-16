import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import EditStudent from '../components/EditStudent';
import DeleteStudent from '../components/DeleteStudent';
import EnrollStudent from '../components/EnrollStudent';
import '../../css/StudentProfile.css';

export default function StudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        fetch(`/api/students/${id}`)
            .then((r) => {
                if (!r.ok) throw new Error('Student not found');
                return r.json();
            })
            .then(setStudent)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    function handleUpdated(updated) {
        setStudent(updated);
        setEditing(false);
    }

    function handleEnrolled(updated) {
        setStudent(updated);
        setEnrolling(false);
    }

    function handleDeleted() {
        navigate('/');
    }

    if (loading) return <p className="profile__status">Loading…</p>;
    if (error) return <p className="profile__status profile__status--error">{error}</p>;
    if (!student) return null;

    return (
        <div className="profile">
            <Link to="/" className="profile__back">&larr; Back to students</Link>

            <header className="profile__header">
                <div className="profile__avatar">
                    {student.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="profile__name">{student.name}</h1>
                    <p className="profile__email">{student.email}</p>
                    <span className="profile__course">{student.course}</span>
                </div>
            </header>

            <section className="profile__section">
                <div className="profile__section-header">
                    <h2>Enrolled subjects</h2>
                    <button className="btn" onClick={() => setEnrolling(!enrolling)}>
                        {enrolling ? 'Close' : 'Enroll in subject'}
                    </button>
                </div>

                {student.subjects && student.subjects.length > 0 ? (
                    <ul className="profile__subjects">
                        {student.subjects.map((sub) => (
                            <li key={sub.id} className="subject-tag">
                                {sub.code} — {sub.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="profile__empty">No subjects enrolled yet.</p>
                )}

                {enrolling && (
                    <EnrollStudent student={student} onEnrolled={handleEnrolled} />
                )}
            </section>

            <section className="profile__section">
                {editing ? (
                    <EditStudent
                        student={student}
                        onStudentUpdated={handleUpdated}
                        onCancel={() => setEditing(false)}
                    />
                ) : (
                    <div className="profile__actions">
                        <button className="btn btn--edit" onClick={() => setEditing(true)}>
                            Edit student
                        </button>
                        <DeleteStudent student={student} onStudentDeleted={handleDeleted} />
                    </div>
                )}
            </section>
        </div>
    );
}