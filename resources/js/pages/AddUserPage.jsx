import { Link } from 'react-router-dom';
import CreateUser from '../components/CreateUser';

export default function AddUserPage() {
    return(
        <div>
            <Link to="/"> &larr; Back To Home</Link>

            <CreateUser />
        </div>
    )
}