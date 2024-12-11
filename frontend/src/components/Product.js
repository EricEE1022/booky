import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { useContext } from 'react';
import { Store } from '../Store';
import './Product.css';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card className="product-card">
      <Link to={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="product-image"
          height={'100'}
          width={'100'}
        />
      </Link>
      <Card.Body className='card-body'>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text className="text-black text-bold">${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button
            role="button"
            variant="light"
            aria-label="out of stock"
            className='text-bold'
            style={{ fontSize: '20px' }}
            disabled>
            Out of stock
          </Button>
        ) : (
          <Button
            className="text-bold"
            aria-label="add to cart"
            role="button"
            style={{ fontSize: '20px' }}
            onClick={() => addToCartHandler(product)}>
            Add to cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
