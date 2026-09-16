export default function DeleteStudent({ student, onStudentDeleted}) {

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${student.name}?`
        );

        if (!confirmed){
            return;
        }
     
        try {
            const response = await fetch(`/api/students/${student.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                },
            }
            );

        if (response.ok) {
            onStudentDeleted(student.id);
        } else {
            const data = await response.json().catch(() => null);
            console.error(data);
            alert('Something went wrong.');
        }

    } catch (error) {
        console.error(error);
        alert('Could not connect to the server. Please try again later.');

        }

    }

    return (
        <button
            onClick={handleDelete}
            style={{ marginLeft: '10px' }}
        >
            Delete
        </button>

    
    );        
}
