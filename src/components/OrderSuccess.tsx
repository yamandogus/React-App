import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { cart } = useSelector((state: RootState) => state.product);

  // Eğer sepet boş değilse ve kullanıcı doğrudan bu sayfaya geldiyse ana sayfaya yönlendir
  useEffect(() => {
    if (cart.length > 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Siparişiniz Alındı!</h1>
        <p className="text-gray-600 mb-8">
          Siparişiniz başarıyla alındı. Siparişinizle ilgili detaylar e-posta adresinize gönderilecektir.
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 inline-block"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
