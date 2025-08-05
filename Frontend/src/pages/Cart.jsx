import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await api.get('/cart');
        setCartItems(res.data || []);
      } catch {
        setError('Failed to load cart items.');
        toast.error('Failed to load cart items. Please try again.', {
          position: 'top-center',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await api.delete('/cart', { data: { productId } });
      setCartItems((prev) =>
        prev.filter((item) => item.product?._id !== productId)
      );
      toast.success('Item removed from cart.', {
        position: 'top-center',
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    } catch {
      toast.error('Failed to remove item from cart. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  
  const checkout=()=>{
      toast.success('Order Placed.', {
        position: 'top-center',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-lg">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (cartItems.length === 0) {
    return <div className="text-center py-12 text-gray-700">Your cart is empty.</div>;
  }

  return (
    <>
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <ul className="space-y-8">
          {cartItems.map(({ product, quantity }) => {
            if (!product) return null;

            const totalPrice = (product.price * quantity).toFixed(2);

            return (
              <li
                key={product._id}
                className="flex flex-col sm:flex-row items-center md:space-x-56 justify-between border-b pb-4"
              >
                <div className="flex items-center w-full sm:w-auto">
                  <img
                    src={product.image || '/default-image.jpg'}
                    alt={product.name || 'Product'}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold">{product.name || 'Product'}</h3>
                    <p className="text-gray-600">Quantity: {quantity}</p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-4">
                  <span className="text-xl font-semibold">₹{totalPrice}</span>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="px-4 py-2 bg-red-600 font-bold text-white rounded hover:bg-red-700 transition"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-between items-center mt-8 pt-6">
          <div className="text-xl font-bold">
            Total: <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          <button onClick={checkout}
            className="bg-green-600 text-white font-bold px-6 py-3 rounded hover:bg-green-700 transition"
            aria-label="Proceed to Checkout"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Cart;
