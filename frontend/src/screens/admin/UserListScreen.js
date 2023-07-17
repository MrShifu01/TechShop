import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { toast } from 'react-toastify'


const UserListScreen = () => {

  const {data: users, isLoading, error, refetch} = useGetUsersQuery()
  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation()

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        try {
            await deleteUser(id).unwrap()
            toast.success('User deleted successfully')
            refetch()
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }
}
  
  return (
    <>
      <h1>Users</h1>
      {loadingDelete && <Loader/>}
            {isLoading 
            ? <Loader/> 
            : (
                error 
                ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) 
                : (
                    <Table
                    striped
                    hover
                    responsive
                    className="table-sm"
                    >
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                    <td>
                                        {user.isAdmin 
                                        ? (<FaCheck color='green'/>) 
                                        : (<FaTimes color="red"/>)}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                            <Button className='btn-sm me-1'>
                                                <FaEdit/>
                                            </Button>
                                        </LinkContainer>

                                        <Button
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => handleDelete(user._id)}                                            >
                                            <FaTrash style={{color: 'white'}}/>
                                        </Button>

                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </Table>
                )
            )}
    </>
  )
}

export default UserListScreen