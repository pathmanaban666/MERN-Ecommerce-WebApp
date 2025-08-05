import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <section className="relative text-black bg-white">
        <div className="max-w-7xl mx-auto px-6 xs:py-10 sm:py-12 md:py-10 lg:py-20 xl:py-20 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mt-4 text-black">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Upgrade Your Style, Discover New Trends
            </h1>
            <p className="mb-6 text-lg">
              Shop the latest fashion and accessories. Big discounts on summer arrivals!
            </p>
            <Link
              to="/products"
              className="bg-indigo-600 text-white px-6 py-3 rounded shadow font-semibold hover:bg-indigo-700 transition"
            >
              Shop Now
            </Link>
          </div>
          <div className="w-full md:w-1/2 flex justify-center mt-10 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
              alt="Fashion Banner"
              className="rounded-lg shadow-2xl max-h-72 md:max-h-96"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
