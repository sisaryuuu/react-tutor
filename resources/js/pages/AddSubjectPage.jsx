import { useNavigate,Link } from 'react-router-dom';
import CreateSubject from '../components/CreateSubject';    

export default function AddStudentPage(){
    const navigate = useNavigate();

    function handleSubjectCreated(subject){
        console.log('Created:', subject);

        
         navigate('/');
    }

    return(
        <div>
            <Link to="/"> Back to Home</Link>
            <CreateSubject onSubjectCreated={handleSubjectCreated} />
        </div>
    )
}