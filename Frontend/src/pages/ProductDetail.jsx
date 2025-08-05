import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/axios';

function ProductDetail({ isAuthenticated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        toast.error('Failed to load product details.', {
          position: 'top-center',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    fetchProduct();
  }, [id]);

  const increment = () => {
    setQuantity(prev => prev + 1);
  };

  const decrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { toastMessage: 'Please login to purchase item' },
      });
      return;
    }

    try {
      const res = await api.post('/cart', {
        productId: id,
        quantity,
      });

      toast.success(res.data?.message || 'Product added to cart successfully!', {
        position: 'top-center',
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to add product to cart. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto flex flex-col xl:flex-row xl:gap-36">
        <div className="w-full lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto border-2 border-gray-200 object-cover rounded-lg"
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <h2 className="text-3xl font-bold">{product.name}</h2>
          <p className="mt-4 text-gray-700">{product.description}</p>
          <span className="text-2xl font-bold mt-4 block">₹{product.price}</span>

          <div className="flex items-center mt-6 space-x-2">
            <button
              onClick={decrement}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={increment}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-green-600 font-bold text-white px-6 py-3 rounded hover:bg-green-700"
            aria-label="Add to cart"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default ProductDetail;
