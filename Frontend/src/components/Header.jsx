import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ isAuthenticated, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const accountInfo = () => {
    navigate("/account");
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-3xl mx-8 font-bold">
        <Link to="/">PrimeCart</Link>
      </h1>

      <nav className="hidden md:flex items-center mr-6">
        <Link to="/" className="mx-4 text-lg font-bold">Home</Link>
        <Link to="/products" className="mx-4 text-lg font-bold">Products</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="mx-4 text-lg font-bold">Login</Link>
            <Link to="/register" className="mx-4 text-lg font-bold">Register</Link>
          </>
        ) : (
          <>
            <Link to="/cart" className="mx-4 text-lg font-bold">Cart</Link>
            <button onClick={accountInfo} className="mx-2 text-lg text-white font-bold">Account</button>
            <button onClick={handleLogout} className="mx-2 text-lg text-white font-bold">Logout</button>
          </>
        )}
      </nav>

      <button
        className="md:hidden mr-4 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open main menu"
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
          />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute top-16 right-4 bg-blue-600 rounded shadow-lg py-8 px-20 flex flex-col space-y-4 z-50 md:hidden">
          <Link to="/" className="mx-6 text-lg font-bold" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="mx-6 text-lg font-bold" onClick={() => setMenuOpen(false)}>Products</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="mx-6 text-lg font-bold" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mx-6 text-lg font-bold" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/cart" className="mx-6 text-lg font-bold" onClick={() => setMenuOpen(false)}>Cart</Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  accountInfo();
                }}
                className="text-white font-bold text-lg mr-2"
              >
                Account
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="text-white font-bold text-lg mr-4"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
