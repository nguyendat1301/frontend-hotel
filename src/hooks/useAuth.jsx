import { useState, createContext, useContext, useEffect } from 'react';
import api from '../services/api';
import Loading from '../pages/Loading';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const response = await api.get('/profile');
        const profile = response.data;
        const authenticatedUser = {
          ...profile,
          role: profile.role_user || profile.role,
        };

        if (isMounted) {
          setUser(authenticatedUser);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          if (isMounted) {
            localStorage.removeItem('user');
            setUser(null);
          }
        } else if (isMounted) {
          setAuthError('Không thể xác thực phiên đăng nhập. Vui lòng tải lại trang.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    const userData = {
      ...response.data.user,
      role: response.data.user.role_user || response.data.user.role,
    };
    setUser(userData);
    return response.data;
  };

  const googleLogin = async (googleData) => {
    const response = await api.post('/google-login', googleData);
    const userData = {
      ...response.data.user,
      role: response.data.user.role_user || response.data.user.role,
    };
    setUser(userData);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    localStorage.removeItem('user');
    setUser(null);
    setAuthError('');
    setIsLoading(false);
  };

  const register = async (data) => {
    await api.post('/register', data);
  };

  const updateUserData = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, googleLogin, logout, register, updateUserData }}>
      {isLoading ? <Loading /> : authError ? (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-slate-700" role="alert">
          <p>{authError}</p>
          <button className="text-blue-600 underline" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };