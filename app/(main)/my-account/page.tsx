'use client';

import React, { useState, useEffect } from 'react';
import { GrCircleInformation } from 'react-icons/gr';
import { AiOutlineHistory } from 'react-icons/ai';
import { LiaDigitalTachographSolid } from 'react-icons/lia';
import { Heart, ArrowLeft, User, Mail, Phone, MapPin, Calendar, Package, Shield, Eye, EyeOff, Loader, Trash2, X } from 'lucide-react';
import { Parallax } from 'react-parallax';
import { FaCheck } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import Image from 'next/image';
import * as accountApi from '../../services/accountapi.service';

// Order statuses in sequence
const ORDER_STATUSES = [
  { key: 'order_processing', label: 'Order Processing' },
  { key: 'pre_production', label: 'Pre-Production' },
  { key: 'in_production', label: 'In Production' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

const AccountDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<accountApi.Order | null>(null);
  const [userData, setUserData] = useState<accountApi.User | null>(null);
  const [orders, setOrders] = useState<accountApi.Order[]>([]);
  const [wishlist, setWishlist] = useState<accountApi.WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit profile modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<accountApi.User>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState<string | null>(null);

  // Password change state
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const results = await Promise.allSettled([
          accountApi.getCurrentUser(),
          accountApi.getUserOrders(),
          accountApi.getUserWishlist(),
        ]);

        const [userResult, ordersResult, wishlistResult] = results;

        if (userResult.status === 'fulfilled') {
          setUserData(userResult.value);
          setEditFormData(userResult.value);
        } else {
          setError('Failed to load user data');
        }

        if (ordersResult.status === 'fulfilled') {
          setOrders(ordersResult.value);
        } else {
          setOrders([]);
        }

        if (wishlistResult.status === 'fulfilled') {
          setWishlist(wishlistResult.value);
        } else {
          setWishlist([]);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load account data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle profile update
  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setEditLoading(true);
      setEditMessage(null);

      const profileData = {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        address: editFormData.address
      };

      const updatedUser = await accountApi.updateUserProfile(profileData);
      
      setUserData(updatedUser);
      setEditMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setShowEditModal(false);
        setEditMessage(null);
      }, 2000);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setEditMessage(`${errorMsg}`);
    } finally {
      setEditLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage('Password must be at least 8 characters');
      return;
    }

    try {
      setEditLoading(true);
      setPasswordMessage(null);

      await accountApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordMessage('Password changed successfully!');
      
      setTimeout(() => {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordFields(false);
        setPasswordMessage(null);
      }, 2000);

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to change password';
      setPasswordMessage(`${errorMsg}`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditMessage(null);
    setPasswordMessage(null);
    setShowPasswordFields(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    if (userData) {
      setEditFormData(userData);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#fab702] animate-spin mx-auto mb-4" />
          <p className="text-white">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#fab702] text-black rounded-lg font-bold hover:opacity-75 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const DashboardPage = () => (
    <div className="min-h-screen bg-black">
      <Parallax
        strength={300}
        className="h-[230px] w-full bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/account-bg.jpg'}
      >
        <div className="lg:ml-20 ml-10">
          <h1 className="font-bold text-3xl text-white">My Account</h1>
        </div>
      </Parallax>
      
      <div className="h-[230px] w-full lg:hidden block relative">
        <img
          src={'/account-bg.jpg'}
          alt="Account banner"
          className="h-full w-full object-cover"
        />
        <h1 className="font-bold text-3xl text-white z-10 absolute top-24 left-3">
          Your Account
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AccountCard
            icon={<GrCircleInformation className="w-8 h-8" />}
            title="Information"
            description="View and edit your personal details"
            onClick={() => setCurrentPage('information')}
          />
          <AccountCard
            icon={<AiOutlineHistory className="w-8 h-8" />}
            title="Order History"
            description={`Track your ${orders.length} orders`}
            onClick={() => setCurrentPage('history')}
          />
          <AccountCard
            icon={<LiaDigitalTachographSolid className="w-8 h-8" />}
            title="Download My Data"
            description="Export your personal information"
            onClick={() => setCurrentPage('gdpr')}
          />
          <AccountCard
            icon={<Heart className="w-8 h-8" />}
            title="My Wishlists"
            description={`${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved`}
            onClick={() => setCurrentPage('wishlist')}
            highlight
          />
        </div>
      </div>
    </div>
  );

  const AccountCard = ({ icon, title, description, onClick, highlight }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    onClick: () => void; 
    highlight?: boolean 
  }) => (
    <button
      onClick={onClick}
      className={`bg-gray-900 border ${highlight ? 'border-[#fab702]' : 'border-gray-800'} rounded-lg hover:border-[#fab702] transition-all duration-500 ease-in-out p-8 text-left group`}
    >
      <div className={`inline-flex p-3 rounded-lg mb-4 ${
        highlight ? 'bg-[#fab702]/20 text-[#fab702]' : 'bg-gray-800 text-gray-400 group-hover:text-[#fab702]'
      } transition-colors duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </button>
  );

  const PageHeader = ({ title, icon }: { title: string; icon: React.ReactNode }) => (
    <div>
      <Parallax
        strength={300}
        className="h-[230px] w-full bg-cover bg-center lg:flex hidden items-center"
        bgImage={'/account-bg.jpg'}
      >
        <div className="lg:ml-20 ml-10 flex flex-col">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center space-x-2 text-white/80 hover:text-[#fab702] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-lg">{icon}</div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
          </div>
        </div>
      </Parallax>
      
      <div className="h-[230px] w-full lg:hidden block relative">
        <img
          src={'/account-bg.jpg'}
          alt="Page banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute top-10 left-3 flex flex-col z-10">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className="flex items-center space-x-2 text-white/80 hover:text-[#fab702] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
      </div>
    </div>
  );

  const EditProfileModal = () => {
    if (!showEditModal) return null;

    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleCloseEditModal}
        ></div>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {editMessage && (
                <div className={`p-4 rounded-lg text-sm ${
                  editMessage.includes('successfully')
                    ? 'bg-green-900/30 text-green-400 border border-green-700'
                    : 'bg-red-900/30 text-red-400 border border-red-700'
                }`}>
                  {editMessage}
                </div>
              )}

              {!showPasswordFields ? (
                <form onSubmit={handleEditProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name || ''}
                      onChange={handleEditInputChange}
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#fab702] transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email || ''}
                      onChange={handleEditInputChange}
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#fab702] transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone || ''}
                      onChange={handleEditInputChange}
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#fab702] transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address || ''}
                      onChange={handleEditInputChange}
                      className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#fab702] transition-colors"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="w-full px-4 py-2 bg-[#fab702] text-black rounded-lg font-semibold hover:opacity-75 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {editLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(true)}
                      className="w-full px-4 py-2 border border-gray-800 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Change Password
                    </button>

                    <button
                      type="button"
                      onClick={handleCloseEditModal}
                      className="w-full px-4 py-2 border border-gray-800 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordMessage && (
                    <div className={`p-4 rounded-lg text-sm ${
                      passwordMessage.includes('successfully')
                        ? 'bg-green-900/30 text-green-400 border border-green-700'
                        : 'bg-red-900/30 text-red-400 border border-red-700'
                    }`}>
                      {passwordMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-[#fab702] transition-colors"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-[#fab702] transition-colors"
                        placeholder="Enter new password (min 8 characters)"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 pr-10 text-white focus:outline-none focus:border-[#fab702] transition-colors"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="w-full px-4 py-2 bg-[#fab702] text-black rounded-lg font-semibold hover:opacity-75 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {editLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
                      {editLoading ? 'Changing...' : 'Change Password'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordFields(false);
                        setPasswordData({
                          currentPassword: '',
                          newPassword: '',
                          confirmPassword: ''
                        });
                        setPasswordMessage(null);
                      }}
                      className="w-full px-4 py-2 border border-gray-800 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Back to Profile
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const InformationPage = () => (
    <div className="min-h-screen bg-black">
      <PageHeader title="Personal Information" icon={<User className="w-8 h-8" />} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="space-y-6">
            {userData && (
              <>
                <InfoField icon={<User />} label="Full Name" value={userData.name} />
                <InfoField icon={<Mail />} label="Email Address" value={userData.email} />
                <InfoField icon={<Phone />} label="Phone Number" value={userData.phone || 'Not provided'} />
                <InfoField icon={<MapPin />} label="Address" value={userData.address || 'Not provided'} />
                <InfoField 
                  icon={<Calendar />} 
                  label="Member Since" 
                  value={new Date(userData.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} 
                />
              </>
            )}
          </div>
          <button 
            onClick={() => setShowEditModal(true)}
            className="mt-8 w-full bg-[#fab702] text-black py-3 rounded-lg font-bold hover:opacity-75 transition-all duration-500"
          >
            Edit Information
          </button>
        </div>
      </div>

      <EditProfileModal />
    </div>
  );

  const InfoField = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start space-x-4 p-4 bg-black border border-gray-800 rounded-lg">
      <div className="text-[#fab702] mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );

  const HistoryPage = () => {
    const getStatusDisplay = (status: string) => {
      switch(status) {
        case 'delivered':
          return { text: 'Delivered', classes: 'bg-green-900/30 text-green-400 border border-green-700' };
        case 'shipped':
          return { text: 'Shipped', classes: 'bg-blue-900/30 text-blue-400 border border-blue-700' };
        case 'in_production':
          return { text: 'In Production', classes: 'bg-[#fab702]/20 text-[#fab702] border border-[#fab702]' };
        default:
          return { text: 'Processing', classes: 'bg-gray-700/30 text-gray-400 border border-gray-600' };
      }
    };

    return (
      <div className="min-h-screen bg-black">
        <PageHeader title="Order History" icon={<Package className="w-8 h-8" />} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {orders.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Orders Yet</h3>
              <p className="text-gray-400">You haven&rsquo;t placed any orders yet. Start shopping now!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusDisplay = getStatusDisplay(order.status);
                return (
                  <div key={order.order_id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-[#fab702] transition-all duration-500">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-bold text-white">{order.id}</h3>
                        <p className="text-sm text-gray-400">{order.productName}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{order.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Package className="w-4 h-4" />
                            <span>{order.items} items</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex flex-col items-start sm:items-end">
                          <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${statusDisplay.classes}`}>
                            {statusDisplay.text}
                          </span>
                          <span className="text-2xl font-bold text-[#fab702] mt-2">{order.total}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setCurrentPage('tracking');
                          }}
                          className="px-4 py-2 bg-[#fab702] text-black rounded-lg font-semibold hover:opacity-75 transition-all duration-500 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Track Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  const OrderTrackingPage = () => {
    if (!selectedOrder) return null;

    const getCurrentStatusIndex = () => {
      return ORDER_STATUSES.findIndex((s) => s.key === selectedOrder.status);
    };

    const currentStatusIndex = getCurrentStatusIndex();
    const isCanceled = selectedOrder.status === 'canceled';

    return (
      <div className="min-h-screen bg-black">
        <PageHeader title="Order Tracking" icon={<Package className="w-8 h-8" />} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg flex items-center justify-center text-6xl flex-shrink-0 border border-gray-700">
                {selectedOrder.productImage}
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3">
                  {selectedOrder.productName}
                </h2>
                <div className="space-y-2 text-gray-400">
                  <p>
                    <span className="text-gray-500">Order Number:</span>{' '}
                    <span className="text-white font-semibold">{selectedOrder.id}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Tracking Number:</span>{' '}
                    <span className="text-white font-semibold">{selectedOrder.trackingNumber}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Order Date:</span>{' '}
                    <span className="text-white">{selectedOrder.date}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Total Amount:</span>{' '}
                    <span className="text-[#fab702] font-bold text-lg">{selectedOrder.total}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* FIXED: Replaced 'We'll' with 'We&rsquo;ll' */}
            <div className={`mt-6 p-4 border-l-4 rounded ${
              isCanceled 
                ? 'bg-red-900/20 border-red-500' 
                : currentStatusIndex === ORDER_STATUSES.length - 1
                ? 'bg-green-900/20 border-green-500'
                : 'bg-[#fab702]/10 border-[#fab702]'
            }`}>
              <p className="text-white">
                {isCanceled
                  ? 'This order has been canceled.'
                  : currentStatusIndex === ORDER_STATUSES.length - 1
                  ? 'Your order has been delivered. Enjoy your purchase!'
                  : currentStatusIndex >= 3
                  ? 'Your item is on the way. Track its progress below.'
                  : 'Your order is being prepared. We&rsquo;ll notify you of any updates.'}
              </p>
            </div>
          </div>

          {/* Rest of the component remains unchanged */}
          {!isCanceled && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-8">Delivery Progress</h2>

              <div className="hidden md:block">
                <div className="relative">
                  <div className="absolute top-6 left-0 right-0 h-1 bg-gray-700">
                    <div
                      className="h-full bg-[#fab702] transition-all duration-500"
                      style={{
                        width: `${(currentStatusIndex / (ORDER_STATUSES.length - 1)) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="relative flex justify-between">
                    {ORDER_STATUSES.map((status, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;

                      return (
                        <div key={status.key} className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                              isCompleted
                                ? 'bg-[#fab702] border-[#fab702] text-black'
                                : 'bg-gray-900 border-gray-700 text-gray-500'
                            } ${isCurrent ? 'ring-4 ring-[#fab702] ring-opacity-30 scale-110' : ''}`}
                          >
                            {isCompleted ? (
                              <FaCheck className="w-5 h-5" />
                            ) : (
                              <span className="font-semibold">{index + 1}</span>
                            )}
                          </div>

                          <div className="mt-3 text-center max-w-[120px]">
                            <p
                              className={`text-sm font-semibold ${
                                isCompleted ? 'text-white' : 'text-gray-500'
                              }`}
                            >
                              {status.label}
                            </p>
                            {isCurrent && (
                              <p className="text-xs text-[#fab702] mt-1 flex items-center gap-1 justify-center">
                                <IoMdTime /> Current
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="md:hidden space-y-4">
                {ORDER_STATUSES.map((status, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  return (
                    <div key={status.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                            isCompleted
                              ? 'bg-[#fab702] border-[#fab702] text-black'
                              : 'bg-gray-900 border-gray-700 text-gray-500'
                          } ${isCurrent ? 'ring-4 ring-[#fab702] ring-opacity-30' : ''}`}
                        >
                          {isCompleted ? (
                            <FaCheck className="w-4 h-4" />
                          ) : (
                            <span className="font-semibold text-sm">{index + 1}</span>
                          )}
                        </div>
                        {index < ORDER_STATUSES.length - 1 && (
                          <div
                            className={`w-1 h-12 ${
                              isCompleted ? 'bg-[#fab702]' : 'bg-gray-700'
                            }`}
                          ></div>
                        )}
                      </div>

                      <div className="flex-1 pt-2">
                        <p
                          className={`font-semibold ${
                            isCompleted ? 'text-white' : 'text-gray-500'
                          }`}
                        >
                          {status.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-[#fab702] mt-1 flex items-center gap-1">
                            <IoMdTime /> Current Status
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-6">Shipping Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#fab702] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Delivery Address</p>
                  <p className="text-white font-medium">{userData?.address || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#fab702] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Contact Number</p>
                  <p className="text-white font-medium">{userData?.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-[#fab702] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Expected Delivery</p>
                  <p className="text-white font-medium">
                    {selectedOrder.status === 'delivered' ? 'Delivered on ' + selectedOrder.date : '3-5 Business Days'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const GDPRPage = () => {
    const [gdprLoading, setGdprLoading] = useState(false);
    const [gdprMessage, setGdprMessage] = useState<string | null>(null);

    const handleDownloadData = async () => {
      try {
        setGdprLoading(true);
        setGdprMessage(null);

        const dataToDownload = {
          user: userData,
          orders: orders,
          wishlist: wishlist,
          exportedAt: new Date().toISOString(),
        };

        const jsonString = JSON.stringify(dataToDownload, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        setGdprMessage('Your data has been downloaded successfully!');
      } catch (err) {
        setGdprMessage('' + (err instanceof Error ? err.message : 'Failed to download data'));
      } finally {
        setGdprLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-black">
        <PageHeader title="Download My Data" icon={<Shield className="w-8 h-8" />} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Personal Data</h2>
            <p className="text-gray-400 mb-6">
              Download a copy of all your personal information including your profile, orders, and wishlist items.
            </p>
            
            {gdprMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                gdprMessage.includes('successfully')
                  ? 'bg-green-900/30 text-green-400 border border-green-700'
                  : 'bg-red-900/30 text-red-400 border border-red-700'
              }`}>
                {gdprMessage}
              </div>
            )}

            <div className="bg-black border border-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-white font-bold mb-4">Your data includes:</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-[#fab702]">✓</span>
                  Personal information (name, email, phone, address)
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#fab702]">✓</span>
                  Order history and details
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#fab702]">✓</span>
                  Wishlist items
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#fab702]">✓</span>
                  Export timestamp
                </li>
              </ul>
            </div>

            <button 
              onClick={handleDownloadData}
              disabled={gdprLoading}
              className="w-full bg-[#fab702] text-black py-3 rounded-lg font-bold hover:opacity-75 transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {gdprLoading ? <Loader className="w-4 h-4 animate-spin" /> : null}
              {gdprLoading ? 'Preparing Download...' : 'Download My Data'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const WishlistPage = () => {
    const [wishlistLoading, setWishlistLoading] = useState<number | null>(null);

    const handleRemoveFromWishlist = async (id: number) => {
      try {
        setWishlistLoading(id);
        await accountApi.removeFromWishlist(id);
        setWishlist(wishlist.filter(item => item.id !== id));
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to remove item');
      } finally {
        setWishlistLoading(null);
      }
    };

    return (
      <div className="min-h-screen bg-black">
        <PageHeader title="My Wishlist" icon={<Heart className="w-8 h-8" />} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {wishlist.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
              <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h3>
              <p className="text-gray-400">Add items to your wishlist to save them for later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-[#fab702] transition-all duration-500">
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl">
                    {item.product_image || 'Gift'}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{item.product_name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.product_description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#fab702]">{item.product_price}</span>
                      <button 
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        disabled={wishlistLoading === item.id}
                        className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-all duration-500 disabled:opacity-50 flex items-center gap-2"
                      >
                        {wishlistLoading === item.id ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'information':
        return <InformationPage />;
      case 'history':
        return <HistoryPage />;
      case 'tracking':
        return <OrderTrackingPage />;
      case 'gdpr':
        return <GDPRPage />;
      case 'wishlist':
        return <WishlistPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderPage()}
      <footer className="bg-black border-t border-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 Your Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AccountDashboard;