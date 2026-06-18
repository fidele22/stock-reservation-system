// src/components/ProductCard.tsx
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle, CheckCircle, Minus, Plus } from 'lucide-react';

interface User {
  id: number;
  name: string;
}

export default function ProductCard({ product, selectedUser, onRefresh }: any) {
  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState('1'); // 👈 NEW
  const [isReserving, setIsReserving] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, []);

  // Sync input when quantity changes externally
  useEffect(() => {
    setInputValue(String(quantity));
  }, [quantity]);

  const reserve = async (userId: number) => {
    setIsReserving(true);
    try {
      await api.post('/reservations', {
        userId,
        productId: product.id,
        quantity,
      });

      const toast = document.createElement('div');
      toast.className =
        'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
      toast.textContent = '✅ Reservation created successfully!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);

      onRefresh();
      navigate('/reservations');
    } catch (error) {
      alert('Failed to create reservation');
    } finally {
      setIsReserving(false);
    }
  };

  const adjustQuantity = (delta: number) => {
    const newValue = quantity + delta;
    if (newValue >= 1 && newValue <= product.availableStock) {
      setQuantity(newValue);
    }
  };

  const isOutOfStock = product.availableStock === 0;

  const formatPrice = (price: any) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const displayPrice = formatPrice(product.price);

  // 👇 NEW: validate when user finishes typing
  const handleBlur = () => {
    let val = Number(inputValue);

    if (isNaN(val)) val = 1;
    if (val < 1) val = 1;
    if (val > product.availableStock) val = product.availableStock;

    setQuantity(val);
    setInputValue(String(val));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">

      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600 p-4 flex items-start justify-between">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white text-xs font-medium">#{product.id}</span>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white text-xs font-medium">
            {product.availableStock} in stock
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-3">
          {product.name}
        </h3>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-gray-50">
          {isOutOfStock ? (
            <>
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
            </>
          ) : product.availableStock < 5 ? (
            <>
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-600 font-medium">
                Low Stock ({product.availableStock} left)
              </span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">In Stock</span>
            </>
          )}
        </div>

        {/* Quantity Selector */}
        {!isOutOfStock && (
          <div className="flex items-center gap-3 mb-4">
            
            <button
              onClick={() => adjustQuantity(-1)}
              disabled={quantity <= 1}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>

            <input
              type="number"
              min={1}
              max={product.availableStock}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              className="w-16 text-center py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={() => adjustQuantity(1)}
              disabled={quantity >= product.availableStock}
              className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>

          </div>
        )}

        {/* Reserve Button */}
        <button
          onClick={() => {
            if (!selectedUser) {
              alert('Please select a user first');
              return;
            }
            reserve(selectedUser);
          }}
          disabled={isOutOfStock || isReserving}
          className={`
            w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all transform
            ${isOutOfStock 
              ? 'bg-gray-300 cursor-not-allowed' 
              : isReserving
                ? 'bg-blue-400 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          {isReserving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Reserving...
            </span>
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Reserve
            </span>
          )}
        </button>

        {selectedUser && !isOutOfStock && (
          <p className="mt-2 text-xs text-gray-500 text-center">
            Reserving for{' '}
            <span className="font-medium text-gray-700">
              {users.find(u => u.id === selectedUser)?.name || 'Selected User'}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}