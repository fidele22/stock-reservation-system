// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import ProductsPage from './pages/ProductsPage';
import ReservationsPage from './pages/ReservationsPage';

export default function App() {
  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
  );
}