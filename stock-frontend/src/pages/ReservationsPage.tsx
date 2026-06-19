// src/pages/ReservationsPage.tsx
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {  User, Package, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Reservation {
  id: number;
  user?: { name: string };
  product?: { name: string };
  quantity: number;
  status: 'ACTIVE' | 'EXPIRED' | 'COMPLETED';
  createdAt: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'EXPIRED' | 'COMPLETED'>('ALL');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reservations');
      setReservations(res.data);
    } catch (error) {
      console.error('Failed to load reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const checkout = async (id: number) => {
    try {
      await api.post(`/reservations/${id}/checkout`);
      await load();
    } catch (error) {
      alert('Failed to checkout reservation');
    }
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      ACTIVE: { 
        color: '#10b981', 
        bg: '#d1fae5', 
        icon: Clock,
        label: 'Active'
      },
      EXPIRED: { 
        color: '#ef4444', 
        bg: '#fee2e2', 
        icon: AlertCircle,
        label: 'Expired'
      },
      COMPLETED: { 
        color: '#3b82f6', 
        bg: '#dbeafe', 
        icon: CheckCircle,
        label: 'Completed'
      }
    };
    return configs[status as keyof typeof configs] || configs.ACTIVE;
  };

  const filteredReservations = reservations.filter(
    r => filter === 'ALL' || r.status === filter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all product reservations
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {['ALL', 'ACTIVE', 'COMPLETED', 'EXPIRED'].map((status) => {
          const count = status === 'ALL' 
            ? reservations.length 
            : reservations.filter(r => r.status === status).length;
          const config = status !== 'ALL' ? getStatusConfig(status) : null;
          
          return (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`p-4 rounded-xl border-2 transition-all ${
                filter === status 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {status === 'ALL' ? 'Total' : status.charAt(0) + status.slice(1).toLowerCase()}
                </span>
                {config && <config.icon className={`w-5 h-5`} style={{ color: config.color }} />}
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reservation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-sm font-medium">No reservations found</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </td>
                </tr>
              ) : (
                filteredReservations.map((r) => {
                  const statusConfig = getStatusConfig(r.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{r.id.toString().padStart(4, '0')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {r.user?.name || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {r.product?.name || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-medium">
                          {r.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: statusConfig.bg,
                            color: statusConfig.color
                          }}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </span>
                      </td>
                    
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {r.status === 'ACTIVE' && (
                          <button
                            onClick={() => checkout(r.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Checkout
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}