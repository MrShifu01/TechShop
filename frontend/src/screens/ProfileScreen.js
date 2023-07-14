import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from 'react'
import { Table, Form, Button, Row, Col } from 'react-bootstrap'
import { LinkContainer } from "react-router-bootstrap"
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Loader from "../components/Loader"
import Message from "../components/Message"
import { useProfileMutation } from "../slices/usersApiSlice"
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice"
import { setCredentials } from "../slices/authSlice"


const ProfileScreen = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { userInfo } = useSelector((state) => state.auth)

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation()
    const { data: orders, isLoading, error } = useGetMyOrdersQuery()

    const dispatch = useDispatch()

    useEffect(() => {
        if ( userInfo) {
            setName(userInfo.name)
            setEmail(userInfo.email)
        }
    }, [userInfo])

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Password do not match")
        } else {
            try {
                const res = await updateProfile({ _id: userInfo._id, name, email, password}).unwrap()
                dispatch(setCredentials(res))
                toast.success('Profile Updated')
            } catch (error) {
                toast.error(error?.data?.message || error?.error)
            }
        }
    }

  return (
    <Row>

        <Col md={3}>
            <h2>User Profile</h2>

            <Form onSubmit={handleSubmit}>

                 <Form.Group controlId='name' className="my-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type="name"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                    ></Form.Control>
                 </Form.Group>

                 <Form.Group controlId='email' className="my-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    ></Form.Control>
                 </Form.Group>

                 <Form.Group controlId='password' className="my-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    ></Form.Control>
                 </Form.Group>

                 <Form.Group controlId='confirmPassword' className="my-2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                    type="confirmPassword"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(ev) => setConfirmPassword(ev.target.value)}
                    ></Form.Control>
                 </Form.Group>

                 <Button type="submit" variant="primary" className="my-2">Update</Button>
                 {loadingUpdateProfile && <Loader/>}

            </Form>
        </Col>

        <Col md={9}>
            <h2>My Orders</h2>
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
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt.substring(0,10)}</td>
                                    <td>R{order.totalPrice}</td>
                                    <td>
                                        {order.isPaid 
                                        ? (order.paidAt.substring(0,10)) 
                                        : (<FaTimes color="red"/>)}
                                    </td>
                                    <td>
                                        {order.isDelivered 
                                        ? (order.deliveredAt.substring(0,10)) 
                                        : (<FaTimes color="red"/>)}
                                    </td>
                                    <td>
                                        <LinkContainer to={`/order/${order._id}`}>
                                            <Button>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </Table>
                )
            )}
        </Col>
    </Row>
  )
}

export default ProfileScreen