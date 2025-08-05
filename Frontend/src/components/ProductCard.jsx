import { Link } from 'react-router-dom';

const ProductCard = ({ product, increment, decrement, quantity, addToCart }) => (
  <div className="bg-white border-2 border-gray-200 p-4 rounded-lg shadow hover:shadow-lg transition">
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-48 object-cover rounded-t"
    />
    <div className="mt-4">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <span className="text-blue-600 text-2xl font-bold">₹{product.price}</span>

      <div className="flex items-center mt-4 space-x-2">
        <button
          onClick={decrement}
          className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          −
        </button>
        <span className="px-3 text-xl">{quantity}</span>
        <button
          onClick={increment}
          className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          +
        </button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => addToCart(product._id)}
          className="bg-indigo-700 font-bold text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Add To Cart
        </button>
        <Link
          to={`/products/${product._id}`}
          className="bg-green-500 font-bold text-white px-3 py-2 rounded hover:bg-green-700"
        >
          View Product
        </Link>
      </div>
    </div>
  </div>
);

export default ProductCard;
