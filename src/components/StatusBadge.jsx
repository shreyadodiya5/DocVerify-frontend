import React from 'react';
import { getStatusColor } from '../utils/helpers';

const REQUEST_LABELS = {
  pending: 'Pending',
  in_progress: 'In progress',
  submitted: 'With manager',
  under_review: 'Changes requested',
  approved: 'Approved',
  rejected: 'Rejected',
};

const StatusBadge = ({ status, subtitle }) => {
  let displayStatus = 'Unknown';
  if (status) {
    if (status === 'uploaded') displayStatus = 'Uploaded';
    else if (REQUEST_LABELS[status]) displayStatus = REQUEST_LABELS[status];
    else {
      const s = status.replace(/_/g, ' ');
      displayStatus = s.charAt(0).toUpperCase() + s.slice(1);
    }
  }

  const pill = (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {displayStatus}
    </span>
  );

  if (!subtitle) return pill;

  return (
    <span className="inline-flex flex-col items-start gap-0.5">
      {pill}
      <span className="text-[10px] text-slate-500 max-w-[14rem] leading-snug">{subtitle}</span>
    </span>
  );
};

export default StatusBadge;
