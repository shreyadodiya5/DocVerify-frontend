import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RequestCard from '../components/RequestCard';
import Loader from '../components/Loader';
import { requestService } from '../services/requestService';
import { FilePlus, Search, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getRequests();
      setRequests(data.data || []);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    submitted: requests.filter(r => r.status === 'submitted').length,
    underReview: requests.filter(r => r.status === 'under_review').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const filteredRequests = requests.filter(req => {
    if (filter !== 'all' && req.status !== filter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        req.recipientName?.toLowerCase().includes(query) ||
        req.recipientEmail?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <div className="md:hidden">
        <Navbar />
      </div>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-8 lg:pt-8 min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Manage all your document requests</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={fetchRequests} 
              className="p-2 text-slate-500 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 bg-white"
              title="Refresh request list"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link to="/requests/new" className="btn btn-primary w-full sm:w-auto">
              <FilePlus className="w-4 h-4 mr-2" />
              New Request
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4 border-l-4 border-slate-400">
            <span className="text-sm font-medium text-slate-500">Total Requests</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">{stats.total}</span>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-warning">
            <span className="text-sm font-medium text-slate-500">Pending Docs</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-warning">{stats.pending}</span>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-secondary">
            <span className="text-sm font-medium text-slate-500">Awaiting Review</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-secondary">{stats.submitted}</span>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-success">
            <span className="text-sm font-medium text-slate-500">Fully Approved</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-success">{stats.approved}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto w-full no-scrollbar pb-1">
            {['all', 'pending', 'submitted', 'under_review', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  filter === f 
                    ? 'bg-primary text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)} ({f === 'all' ? stats.total : stats[f === 'under_review' ? 'underReview' : f] || 0})
              </button>
            ))}
          </div>

          <div className="relative w-full xl:w-72 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="input pl-10 text-sm py-2"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Loader fullScreen={false} />
        ) : filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredRequests.map(request => (
              <RequestCard key={request._id} request={request} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No requests found</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              We couldn't find any requests matching your current filters. Try adjusting your search criteria or create a new request.
            </p>
            {filter !== 'all' || searchQuery ? (
              <button 
                onClick={() => { setFilter('all'); setSearchQuery(''); }}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            ) : (
              <Link to="/requests/new" className="btn btn-primary">
                Create First Request
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
