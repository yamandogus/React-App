import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<OrderSuccess />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
