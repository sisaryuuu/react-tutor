import { useState } from 'react';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../context/ToastContext';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
}

export default function DeleteStudent({ student, onStudentDeleted }) {
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();

    async function handleConfirm() {
        setOpen(false);

        try {
            const token = getCookie('XSRF-TOKEN');

            const response = await fetch(`/api/students/${student.id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'X-XSRF-TOKEN': token,
                },
            });

            if (response.ok) {
                onStudentDeleted(student.id);
                showToast(`${student.name} was deleted.`, 'success');
            } else {
                const data = await response.json().catch(() => null);
                console.error(data);
                showToast('Something went wrong.', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Could not connect to the server.', 'error');
        }
    }

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="btn"
                style={{ marginLeft: '10px' }}
            >
                Delete
            </button>

            <ConfirmModal
                open={open}
                title="Delete student"
                message={`Are you sure you want to delete ${student.name}? This can't be undone.`}
                confirmLabel="Delete"
                onConfirm={handleConfirm}
                onCancel={() => setOpen(false)}
            />
        </>
    );
}