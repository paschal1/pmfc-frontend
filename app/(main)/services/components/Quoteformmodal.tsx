'use client';

import { useState, useEffect } from 'react';
import * as quoteApi from '../../../services/quoteApi.service';
import * as serviceApi from '../../../services/serviceApi.service';
import apiClient from '../../../services/api'; // ← Shared authenticated client
import { X, Loader2 } from 'lucide-react';

interface QuoteFormModalProps {
  serviceId?: number;
  isOpen: boolean;
  onClose: () => void;
}

interface State {
  id: number;
  name: string;
}

const QuoteFormModal = ({ serviceId, isOpen, onClose }: QuoteFormModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    message: '',
    areasize: '',
    squarefeet: '',
    state_id: '',
    location: '',
    budget: '',
    services: serviceId ? [serviceId] : [] as number[],
  });

  const [services, setServices] = useState<any[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const budgetOptions = [
    'Below 500k',
    '500k - 1m',
    '1m - 5m',
    '5m - 10m',
    'Above 10m',
  ];

  // Load services and states when modal opens
  useEffect(() => {
    if (!isOpen) {
      // Reset form when closed
      setFormData({
        email: '',
        name: '',
        phone: '',
        message: '',
        areasize: '',
        squarefeet: '',
        state_id: '',
        location: '',
        budget: '',
        services: serviceId ? [serviceId] : [],
      });
      setSuccess('');
      setError('');
      setFieldErrors({});
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch services
        try {
          setServicesLoading(true);
          const servicesRes = await serviceApi.getServices();
          setServices(servicesRes.data || []);
        } catch (err) {
          console.error('Error loading services:', err);
          setError('Failed to load services');
        } finally {
          setServicesLoading(false);
        }

        // Fetch states using authenticated apiClient
        try {
          setStatesLoading(true);
          const statesRes = await apiClient.get('/states');
          setStates(statesRes.data || []);
          console.log('States loaded:', statesRes.data);
        } catch (err: any) {
          console.error('Error loading states:', err);
          setError('Failed to load states. Please try again.');
          setStates([]); // Clear states on error
        } finally {
          setStatesLoading(false);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isOpen, serviceId]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceChange = (serviceId: number) => {
    setFormData((prev) => {
      const current = prev.services;
      if (current.includes(serviceId)) {
        return { ...prev, services: current.filter((id) => id !== serviceId) };
      }
      return { ...prev, services: [...current, serviceId] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    setFieldErrors({});

    try {
      const submitData: quoteApi.QuoteFormData = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        areasize: parseFloat(formData.areasize),
        squarefeet: parseFloat(formData.squarefeet),
        state_id: parseInt(formData.state_id),
        location: formData.location.trim(),
        budget: formData.budget,
        services: formData.services,
      };

      // Client-side validation
      const errors: Record<string, string> = {};
      if (!submitData.name) errors.name = 'Name is required';
      if (!submitData.email || !submitData.email.includes('@')) errors.email = 'Valid email required';
      if (!submitData.phone) errors.phone = 'Phone is required';
      if (!submitData.location) errors.location = 'Location is required';
      if (isNaN(submitData.areasize) || submitData.areasize <= 0) errors.areasize = 'Valid area size required';
      if (isNaN(submitData.squarefeet) || submitData.squarefeet <= 0) errors.squarefeet = 'Valid square feet required';
      if (isNaN(submitData.state_id) || submitData.state_id <= 0) errors.state_id = 'Please select a state';
      if (!submitData.budget) errors.budget = 'Please select a budget';
      if (submitData.services.length === 0) errors.services = 'Select at least one service';

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setSubmitting(false);
        return;
      }

      await quoteApi.submitQuote(submitData);
      setSuccess('Quote request submitted successfully! Check your email for details.');

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Submission error:', err);
      if (err.errors) {
        setFieldErrors(err.errors);
      } else {
        setError(err.message || 'Failed to submit quote request');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-6">
            <h2 className="text-2xl font-bold text-gray-800">Request a Quote</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-10 h-10 animate-spin text-[#fab702]" />
                <p className="mt-4 text-gray-600">Loading form data...</p>
              </div>
            ) : success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <p className="text-green-800 font-semibold text-lg mb-2">Success!</p>
                <p className="text-green-700">{success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] ${
                          fieldErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Your name"
                        required
                      />
                      {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] ${
                          fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="your@email.com"
                        required
                      />
                      {fieldErrors.email && <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] ${
                          fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+234 800 000 0000"
                        required
                      />
                      {fieldErrors.phone && <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">State *</label>
                      <select
                        name="state_id"
                        value={formData.state_id}
                        onChange={handleChange}
                        disabled={statesLoading}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] ${
                          fieldErrors.state_id ? 'border-red-500' : 'border-gray-300'
                        } disabled:opacity-50`}
                        required
                      >
                        <option value="">
                          {statesLoading ? 'Loading states...' : 'Select a state'}
                        </option>
                        {states.map((state) => (
                          <option key={state.id} value={state.id}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.state_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.state_id}</p>}
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Location/Address *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] ${
                          fieldErrors.location ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Project address"
                        required
                      />
                      {fieldErrors.location && <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Area Size (m²) *</label>
                        <input
                          type="number"
                          name="areasize"
                          value={formData.areasize}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] ${
                            fieldErrors.areasize ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 100"
                          step="0.1"
                          min="0.1"
                          required
                        />
                        {fieldErrors.areasize && <p className="text-red-500 text-sm mt-1">{fieldErrors.areasize}</p>}
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Square Feet *</label>
                        <input
                          type="number"
                          name="squarefeet"
                          value={formData.squarefeet}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] ${
                            fieldErrors.squarefeet ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="e.g., 1000"
                          step="0.1"
                          min="0.1"
                          required
                        />
                        {fieldErrors.squarefeet && <p className="text-red-500 text-sm mt-1">{fieldErrors.squarefeet}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Budget Range *</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702] ${
                          fieldErrors.budget ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                      >
                        <option value="">Select budget range</option>
                        {budgetOptions.map((budget) => (
                          <option key={budget} value={budget}>
                            {budget}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.budget && <p className="text-red-500 text-sm mt-1">{fieldErrors.budget}</p>}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Message (Optional)</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fab702]"
                        placeholder="Tell us more about your project..."
                      />
                    </div>
                  </div>
                </div>

                {/* Services Selection */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Services *</h3>
                  {fieldErrors.services && <p className="text-red-500 text-sm mb-3">{fieldErrors.services}</p>}
                  {servicesLoading ? (
                    <p className="text-gray-600 py-4">Loading services...</p>
                  ) : services.length === 0 ? (
                    <p className="text-gray-600">No services available</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {services.map((service) => (
                        <label
                          key={service.id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service.id)}
                            onChange={() => handleServiceChange(service.id)}
                            className="w-4 h-4 accent-[#fab702] rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{service.title}</p>
                            <p className="text-sm text-gray-600">{serviceApi.formatPrice(service)}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* General Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || loading}
                    className="flex-1 px-6 py-3 bg-[#fab702] text-black font-semibold rounded-lg hover:opacity-90 disabled:opacity-70 transition flex items-center justify-center gap-2"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {submitting ? 'Submitting...' : 'Submit Quote Request'}
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

export default QuoteFormModal;