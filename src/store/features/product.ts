import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  cart: CartItem[];
}

const getCartFromLocalStorage = (): CartItem[] => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (Array.isArray(parsedCart)) {
        return parsedCart;
      }
    }
  } catch (error) {
    console.error('Sepet verileri çözümlenirken hata oluştu:', error);
  }
  return [];
};

const saveCartToLocalStorage = (cart: CartItem[]) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Sepet verileri kaydedilirken hata oluştu:', error);
  }
};

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  cart: getCartFromLocalStorage(),
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Ürünler yüklenirken bir hata oluştu');
    }
    return response.json() as Promise<Product[]>;
  }
);

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
      
      saveCartToLocalStorage(state.cart);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(state.cart);
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.cart.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        saveCartToLocalStorage(state.cart);
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.cart.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity === 1) {
          state.cart = state.cart.filter(item => item.id !== action.payload);
        } else {
          item.quantity -= 1;
        }
        saveCartToLocalStorage(state.cart);
      }
    },
    clearCart: (state) => {
      state.cart = [];
      saveCartToLocalStorage(state.cart);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Bir hata oluştu';
      });
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = productSlice.actions;

export default productSlice.reducer;