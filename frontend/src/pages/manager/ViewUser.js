import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import UserDetails from '../../components/manager/UserDetails/UserDetails';
import UserLeaveBalance from '../../components/manager/UserDetails/UserLeaveBalance';

export default function ViewUser() {
    const { userId } = useParams();

    return (
        <>
            <Header title="User Details" />
            <UserDetails user_id={userId} />
            <UserLeaveBalance user_id={userId} /> 
        </>
    );
};