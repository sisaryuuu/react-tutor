import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EditStudent from '../components/EditStudent';
import DeleteStudent from '../components/DeleteStudent';
import EnrollStudent from '../components/EnrollStudent';

/* -------------------------------------------------------------------------- */
/*  StudentCard                                                               */
/* -------------------------------------------------------------------------- */

function StudentCard({
    student,
    isEditing,
    onEdit,
    isEnrolling,
    onToggleEnroll,
    onStudentUpdated,
    onStudentDeleted,
    onEnrolled,
}) {
    return (
        <article className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            {/* Avatar + info */}
            <div className="flex items-start gap-3">
                <div
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white"
                >
                    {student.name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                    <Link
                        to={`/students/${student.id}`}
                        className="block truncate text-base font-semibold text-gray-900 hover:text-blue-600"
                    >
                        {student.name}
                    </Link>
                    <p className="truncate text-sm text-gray-500">{student.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {student.course}
                    </span>
                </div>
            </div>

            {/* Subjects */}
            <div className="flex flex-wrap gap-1.5">
                {student.subjects?.length > 0 ? (
                    student.subjects.map((sub) => (
                        <span
                            key={sub.id}
                            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                        >
                            {sub.code} - {sub.name}
                        </span>
                    ))
                ) : (
                    <em className="text-xs text-gray-400">No subjects enrolled</em>
                )}
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                <button
                    onClick={onEdit}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                    Edit
                </button>
                <button
                    onClick={onToggleEnroll}
                    className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100"
                >
                    {isEnrolling ? 'Close' : 'Enroll'}
                </button>
                <DeleteStudent
                    student={student}
                    onStudentDeleted={onStudentDeleted}
                />
            </div>

            {/* Enroll panel */}
            {isEnrolling && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <EnrollStudent student={student} onEnrolled={onEnrolled} />
                </div>
            )}
        </article>
    );
}

/* -------------------------------------------------------------------------- */
/*  Skeleton                                                                  */
/* -------------------------------------------------------------------------- */

function StudentCardSkeleton() {
    return (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
                    <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
                </div>
            </div>
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-auto border-t border-gray-100 pt-3">
                <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200" />
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Home                                                                      */
/* -------------------------------------------------------------------------- */

export default function Home() {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [enrollingStudentId, setEnrollingStudentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadStudents() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/students', {
                    credentials: 'include',
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error('Failed to fetch students');
                setStudents(await res.json());
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadStudents();
        return () => controller.abort();
    }, []);

    function handleStudentUpdated(updatedStudent) {
        setStudents((prev) =>
            prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        );
        setEditingStudent(null);
    }

    function handleStudentDeleted(studentId) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
    }

    function handleEnrolled(updatedStudent) {
        setStudents((prev) =>
            prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        );
        setEnrollingStudentId(null);
    }

    const isEmpty = !loading && !error && students.length === 0;

    return (
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                    Students
                </h1>
                {!loading && !error && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                        {students.length} {students.length === 1 ? 'student' : 'students'}
                    </span>
                )}
            </div>

            {/* Editing panel */}
            {editingStudent && (
                <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <EditStudent
                        student={editingStudent}
                        onStudentUpdated={handleStudentUpdated}
                        onCancel={() => setEditingStudent(null)}
                    />
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <strong className="font-semibold">Couldn't load students.</strong>{' '}
                    {error}
                </div>
            )}

            {/* Loading skeleton */}
            {loading && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <StudentCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {isEmpty && (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-12 text-center">
                    <p className="text-sm text-gray-500">
                        No students yet. Use <strong>Add Student</strong> in the sidebar to create one.
                    </p>
                </div>
            )}

            {/* Grid */}
            {!loading && !error && students.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            isEditing={editingStudent?.id === student.id}
                            onEdit={() => setEditingStudent(student)}
                            isEnrolling={enrollingStudentId === student.id}
                            onToggleEnroll={() =>
                                setEnrollingStudentId((prev) =>
                                    prev === student.id ? null : student.id
                                )
                            }
                            onStudentUpdated={handleStudentUpdated}
                            onStudentDeleted={handleStudentDeleted}
                            onEnrolled={handleEnrolled}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}