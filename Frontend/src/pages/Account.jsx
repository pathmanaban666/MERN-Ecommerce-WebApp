import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const usernameInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/account', { withCredentials: true });
        setUser(res.data.user);
        setUsername(res.data.user.username || '');
        setOriginalUsername(res.data.user.username || '');
      } catch {
        toast.error('Failed to load user data. Please try again.', {
          position: 'top-center',
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (editing && usernameInputRef.current) {
      usernameInputRef.current.focus();
      usernameInputRef.current.select();
    }
  }, [editing]);

  const handleEdit = () => setEditing(true);

  const handleCancel = () => {
    setUsername(originalUsername);
    setEditing(false);
  };

  const handleUpdate = async () => {
    if (!username.trim()) {
      toast.warn('Username cannot be empty.', { position: 'top-center', autoClose: 3000 });
      return;
    }
    setUpdating(true);
    try {
      const res = await api.patch(
        '/account/update',
        { username },
        { withCredentials: true }
      );
      setUser(res.data.user);
      setOriginalUsername(res.data.user.username);
      setEditing(false);
      toast.success('Username updated successfully!', { position: 'top-center', autoClose: 3000 });
    } catch {
      toast.error('Failed to update username. Please try again.', { position: 'top-center', autoClose: 5000 });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-8 px-4">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-8 px-4">
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
          <p className="text-red-600">You are not logged in. Please log in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8 px-4">
      <div className="bg-white max-w-md w-full mb-28 rounded-xl border border-gray-200 shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Account Profile</h1>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="username" className="text-gray-600 text-sm font-medium mb-1 block">
              Full Name
            </label>
            <input
              ref={usernameInputRef}
              id="username"
              type="text"
              value={username}
              disabled={!editing}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full bg-white border rounded px-4 py-2 text-lg focus:outline-none
                ${editing ? 'border-blue-500 focus:ring-2 focus:ring-blue-500' : 'border-gray-200'}`}
              spellCheck={false}
              aria-label="Full name"
            />
            <div className="mt-2 flex justify-end">
              {editing ? (
                <button
                  onClick={handleCancel}
                  type="button"
                  aria-label="Cancel editing full name"
                  className="text-md px-3 py-1 font-medium text-gray-600 underline hover:text-blue-600"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  type="button"
                  aria-label="Edit full name"
                  className="text-md px-3 py-1 text-blue-700 font-semibold hover:underline focus:outline-none"
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium mb-1 block">Email Address</label>
            <div
              className="w-full bg-white border border-gray-200 rounded px-4 py-2 text-lg font-medium text-gray-700 select-all"
              aria-label="Email address"
            >
              {user.email}
            </div>
          </div>
        </div>

        {editing && username.trim() !== '' && username !== originalUsername && (
          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className={`px-6 py-3 rounded text-white font-semibold transition
                ${updating ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              aria-label="Update profile"
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}
