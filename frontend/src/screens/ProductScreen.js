import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductDetailsQuery, useCreateProductReviewMutation } from '../slices/productsApiSlice'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../slices/cartSlice'
import { toast } from 'react-toastify'
import Meta from '../components/Meta'

const ProductScreen = () => {
    const { id: productId } = useParams()

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const { userInfo } = useSelector(state => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data: product, isLoading, error, refetch} = useGetProductDetailsQuery(productId)
    const [createProductReview, { isLoading: loadingProductReview }] = useCreateProductReviewMutation()
    
    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty}))
        navigate('/cart')
    }

    const handleReviewSubmit = async (ev) => {
        ev.preventDefault()
        try {
            await createProductReview({ productId, rating, comment }).unwrap()
            toast.success('Review submitted successfully')
            refetch()
            setRating(0)
            setComment('')
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

  return (
    <>
        <Link className='btn btn-light my-3' to="/">
            Go back
        </Link>

        {isLoading ? (<Loader/>) : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) : (
        <>
            <Meta title={product.name}/>
            <Row>
                <Col md={5}>
                    <Image src={product.image} alt={product.name} fluid />
                </Col>
                <Col md={4}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price: R{product.price}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Description:</strong> {product.description}     
                        </ListGroup.Item>
                    </ListGroup>

                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Price:</Col>
                                    <Col><strong>R{product.price}</strong></Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Status:</Col>
                                    <Col><strong>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</strong></Col>
                                </Row>
                            </ListGroup.Item>

                            {product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col>
                                            <Form.Control
                                            as='select'
                                            value={qty}
                                            onChange={(e) => setQty(Number(e.target.value))}
                                            >
                                                {[...Array(product.countInStock).keys()].map((x) => (
                                                    <option key={ x + 1 } value={ x + 1 }>
                                                        { x + 1 }
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )}

                            <ListGroupItem>
                                <Button 
                                className='btn-block' 
                                type='button' 
                                disabled={product.countInStock === 0}
                                onClick={addToCartHandler}
                                >Add To Cart</Button>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            <Row className='review'>
                 <Col md={6}>
                    <h2 className='mt-2 rounded-3'>Reviews</h2>
                    {product.reviews.length === 0 && <Message>No Reviews</Message>}
                    <ListGroup variant='flush' className='my-2'>
                        {product.reviews.map(review => (
                            <ListGroup.Item key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating value={review.rating}/>
                                <p>{review.createdAt.substring(0, 10)}</p>
                                <p>{review.comment}</p>
                            </ListGroup.Item>
                        ))}

                        <ListGroup.Item>
                            <h2 className='rounded-3'>Write a Customer Review</h2>
                            {loadingProductReview && <Loader/>}
                            {userInfo ? (
                                <Form onSubmit={handleReviewSubmit}>
                                    <Form.Group controlId='rating'>
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control as='select' value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                            <option value=''>Select...</option>
                                            <option value='1'>1 - Poor</option>
                                            <option value='2'>2 - Fair</option>
                                            <option value='3'>3 - Good</option>
                                            <option value='4'>4 - Very Good</option>
                                            <option value='5'>5 - Excellent</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId='comment'>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as='textarea' row='3' value={comment} onChange={(e) => setComment(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Button type='submit' variant='primary'>Submit</Button>
                                </Form>
                            ) : (
                                <Message>Please <Link to='/login'>sign in</Link> to write a review</Message>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>                                   
            </Row>
        </>
        )}
        
    </>
  )
}

export default ProductScreen