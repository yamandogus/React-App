import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearCart } from '../store/features/product';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state: RootState) => state.product);

  const totalPrice = Array.isArray(cart) ? cart.reduce((total, item) => total + item.price * item.quantity, 0) : 0;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [activeStep, setActiveStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const cleaned = value.replace(/\D/g, '');

      if (cleaned.length > 16) return;

      let formatted = '';
      for (let i = 0; i < cleaned.length; i += 4) {
        const chunk = cleaned.slice(i, i + 4);
        formatted += chunk;
        if (i + 4 < cleaned.length) formatted += ' ';
      }

      setFormData({
        ...formData,
        [name]: formatted,
      });
    } else if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 3) {
        setFormData({
          ...formData,
          [name]: cleaned,
        });
      }
    } else if (name === 'expiryDate') {
      let cleaned = value.replace(/\D/g, '');

      if (cleaned.length > 4) return;

      if (cleaned.length > 2) {
        cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
      }

      setFormData({
        ...formData,
        [name]: cleaned,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Ad alanı zorunludur';
    if (!formData.lastName.trim()) newErrors.lastName = 'Soyad alanı zorunludur';
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    if (!formData.address.trim()) newErrors.address = 'Adres alanı zorunludur';
    if (!formData.city.trim()) newErrors.city = 'Şehir alanı zorunludur';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Posta kodu alanı zorunludur';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Kart numarası zorunludur';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = '16 haneli kart numarası giriniz';
    }

    if (!formData.cardName.trim()) newErrors.cardName = 'Kart üzerindeki isim zorunludur';

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Son kullanma tarihi zorunludur';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Geçerli bir son kullanma tarihi giriniz (AA/YY)';
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV zorunludur';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = '3 haneli CVV giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (activeStep === 1 && validateStep1()) {
      setActiveStep(2);
    }
  };

  const handlePrevStep = () => {
    if (activeStep === 2) {
      setActiveStep(1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep === 2 && validateStep2()) {
      setIsSubmitting(true);

      setTimeout(() => {
        setIsSubmitting(false);
        dispatch(clearCart());
        navigate('/success');
      }, 2000);
    }
  };

  if (!Array.isArray(cart) || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
        <p className="mb-6">Ödeme yapmak için sepetinize ürün ekleyin.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Alışverişe Devam Et
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Ödeme</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex mb-6">
              <div
                className={`flex-1 pb-4 text-center border-b-2 ${activeStep === 1 ? 'border-blue-600 text-blue-600 font-medium' : 'border-gray-200'}`}
              >
                1. Teslimat Bilgileri
              </div>
              <div
                className={`flex-1 pb-4 text-center border-b-2 ${activeStep === 2 ? 'border-blue-600 text-blue-600 font-medium' : 'border-gray-200'}`}
              >
                2. Ödeme Bilgileri
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Soyad</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Şehir</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">Posta Kodu</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                      Devam Et
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className={`w-full p-2 border rounded-md ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div>
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded-md ${errors.cardName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        placeholder="AA/YY"
                        className={`w-full p-2 border rounded-md ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="XXX"
                        maxLength={3}
                        className={`w-full p-2 border rounded-md ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="border border-gray-300 bg-white text-gray-700 py-2 px-6 rounded-md hover:bg-gray-50 transition-colors duration-300"
                    >
                      Geri
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          İşleniyor...
                        </span>
                      ) : 'Ödemeyi Tamamla'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>

            <div className="space-y-4 mb-4">
              {Array.isArray(cart) && cart.map(item => (
                <div key={item.id} className="flex items-center">
                  <img src={item.image} alt={item.title} className="w-12 h-12 object-contain mr-3" />
                  <div className="flex-1">
                    <h3 className="text-sm line-clamp-1">{item.title}</h3>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500">{item.quantity} x {item.price.toFixed(2)} TL</span>
                      <span className="text-sm font-medium">{(item.price * item.quantity).toFixed(2)} TL</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Ara Toplam</span>
                <span>{totalPrice.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Kargo</span>
                <span>Ücretsiz</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                <span>Toplam</span>
                <span>{totalPrice.toFixed(2)} TL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
