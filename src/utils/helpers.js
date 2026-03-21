export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', options); 
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
    case 'verified':
      return 'bg-success text-white';
    case 'rejected':
      return 'bg-error text-white';
    case 'pending':
    case 'not_uploaded':
      return 'bg-warning text-white';
    case 'submitted':
    case 'uploaded':
      return 'bg-secondary text-white';
    case 'under_review':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-slate-500 text-white';
  }
};
