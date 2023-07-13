import { Form, Button } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {

    // Added above so that form can be prefilled in
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart

    // If a shipping address is saved, then it is filled in, the ? is to prevent an error of values begin undefined
    const [address, setAddress] = useState(shippingAddress?.address || '')
    const [city, setCity] = useState(shippingAddress?.city || '')
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
    const [country, setCountry] = useState(shippingAddress?.country || '')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = (ev) => {
        ev.preventDefault()
        dispatch(saveShippingAddress({address, city, postalCode, country}))
        navigate('/payment')
    }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2/>
        <h1>Shipping</h1>
        <Form onSubmit={handleSubmit}>

            <Form.Group controlId='address' className='my-2'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Address'
                value={address}
                onChange={(ev) => setAddress(ev.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='city' className='my-2'>
                <Form.Label>City</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter City'
                value={city}
                onChange={(ev) => setCity(ev.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='postalCode' className='my-2'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Postal Code'
                value={postalCode}
                onChange={(ev) => setPostalCode(ev.target.value)}
                ></Form.Control>
            </Form.Group>

            <Form.Group controlId='country' className='my-2'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Country'
                value={country}
                onChange={(ev) => setCountry(ev.target.value)}
                ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='my-2'>Continue</Button>

        </Form>
    </FormContainer>
  )
}

export default ShippingScreen