import React, { useState } from 'react';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Неисправна е-адреса или лозинка');
      }
    } catch (err) {
      setError('Грешка при пријављивању. Покушајте поново.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Пријавите се на свој налог
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Приступите контролној табли и управљајте садржајем
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Е-адреса
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm bg-amber-50"
                  placeholder="Унесите е-адресу"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Лозинка
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-amber-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm bg-amber-50"
                  placeholder="Унесите лозинку"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-md p-3">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-amber-800 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500'
              } transition-colors`}
            >
              {loading ? 'Пријављујем...' : 'Пријави се'}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Демо налози за тестирање:</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Супер админ:</strong> djoricnenad@gmail.com</p>
              <p><strong>Уредник:</strong> marko.petrovic@example.com</p>
              <p><strong>Аутор:</strong> ana.jovanovic@example.com</p>
              <p><strong>Аутор:</strong> neschkonesic@gmail.com</p>
              <p><strong>Лозинка за остале:</strong> admin123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;