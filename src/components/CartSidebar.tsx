import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../store/features/product';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state: RootState) => state.product);
  
  const totalPrice = Array.isArray(cart) ? cart.reduce((total, item) => total + item.price * item.quantity, 0) : 0;

  return (
    <div className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-lg transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Sepetim ({Array.isArray(cart) ? cart.reduce((total, item) => total + item.quantity, 0) : 0} Ürün)</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {!Array.isArray(cart) || cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 text-center">Sepetiniz boş</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center border-b pb-4">
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-contain mr-4" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                    <p className="text-gray-700 font-bold mt-1">{item.price.toFixed(2)} $</p>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                        className="w-8 h-8 flex items-center justify-center border rounded-l-md"
                      >
                        -
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center border-t border-b">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => dispatch(increaseQuantity(item.id))}
                        className="w-8 h-8 flex items-center justify-center border rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-bold">Toplam:</span>
            <span className="font-bold">{totalPrice.toFixed(2)} $</span>
          </div>
          <Link 
            to="/checkout" 
            className={`w-full bg-blue-600 text-white py-3 rounded-md text-center block font-medium ${!Array.isArray(cart) || cart.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            onClick={(e) => {
              if (!Array.isArray(cart) || cart.length === 0) {
                e.preventDefault();
              } else {
                onClose();
              }
            }}
          >
            Siparişi Tamamla
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
