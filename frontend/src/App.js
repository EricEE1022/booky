import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import { Store } from './Store';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Lazy imports for screens
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const ProductScreen = lazy(() => import('./screens/ProductScreen'));
const CartScreen = lazy(() => import('./screens/CartScreen'));
const SigninScreen = lazy(() => import('./screens/SigninScreen'));
const ShippingAddressScreen = lazy(() => import('./screens/ShippingAddressScreen'));
const SignupScreen = lazy(() => import('./screens/SignupScreen'));
const PaymentMethodScreen = lazy(() => import('./screens/PaymentMethodScreen'));
const PlaceOrderScreen = lazy(() => import('./screens/PlaceOrderScreen'));
const OrderScreen = lazy(() => import('./screens/OrderScreen'));
const OrderHistoryScreen = lazy(() => import('./screens/OrderHistoryScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const SearchScreen = lazy(() => import('./screens/SearchScreen'));
const DashboardScreen = lazy(() => import('./screens/DashboardScreen'));
const ProductListScreen = lazy(() => import('./screens/ProductListScreen'));
const ProductEditScreen = lazy(() => import('./screens/ProductEditScreen'));
const OrderListScreen = lazy(() => import('./screens/OrderListScreen'));
const UserListScreen = lazy(() => import('./screens/UserListScreen'));
const UserEditScreen = lazy(() => import('./screens/UserEditScreen'));
const MapScreen = lazy(() => import('./screens/MapScreen'));
const ForgetPasswordScreen = lazy(() => import('./screens/ForgetPasswordScreen'));
const ResetPasswordScreen = lazy(() => import('./screens/ResetPasswordScreen'));

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar style={{ backgroundColor: '#4878df' }} variant="dark" expand="lg">
            <Container>
              <Button
                role="button"
                variant="dark"
                aria-label="Toggle sidebar"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars" aria-hidden="true"></i>
              </Button>

              <LinkContainer className="px-3" to="/">
                <Navbar.Brand>Booky</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle className="mb-2" aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link text-white text-bold" style={{ fontSize: '20px'}}>
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown
                      title={<span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold'}}>{userInfo.name}</span>}
                      id="basic-nav-dropdown"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link className="dropdown-item" to="#signout" onClick={signoutHandler}>
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link text-white" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown
                      title={<span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Admin</span>}
                      id="admin-nav-dropdown"
                    >
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  style={{ color: 'white' }}
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/product/:slug" element={<ProductScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/signin" element={<SigninScreen />} />
                <Route path="/signup" element={<SignupScreen />} />
                <Route path="/forget-password" element={<ForgetPasswordScreen />} />
                <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfileScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/map"
                  element={
                    <ProtectedRoute>
                      <MapScreen />
                    </ProtectedRoute>
                  }
                />
                <Route path="/placeorder" element={<PlaceOrderScreen />} />
                <Route path="/search" element={<SearchScreen />} />
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoute>
                      <OrderScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orderhistory"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryScreen />
                    </ProtectedRoute>
                  }
                />
                <Route path="/shipping" element={<ShippingAddressScreen />} />
                <Route path="/payment" element={<PaymentMethodScreen />} />
                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <DashboardScreen />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <AdminRoute>
                      <OrderListScreen />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <AdminRoute>
                      <UserListScreen />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <AdminRoute>
                      <ProductListScreen />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/product/:id"
                  element={
                    <AdminRoute>
                      <ProductEditScreen />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/user/:id"
                  element={
                    <AdminRoute>
                      <UserEditScreen />
                    </AdminRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Container>
        </main>
        <footer>
          <div style={{ backgroundColor: '#4878df', fontSize: '20px'  }} className="text-center py-2 text-white text-bold">
            All rights reserved
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
