import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import fetchData from '../util/DataFetcher';
import { addToCart } from '../redux/slices/cartSlice';
import { getFormattedPrice } from '../util/appUtil';

const ProductDetails = () => {

  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [countToAddInCart, setCountToAddInCart] = useState(1)
  const categories = useSelector(state => state.categories.categories);
  const dispatch = useDispatch();

  const addProductToCart = (event) => {
    delete product.qtyInStock;
    dispatch(addToCart({ ...product, countToAddInCart: countToAddInCart }));
  }

  useEffect(() => {
    if (import.meta.env.VITE_FETCH_API_DATA) {
      fetchData(
        `products/${productId}`,
        (data) => setProduct(data),
        (errorMsg) => console.log(errorMsg)
      );
    } else {
      fetchData(
        PRODUCTS_JSON_PATH,
        (data) => setProduct(data[productId]),
        (errorMsg) => dispatch(fetchProductsFailure(errorMsg))
      );
    }
    delete product.qtyInStock;
  }, [productId])

  const updateCountToAddToCart = (event) => {
    let newCount = countToAddInCart;
    if (event.target.name === 'decreaseCount') {
      newCount < 1 ? setCountToAddInCart(++newCount) : setCountToAddInCart(--newCount);
    } else if (event.target.name === 'increaseCount') {
      setCountToAddInCart(++newCount);
    }
  }

  return (
    <div className='container bg-secondary-subtle text-center rounded p-3 px-3'>
      <div className="d-flex flex-wrap flex-md-nowrap mx-sm-5 my-3">
        <div className="col-12 col-md-5 rounded py-md-5">
          <img src={product.image} alt={product.name} className='rounded-4 img-fluid' />
        </div>
        <div className="vr mx-4 ps-1 d-none d-md-block"></div>
        <div className="col-11 col-md-6 text-start mx-4 mt-4">
          <p className='mb-1'> Category : {categories.filter(category => category.categoryId === product.categoryId)[0]?.name}</p>
          <h4>{product.name}</h4>
          <h3 className='d-inline-block mt-3'>₹{getFormattedPrice(Math.floor(product.price * ((100 - product.discount) / 100)))}</h3>
          <h5 className='d-inline-block text-decoration-line-through text-secondary ms-3'>₹{getFormattedPrice(product.price)}</h5>
          <p className='d-inline-block ms-2 fw-medium'>{product.discount}% off</p>
          {/* <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti, minus impedit illo magni delectus tempore, blanditiis ad maiores reprehenderit iusto laborum aliquam rerum quo dolorum? Ut consequuntur repellendus fugit! Eligendi, at similique.</p> */}
          <p className='text-body-secondary text-wrap'>{product.desc}</p>
          <div className="cart-count mt-5">
            <button className='btn btn-dark p-3 py-2' name='decreaseCount'
              onClick={updateCountToAddToCart} disabled={countToAddInCart <= 1}>-</button>
            <span id='add-to-cart-count' className='px-3'>{countToAddInCart}</span>
            <button className='btn btn-dark p-3 py-2' name='increaseCount'
              onClick={updateCountToAddToCart}>+</button>
          </div>
          <div className="buttons mt-5">
            <button className='btn btn-dark px-3 px-md-5 py-3 me-5'
              onClick={addProductToCart}
            >Add to Cart</button>
            <button className='btn btn-dark px-4 px-md-5 py-3 mt-md-3 mt-lg-0'>Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
