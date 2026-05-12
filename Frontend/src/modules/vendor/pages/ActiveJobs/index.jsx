import React, { useState, useEffect, useLayoutEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiMapPin, FiClock, FiUser, FiSearch, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { vendorTheme as themeColors } from '../../../../theme';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';
import { getBookings, assignWorker as assignWorkerApi } from '../../services/bookingService';
import { ConfirmDialog } from '../../components/common';

const ActiveJobs = memo(() => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('in_progress'); // Default to showing active jobs
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const bgStyle = themeColors.backgroundGradient;

    if (html) html.style.background = bgStyle;
    if (body) body.style.background = bgStyle;
    if (root) root.style.background = bgStyle;

    return () => {
      if (html) html.style.background = '';
      if (body) body.style.background = '';
      if (root) root.style.background = '';
    };
  }, []);

  // Memoize loadJobs to prevent recreation
  const loadJobs = useCallback(async (currentFilter, currentSearch) => {
    try {
      setLoading(true);
      const response = await getBookings({
        status: currentFilter,
        q: currentSearch,
        limit: 50 // Fetch more than default since we removed client-side filter
      });
      const jobsData = response.data || [];
      // Map API response to Component State structure
      const mappedJobs = jobsData.map(job => ({
        id: job._id || job.id,
        serviceType: job.serviceName || 'Service',
        user: {
          name: job.userId?.name || 'Customer'
        },
        location: {
          address: job.address?.addressLine1 || 'Address not available'
        },
        price: (job.finalAmount ? job.finalAmount * 0.9 : 0).toFixed(2),
        status: job.status,
        assignedTo: job.workerId ? { name: job.workerId.name } : (job.assignedAt ? { name: 'You (Self)' } : null),
        timeSlot: {
          date: job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString() : 'Date',
          time: job.scheduledTime || 'Time'
        }
      }));
      setJobs(mappedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Use a debounced search to avoid spamming the API
  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs(filter, searchQuery);
    }, filter === 'all' && searchQuery === '' ? 0 : 500); // Only debounce if active searching

    return () => clearTimeout(timer);
  }, [filter, searchQuery, loadJobs]);

  useEffect(() => {
    window.addEventListener('vendorJobsUpdated', () => loadJobs(filter, searchQuery));
    return () => {
      window.removeEventListener('vendorJobsUpdated', () => loadJobs(filter, searchQuery));
    };
  }, [loadJobs, filter, searchQuery]);

  // filteredJobs is now just the jobs from the server
  const filteredJobs = jobs;

  const handleAssignToSelf = async (jobId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Assign to Self',
      message: 'Are you sure you want to do this job yourself?',
      onConfirm: async () => {
        try {
          const response = await assignWorkerApi(jobId, 'SELF');
          if (response && response.success) {
            toast.success("Assigned to yourself!");
            // Refresh jobs list instead of full page reload
            loadJobs(filter, searchQuery);
          }
        } catch (error) {
          console.error("Error assigning to self:", error);
          toast.error("Failed to assign to yourself");
        }
      }
    });
  };

  const hexToRgba = useCallback((hex, alpha) => {
    if (!hex || typeof hex !== 'string') return `rgba(0,0,0,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }, []);

  const getStatusColor = useCallback((status) => {
    const colors = {
      'ACCEPTED': '#F59E0B',
      'ASSIGNED': '#3B82F6',
      'JOURNEY_STARTED': '#F59E0B',
      'VISITED': '#8B5CF6',
      'WORK_DONE': '#10B981',
      'WORKER_PAID': '#06B6D4',
      'SETTLEMENT_PENDING': '#F97316',
      'COMPLETED': '#059669',
    };
    return colors[status?.toUpperCase()] || '#6B7280';
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-[#F8FAFC]">
      <Header title="My Jobs" showBack={false} showNotifications={true} />

      <main className="px-5 pt-4">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#0F4A44]">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 shadow-sm border border-black/5 focus:border-[#0F4A44] focus:ring-1 focus:ring-[#0F4A44] outline-none transition-all"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'assigned', label: 'Assigned' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-6 py-2.5 rounded-full font-black text-xs whitespace-nowrap transition-all duration-300 ${
                filter === filterOption.id
                  ? 'bg-[#0F4A44] text-white shadow-lg shadow-[#0F4A44]/20'
                  : 'bg-white text-gray-500 border border-black/5'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm animate-pulse">
                <div className="h-4 w-1/3 bg-gray-100 rounded mb-4" />
                <div className="h-6 w-1/2 bg-gray-100 rounded mb-6" />
                <div className="h-20 w-full bg-gray-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-[32px] p-12 text-center shadow-sm border border-black/5 mt-10">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBriefcase className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No jobs found</h3>
            <p className="text-sm font-bold text-gray-400">
              {searchQuery ? 'Try another search term' : 'New jobs will appear here when assigned.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-10">
            {filteredJobs.map((job) => {
              const status = job.status?.toUpperCase();
              const statusColor = getStatusColor(status);
              const isCompleted = status === 'COMPLETED';

              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/vendor/booking/${job.id}`)}
                  className="bg-white rounded-3xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-black/5 overflow-hidden relative"
                >
                  {/* Status Indicator Bar */}
                  <div 
                    className="absolute top-0 left-0 bottom-0 w-1.5"
                    style={{ backgroundColor: statusColor }}
                  />

                  <div className="p-6">
                    {/* Card Header: ID & Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
                        <span className="text-[10px] font-black text-gray-400 tracking-wider">
                          #BK{job.id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"
                        style={{ backgroundColor: hexToRgba(statusColor, 0.1), color: statusColor }}
                      >
                        <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
                        {job.status.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Service Info */}
                    <div className="mb-6">
                      <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg inline-block mb-2 uppercase tracking-tight">
                        {job.serviceType}
                      </div>
                      <h3 className="text-xl font-black text-gray-900 leading-tight">
                        {job.user?.name || 'Customer Name'}
                      </h3>
                    </div>

                    {/* Info Container */}
                    <div className="bg-gray-50/50 rounded-2xl p-4 space-y-4 border border-black/[0.02] mb-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-black/[0.03] shadow-sm text-blue-500">
                          <FiClock className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Schedule Slot</span>
                          <span className="text-xs font-bold text-gray-700">{job.timeSlot.date} • {job.timeSlot.time}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-black/[0.03] shadow-sm text-red-500">
                          <FiMapPin className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Service Location</span>
                          <span className="text-xs font-bold text-gray-700 truncate">{job.location.address}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Price & Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-black/[0.03]">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Earnings</span>
                        <span className="text-lg font-black text-gray-900">₹{job.price}</span>
                      </div>
                      <button 
                        className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-100 transition-all active:scale-95"
                      >
                        View Details
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Assignment Actions */}
                    {['ACCEPTED', 'CONFIRMED'].includes(status) && !job.assignedTo && (
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignToSelf(job.id);
                          }}
                          className="py-3.5 rounded-2xl bg-white border-2 border-black/5 text-black text-[10px] font-black uppercase tracking-widest hover:border-black/20 transition-all active:scale-95 shadow-sm"
                        >
                          Self
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/vendor/booking/${job.id}/assign-worker`);
                          }}
                          className="py-3.5 rounded-2xl bg-[#0F4A44] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#0F4A44]/20 active:scale-95"
                        >
                          Assign
                        </button>
                      </div>
                    )}
                    
                    {/* Assigned Worker Info */}
                    {job.assignedTo && (
                      <div className="mt-4 flex items-center justify-between px-4 py-2.5 bg-gray-900 rounded-2xl">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <FiUser className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Worker</span>
                        </div>
                        <span className="text-[11px] font-black text-white">{job.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />

      <BottomNav />
    </div>
  );
});

export default ActiveJobs;

