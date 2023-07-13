import { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../slices/cartSlice'

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const shippingAddress = (useSelector((state) => state.cart.shippingAddress))

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping')
        }
    }, [shippingAddress, navigate])

    const handleSubmit = (ev) => {
        ev.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <h1>Payment Method</h1>
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Select Method</Form.Label>
                <Col>
                    <Form.Check
                    type='radio'
                    className='my-2'
                    label='PayPal or Credit Card'
                    name='paymentMethod'
                    value={paymentMethod}
                    onChange={(ev) => setPaymentMethod(ev.target.value)}
                    ></Form.Check>
                </Col>
            </Form.Group>
            <Button type='submit' variant='primary'>Continue</Button>
        </Form>
    </FormContainer>
  )
}

export default PaymentScreen