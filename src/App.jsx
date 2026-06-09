import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceHistory from './pages/InvoiceHistory';
import Reports from './pages/Reports';
import Quotations from './pages/Quotations';
import CreditNotes from './pages/CreditNotes';
import Settings from './pages/Settings';
import { useEffect } from 'react';
import { initializeSettings } from './db/database';

function AppInitializer({ children }) {
  useEffect(() => {
    initializeSettings();
  }, []);
  return children;
}

function App() {
  return (
    <AppProvider>
      <AppInitializer>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/create-invoice" element={<CreateInvoice />} />
              <Route path="/invoices" element={<InvoiceHistory />} />
              <Route path="/invoices/:id" element={<InvoiceHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/quotations" element={<Quotations />} />
              <Route path="/credit-notes" element={<CreditNotes />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppInitializer>
    </AppProvider>
  );
}

export default App;
