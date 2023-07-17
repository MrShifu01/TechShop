import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import logo from '../assets/logo.png'
import "../assets/styles/index.css"
import { LinkContainer} from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout } from '../slices/authSlice'
import SearchBox from './SearchBox'
import { useNavigate } from 'react-router-dom'

const Header = () => {

    const { cartItems } = useSelector((state) => state.cart)
    const { userInfo } = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [logoutApiCall] = useLogoutMutation()

    const handleLogout = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/login')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <header>
            <Navbar 
            bg='primary' 
            variant='primary'
            expand='md'
            collapseOnSelect
            >
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>
                            <img className='logo' src={logo} alt="TechShop"/>
                        </Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav'/>
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            <SearchBox/>
                            <LinkContainer to='/cart'>
                                <Nav.Link className='text-light'><FaShoppingCart className='me-1'/>Cart
                                {
                                    cartItems.length > 0 && (
                                        <Badge pill bg="success" style={{marginLeft: "5px"}}>
                                            {cartItems.reduce((a, c) => a + c.qty, 0)}
                                        </Badge>
                                    )
                                }
                                </Nav.Link>
                            </LinkContainer>
                            { userInfo 
                            ? (<NavDropdown style={{color: 'white'}} title={userInfo.name} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>
                                            Profile
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                        <NavDropdown.Item onClick={handleLogout}>
                                            Logout
                                        </NavDropdown.Item>
                                </NavDropdown>
                                ) 
                            : (
                                <LinkContainer to='/login'>
                                    <Nav.Link href='/login'>
                                        <FaUser/>Sign In
                                    </Nav.Link>
                                </LinkContainer>
                            )
                            }

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown className='text-light' title='Admin' id="adminmenu">
                                    <LinkContainer to='/admin/productlist'>
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/userlist'>
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/admin/orderlist'>
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}

                        </Nav>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
        </header>
    )
}

export default Header