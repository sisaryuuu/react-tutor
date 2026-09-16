import { useNavigate, Link } from 'react-router-dom';
import CreateStudent from '../components/CreateStudent';

export default function AddStudentPage() {
    const navigate = useNavigate();

    function handleStudentCreated(student) {
        // The save already succeeded by the time this runs
        // (CreateStudent only calls this after response.ok is true)
        console.log('Created:', student);

        // Send the user back to Home now that the save worked
        navigate('/');
    }

    return (
        <div>
            <Link to="/">&larr; Back to Home</Link>
            <CreateStudent onStudentCreated={handleStudentCreated} />
        </div>
    );
}