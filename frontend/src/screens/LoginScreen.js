import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const [login, { isLoading }] = useLoginMutation()

    const { userInfo } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const { search } = useLocation()
    const sp = new URLSearchParams(search)
    const redirect = sp.get('redirect') || '/'

    useEffect(() => {
      if(userInfo) {
        navigate(redirect)
      }
    }, [userInfo, redirect, navigate])

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        try {
          const res = await login({
            email,
            password
          }).unwrap()
          dispatch(setCredentials({...res}))
          navigate(redirect)
        } catch (error) {
          toast.error(error?.data?.message || error.error)
        }
    }

  return (
    <FormContainer>
        <h1>Sign In</h1>

        <Form onSubmit={handleSubmit}>

          <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email</Form.Label>
            <Form.Control
            type='email'
            placeholder='admin@email.com'
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password (123456)</Form.Label>
            <Form.Control
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='mt-2' disabled={ isLoading }>Sign In</Button>

          {isLoading && <Loader/> }

        </Form>
        <Row className='py-3'>
          <Col>
            New Customer? <Link to={ redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Demo Accounts</h2>
            <hr className='w-100 m-auto mb-2'/>
            <h5>Admin</h5>
            <p><strong>Email:</strong> admin@email.com</p>
            <p><strong>Password:</strong> 123456</p>
            <hr className='w-100 m-auto mb-2'/>
            <h5>User</h5>
            <p><strong>Email:</strong> john@email.com</p>
            <p><strong>Password:</strong> 123456</p>
          </Col>
        </Row>
    </FormContainer>
  )
}

export default LoginScreen