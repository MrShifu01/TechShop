import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useUpdateProductMutation, 
    useGetProductDetailsQuery, 
    useUploadProductImageMutation 
} from "../../slices/productsApiSlice"

const ProductEditScreen = () => {
    const { id: productId } = useParams()

    const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId)
    console.log(product)

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [brand, setBrand] = useState('')
    const [image, setImage] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    const navigate = useNavigate()

    const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation()
    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation()

    useEffect(() => {
        if(product) {
            setName(product.name)
            setPrice(product.price)
            setBrand(product.brand)
            setCategory(product.category)
            setDescription(product.description)
            setImage(product.image)
            setCountInStock(product.countInStock)
        }
    }, [product])

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        const updatedProduct = {
            productId,
            name,
            price,
            brand,
            description,
            category,
            countInStock,
            image
        }

        const result = await updateProduct(updatedProduct).unwrap()
        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Product Updated")
            navigate('/admin/productlist')
        }
    }

  return (
    <>
        <Link to='/admin/productlist' className="btn btn-light my-3">
            Go Back
        </Link>
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader/>}

            {isLoading 
            ? <Loader/> 
            : error 
                ? <Message variant='danger'>{error}</Message>
                : <Form onSubmit={handleSubmit}>

                    <Form.Group controlId='name' className="my-2">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(ev) => setName(ev.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='price' className="my-2">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                        type="number"
                        placeholder="Enter Price"
                        value={price}
                        onChange={(ev) => setPrice(ev.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    {/* IMAGE INPUT PLACEHOLDER */}

                    <Form.Group controlId='brand' className="my-2">
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Enter Brand"
                        value={brand}
                        onChange={(ev) => setBrand(ev.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description' className="my-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                        type="text"
                        placeholder="Enter Description"
                        value={description}
                        onChange={(ev) => setDescription(ev.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category' className="my-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                        type="category"
                        placeholder="Enter Category"
                        value={category}
                        onChange={(ev) => setCategory(ev.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock' className="my-2">
                        <Form.Label>CountInStock</Form.Label>
                        <Form.Control
                        type="number"
                        placeholder="Enter CountInStock"
                        value={countInStock}
                        onChange={(ev) => setCountInStock(ev.target.value)}
                        ></Form.Control>
                    </Form.Group>

                    <Button
                    type="submit"
                    variant="primary"
                    className="my-2"
                    >Update</Button>

                </Form>
            }
        </FormContainer>
    </>
  )
}

export default ProductEditScreen