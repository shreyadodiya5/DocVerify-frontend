import React from 'react';
import { getStatusColor } from '../utils/helpers';

const StatusBadge = ({ status }) => {
  let displayStatus = 'Unknown';
  if (status) {
    if (status === 'uploaded') displayStatus = 'Submitted';
    else {
      const s = status.replace(/_/g, ' ');
      displayStatus = s.charAt(0).toUpperCase() + s.slice(1);
    }
  }
  
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
      {displayStatus}
    </span>
  );
};

export default StatusBadge;
