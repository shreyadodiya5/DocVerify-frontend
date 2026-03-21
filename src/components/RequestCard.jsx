import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/helpers';

const RequestCard = ({ request }) => {
  return (
    <Link 
      to={`/requests/${request._id}`}
      className="card p-5 hover:shadow-lg transition-shadow border-l-4 group block"
      style={{
        borderLeftColor: 
          request.status === 'approved' ? '#10B981' : 
          request.status === 'rejected' ? '#EF4444' : 
          request.status === 'submitted' ? '#3B82F6' : 
          request.status === 'under_review' ? '#F97316' : '#F59E0B'
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status={request.status} />
        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(request.createdAt)}
        </span>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800 line-clamp-1 border-b border-slate-100 pb-2">
          {request.recipientName || 'Unknown Recipient'}
        </h3>
        
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{request.recipientEmail}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{request.requiredDocuments?.length || 0} Documents Requested</span>
          </div>
        </div>
      </div>
      
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-sm font-medium text-primary group-hover:text-blue-800 transition-colors">
        <span>View Details</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default RequestCard;
