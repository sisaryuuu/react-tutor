import { useEffect, useState } from 'react';
import EditStudent from '../components/EditStudent';
import DeleteStudent from '../components/DeleteStudent';
import EnrollStudent from '../components/EnrollStudent';
import Logout from '../components/Logout';
import { Link } from 'react-router-dom';
import '../../css/Home.css';

export default function Home() {
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [enrollingStudentId, setEnrollingStudentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            fetch('/api/students').then((r) => {
                if (!r.ok) throw new Error('Failed to fetch students');
                return r.json();
            }),
            fetch('/api/subjects').then((r) => r.json()),
        ])
            .then(([studentData, subjectData]) => {
                setStudents(studentData);
                setSubjects(subjectData);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function handleStudentCreated(student) {
        setStudents([...students, student]);
    }

    function handleStudentUpdated(updatedStudent) {
        setStudents(students.map((s) =>
            s.id === updatedStudent.id ? updatedStudent : s
        ));
        setEditingStudent(null);
    }

    function handleStudentDeleted(studentId) {
        setStudents(students.filter((s) => s.id !== studentId));
    }

    function handleSubjectCreated(subject) {
        setSubjects([...subjects, subject]);
    }

    function handleEnrolled(updatedStudent) {
        setStudents(students.map((s) =>
            s.id === updatedStudent.id ? updatedStudent : s
        ));
        setEnrollingStudentId(null);
    }

    return (
        <div className="home">
            <header className="home__header">
                <h1>Student Management System</h1>
                <p className="home__subtitle">
                    Manage students and subjects — create, edit, delete, and enroll.
                </p>
                 <Logout />
            </header>

            <section className="home__form-section">
                {!editingStudent ? (
                     <Link to="/add-student">
                    <button className="btn">Add Student</button>
                    </Link>
                ) : (
                    <EditStudent
                        student={editingStudent}
                        onStudentUpdated={handleStudentUpdated}
                        onCancel={() => setEditingStudent(null)}
                    />
                )}
                  <Link to="/add-subject">
                    <button className="btn">Add Subject</button>
                    </Link>
            </section>

            <section className="home__list-section">
                <div className="home__list-header">
                    <h2>Students</h2>
                    <span className="home__count">
                        {students.length} {students.length === 1 ? 'student' : 'students'}
                    </span>
                </div>

                {loading && <p className="home__status">Loading…</p>}
                {error && <p className="home__status home__status--error">{error}</p>}

                <div className="home__grid">
                    {students.map((student) => (
                        <article key={student.id} className="student-card">
                            <div className="student-card__avatar">
                                {student.name.charAt(0).toUpperCase()}
                            </div>

                            <div className="student-card__info">
                               <Link to={`/students/${student.id}`} className="student-card__name">
                               {student.name}</Link>
                                <p className="student-card__email">{student.email}</p>
                                <span className="student-card__course">{student.course}</span>

                                {/* enrolled subjects */}
                                <div className="student-card__subjects">
                                    {student.subjects && student.subjects.length > 0 ? (
                                        student.subjects.map((sub) => (
                                            <span key={sub.id} className="subject-tag">
                                            <br/>{sub.code} - {sub.name}
                                            </span>
                                        ))
                                    ) : (
                                        <em>No subjects enrolled</em>
                                    )}
                                </div>
                            </div>

                            <div className="student-card__actions">
                                <button
                                    className="btn btn--edit"
                                    onClick={() => setEditingStudent(student)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn--enroll"
                                    onClick={() =>
                                        setEnrollingStudentId(
                                            enrollingStudentId === student.id ? null : student.id
                                        )
                                    }
                                >
                                    {enrollingStudentId === student.id ? 'Close' : 'Enroll'}
                                </button>
                                <DeleteStudent
                                    student={student}
                                    onStudentDeleted={handleStudentDeleted}
                                />
                            </div>

                            {enrollingStudentId === student.id && (
                                <EnrollStudent
                                    student={student}
                                    onEnrolled={handleEnrolled}
                                />
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}