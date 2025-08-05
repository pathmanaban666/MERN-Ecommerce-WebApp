import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function ProductList({ isAuthenticated }) {
  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
        setFilteredProducts(res.data);

        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        toast.error('Failed to load products. Please try again.', {
          position: 'top-center',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    fetchProducts();
  }, []);

  const increment = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrement = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { toastMessage: 'Please login to purchase item' },
      });
      return;
    }

    const quantity = quantities[productId] || 1;

    try {
      const res = await api.post('cart', { productId, quantity });
      toast.success(res.data?.message || 'Added to cart successfully!', {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(filterProduct.toLowerCase())
    );
    setFilteredProducts(filtered);
    setIsSearchSubmitted(true);

    if (filtered.length === 0) {
      toast.info('No products matched your search.', {
        position: 'top-center',
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleClear = () => {
    setFilterProduct('');
    setFilteredProducts(products);
    setIsSearchSubmitted(false);
  };

  return (
    <>
      <div className="flex justify-between items-center px-8 mt-4 flex-wrap gap-4">
        <h1 className="text-5xl font-bold">Products</h1>
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <input
            type="text"
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            placeholder="Search products..."
            className="p-1 lg:p-2 xl:p-2 border rounded focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
          {isSearchSubmitted && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-400 text-white px-2 lg:px-4 xl:px-4 py-2 rounded hover:bg-gray-500"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <ProductCard
              key={p._id}
              product={p}
              addToCart={addToCart}
              increment={() => increment(p._id)}
              decrement={() => decrement(p._id)}
              quantity={quantities[p._id] || 1}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>

      <ToastContainer />
    </>
  );
}

export default ProductList;
