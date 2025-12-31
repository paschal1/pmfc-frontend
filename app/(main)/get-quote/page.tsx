'use client';

import { FaHome, FaCheck, FaExpandArrowsAlt, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { Parallax } from 'react-parallax';
import { useState, useEffect } from 'react';
import SecondaryFooter from '../components/SecondaryFooter';
import * as quoteApi from '../../services/quoteApi.service';
import * as serviceApi from '../../services/serviceApi.service';
import { Loader } from 'lucide-react';
import apiClient from '../../services/api'; // ← NEW: shared authenticated client

interface State {
  id: number;
  name: string;
}

const Page = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [statesLoading, setStatesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [services, setServices] = useState<any[]>([]);
  const [states, setStates] = useState<State[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    areasize: '',
    unit: 'sqft',
    budget: 'budget-friendly',
    state_id: '',
    services: [] as number[],
  });

  const budgetMap = {
    'budget-friendly': 'Below 500k',
    'mid-range': '1m - 5m',
    'high-end': 'Above 10m',
  };

  const images = [
    { src: '/res-img.jpg', label: 'Residential', key: 'residential' },
    { src: '/off-img.jpg', label: 'Office', key: 'office' },
    { src: '/comm-img.jpg', label: 'Commercial', key: 'commercial' },
    { src: '/ret-img.jpg', label: 'Retail', key: 'retail' },
    { src: '/other-img.jpg', label: 'Other', key: 'other' },
  ];

  // Fetch services and states on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch services
      try {
        setServicesLoading(true);
        const response = await serviceApi.getServices();
        setServices(response.data || []);
        console.log('Services loaded:', response.data);
      } catch (err) {
        console.error('Error loading services:', err);
        setError('Failed to load services');
      } finally {
        setServicesLoading(false);
      }

      // Fetch states – now using authenticated apiClient
      try {
        setStatesLoading(true);
        const response = await apiClient.get('/states');
        setStates(response.data || []);
        console.log('States loaded:', response.data);
      } catch (err: any) {
        console.error('Error loading states:', err);
        // You can optionally show a message, but states are critical here
        setError('Failed to load states. Please try again later.');
      } finally {
        setStatesLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelect = (property: string) => {
    setSelectedProperty(property);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleServiceChange = (serviceId: number) => {
    setFormData((prev) => {
      const currentServices = prev.services;
      if (currentServices.includes(serviceId)) {
        return {
          ...prev,
          services: currentServices.filter((id) => id !== serviceId),
        };
      } else {
        return {
          ...prev,
          services: [...currentServices, serviceId],
        };
      }
    });
    if (fieldErrors.services && formData.services.length > 0) {
      setFieldErrors((prev) => ({
        ...prev,
        services: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');
    setFieldErrors({});

    try {
      const newErrors: Record<string, string> = {};

      if (!selectedProperty) newErrors.property = 'Please select a property type';
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.areasize || parseFloat(formData.areasize) <= 0) newErrors.areasize = 'Area size must be a positive number';
      if (!formData.state_id) newErrors.state_id = 'Please select a state';
      if (formData.services.length === 0) newErrors.services = 'Please select at least one service';

      if (Object.keys(newErrors).length > 0) {
        setFieldErrors(newErrors);
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      let areaSizeInSqft = parseFloat(formData.areasize);
      if (formData.unit === 'm') {
        areaSizeInSqft = areaSizeInSqft * 10.764;
      }

      const submitData: quoteApi.QuoteFormData = {
        email: formData.email.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        areasize: areaSizeInSqft,
        squarefeet: areaSizeInSqft,
        state_id: parseInt(formData.state_id),
        location: selectedProperty || 'Property Renovation',
        budget: budgetMap[formData.budget as keyof typeof budgetMap],
        services: formData.services,
      };

      console.log('Submitting quote:', submitData);

      const response = await quoteApi.submitQuote(submitData);

      setSuccess('Quote request submitted successfully! Check your email for details.');

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        areasize: '',
        unit: 'sqft',
        budget: 'budget-friendly',
        state_id: '',
        services: [],
      });
      setSelectedProperty(null);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission error:', err);
      if (err.errors) {
        setFieldErrors(err.errors);
      }
      setError(err.message || 'Failed to submit quote request');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-[rgb(24,25,27)] min-h-screen">
      {/* Header Parallax */}
      <Parallax
        strength={300}
        className="h-[200px] sm:h-[230px] w-full bg-cover bg-center hidden lg:flex items-center"
        bgImage={'/quote-img.jpg'}
      >
        <h1 className="uppercase text-2xl sm:text-3xl lg:text-4xl text-white ml-4 sm:ml-10 lg:ml-20">
          Renovation Budgeting
        </h1>
      </Parallax>

      {/* Mobile Header */}
      <div className="h-[180px] sm:h-[200px] w-full lg:hidden block relative">
        <img src={'/quote-img.jpg'} alt="Renovation" className="h-full w-full object-cover" />
        <h1 className="font-bold uppercase text-xl sm:text-2xl text-white z-10 absolute top-16 sm:top-20 left-3 sm:left-4">
          Renovation Budgeting
        </h1>
      </div>

      {/* Messages */}
      {success && (
        <div className="mt-6 mx-auto w-full max-w-2xl px-4 sm:px-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-green-800 font-semibold mb-2">✅ Success!</p>
            <p className="text-green-700 text-sm sm:text-base">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 mx-auto w-full max-w-2xl px-4 sm:px-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-red-800 font-semibold mb-2">❌ Error</p>
            <p className="text-red-700 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      )}

      {fieldErrors.property && (
        <div className="mt-4 mx-auto text-red-500 text-sm text-center px-4">
          {fieldErrors.property}
        </div>
      )}

      {/* Property Type Section */}
      <div className="flex items-center justify-center mt-10 sm:mt-16 lg:mt-20 gap-3 px-4">
        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#FAB70233] flex items-center justify-center">
          <FaHome className="text-[#fab702] h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <p className="text-white text-sm sm:text-base md:text-lg">What is your property type</p>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mt-8 sm:mt-10 lg:mt-10 gap-3 sm:gap-4 px-4 sm:px-6 max-w-4xl mx-auto">
        {images.map((image) => (
          <div
            key={image.key}
            className="flex flex-col items-center gap-2 cursor-pointer"
            onClick={() => handleSelect(image.key)}
          >
            <div
              className={`w-full aspect-square relative transition-all duration-300 ${
                selectedProperty === image.key ? 'border-4 sm:border-6 border-yellow-500' : ''
              }`}
            >
              <img src={image.src} alt={image.label} className="w-full h-full object-cover" />
              <FaCheck
                className={`absolute top-1 sm:top-2 left-1 sm:left-2 h-4 w-4 sm:h-5 sm:w-5 font-bold ${
                  selectedProperty === image.key ? 'text-yellow-500' : 'text-[#888888]'
                }`}
              />
            </div>
            <h1
              className={`text-xs sm:text-sm md:text-base font-semibold text-center ${
                selectedProperty === image.key ? 'text-yellow-500' : 'text-[#BBBBBB]'
              }`}
            >
              {image.label}
            </h1>
          </div>
        ))}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="flex flex-col mt-8 sm:mt-12 w-full px-4 sm:px-6 pb-10">
        <div className="flex flex-col gap-6">
          {/* Area Size */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#FAB70233] flex items-center justify-center flex-shrink-0">
                <FaExpandArrowsAlt className="text-[#fab702] h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-white text-sm sm:text-base md:text-lg">
                Total area size you want to renovate
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                name="areasize"
                value={formData.areasize}
                onChange={handleInputChange}
                placeholder="Area Size"
                step="0.1"
                min="0.1"
                className={`w-full sm:w-40 focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border ${
                  fieldErrors.areasize ? 'border-red-500' : 'border-[#FFFFFF33]'
                } px-3 sm:px-4 py-2 text-white font-semibold text-sm sm:text-base`}
              />
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full sm:w-40 focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border border-[#FFFFFF33] px-3 sm:px-4 py-2 text-white font-semibold text-sm sm:text-base"
              >
                <option value="sqft" className="text-black font-semibold">
                  Square Feet (sqft)
                </option>
                <option value="m" className="text-black font-semibold">
                  Meter (m)
                </option>
                <option value="ft" className="text-black font-semibold">
                  Feet (ft)
                </option>
              </select>
            </div>
            {fieldErrors.areasize && <p className="text-red-500 text-xs sm:text-sm">{fieldErrors.areasize}</p>}
          </div>

          {/* State Selection */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#FAB70233] flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-[#fab702] h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-white text-sm sm:text-base md:text-lg">Select your state</p>
            </div>
            <div>
              <select
                name="state_id"
                value={formData.state_id}
                onChange={handleInputChange}
                disabled={statesLoading}
                className={`w-full focus:outline-none font-semibold placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border ${
                  fieldErrors.state_id ? 'border-red-500' : 'border-[#FFFFFF33]'
                } px-3 sm:px-4 py-2 text-white text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="" className="text-black">
                  {statesLoading ? 'Loading states...' : 'Select a state'}
                </option>
                {states.map((state) => (
                  <option key={state.id} value={state.id} className="text-black font-semibold">
                    {state.name}
                  </option>
                ))}
              </select>
              {fieldErrors.state_id && (
                <p className="text-red-500 text-xs sm:text-sm mt-1">{fieldErrors.state_id}</p>
              )}
            </div>
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#FAB70233] flex items-center justify-center flex-shrink-0">
                <FaExpandArrowsAlt className="text-[#fab702] h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-white text-sm sm:text-base md:text-lg">Select renovation budget</p>
            </div>
            <select
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full focus:outline-none font-semibold placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border border-[#FFFFFF33] px-3 sm:px-4 py-2 text-white text-sm sm:text-base"
            >
              <option value="budget-friendly" className="text-black font-semibold">
                Budget Friendly (Below 500k)
              </option>
              <option value="mid-range" className="text-black font-semibold">
                Mid Range (1m - 5m)
              </option>
              <option value="high-end" className="text-black font-semibold">
                High end (Above 10m)
              </option>
            </select>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#FAB70233] flex items-center justify-center flex-shrink-0">
                <FaExpandArrowsAlt className="text-[#fab702] h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-white text-sm sm:text-base md:text-lg">Select services</p>
            </div>

            {fieldErrors.services && <p className="text-red-500 text-xs sm:text-sm">{fieldErrors.services}</p>}

            {servicesLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="w-5 h-5 animate-spin text-[#fab702]" />
                <p className="text-gray-400 text-xs sm:text-sm ml-2">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <p className="text-gray-400 text-sm">No services available</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-start gap-3 p-3 sm:p-4 border border-[#FFFFFF33] rounded-lg hover:bg-[rgba(250,183,2,0.05)] cursor-pointer transition-all duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.id)}
                      onChange={() => handleServiceChange(service.id)}
                      className="w-4 h-4 sm:w-5 sm:h-5 mt-1 accent-[#fab702] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-xs sm:text-sm">{service.title}</h4>
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">{service.description}</p>
                      <p className="text-[#fab702] text-xs sm:text-sm font-bold mt-2">
                        {serviceApi.formatPrice(service)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#FAB70233] flex items-center justify-center flex-shrink-0">
                <FaUser className="text-[#fab702] h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <p className="text-white text-sm sm:text-base md:text-lg">Enter your details</p>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className={`w-full focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border ${
                    fieldErrors.name ? 'border-red-500' : 'border-[#FFFFFF33]'
                  } px-3 sm:px-4 py-2 text-white font-semibold text-sm sm:text-base`}
                />
                {fieldErrors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{fieldErrors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email"
                  className={`w-full focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border ${
                    fieldErrors.email ? 'border-red-500' : 'border-[#FFFFFF33]'
                  } px-3 sm:px-4 py-2 text-white font-semibold text-sm sm:text-base`}
                />
                {fieldErrors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{fieldErrors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone"
                  className={`w-full focus:outline-none placeholder:text-white focus:border-[#fab702] bg-[#0000001A] border ${
                    fieldErrors.phone ? 'border-red-500' : 'border-[#FFFFFF33]'
                  } px-3 sm:px-4 py-2 text-white font-semibold text-sm sm:text-base`}
                />
                {fieldErrors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{fieldErrors.phone}</p>}
              </div>

              <div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your Message (Optional)"
                  rows={4}
                  className="w-full bg-[#0000001A] border border-[#FFFFFF33] px-3 sm:px-4 py-2 focus:border-[#fab702] focus:outline-none placeholder:text-white text-white text-sm sm:text-base"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-start mt-8">
          <button
            type="submit"
            disabled={submitting}
            className="text-white border border-[#FFFFFF33] px-6 py-2 sm:px-8 sm:py-3 uppercase text-xs sm:text-sm font-semibold hover:text-black hover:bg-[#fab702] hover:border-[#fab702] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Form'
            )}
          </button>
        </div>
      </form>

      <SecondaryFooter />
    </div>
  );
};

export default Page;