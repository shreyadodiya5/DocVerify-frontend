import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatFileSize } from '../utils/helpers';

const DocumentCard = ({
  document,
  onVerify,
  onReject,
  isRequester,
  canReviewDocuments = false,
}) => {
  const [remarks, setRemarks] = useState(document.remarks || '');
  const [showRejectBox, setShowRejectBox] = useState(false);

  const isUploaded = document.status === 'uploaded';
  const isVerified = document.status === 'verified';
  const isRejected = document.status === 'rejected';

  const handleRejectSubmit = () => {
    if (!remarks.trim()) return alert('Remarks are required for rejection');
    onReject(document._id, remarks);
    setShowRejectBox(false);
  };

  const getIcon = () => {
    if (isVerified) return <CheckCircle className="w-8 h-8 text-success" />;
    if (isRejected) return <XCircle className="w-8 h-8 text-error" />;
    if (isUploaded) return <Clock className="w-8 h-8 text-secondary" />;
    return <FileText className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className={`card overflow-hidden border-l-4 ${
      isVerified ? 'border-l-success' : 
      isRejected ? 'border-l-error' : 
      isUploaded ? 'border-l-secondary' : 'border-l-slate-300'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="mt-1 shrink-0">{getIcon()}</div>
            <div>
              <h4 className="font-semibold text-slate-800">{document.label}</h4>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                <span>{document.docType}</span>
                {document.fileSize && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{formatFileSize(document.fileSize)}</span>
                  </>
                )}
                {document.uploadedAt && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Uploaded {formatDate(document.uploadedAt)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <StatusBadge status={document.status} />
          </div>
        </div>

        {document.fileUrl && (
          <div className="mt-4 flex flex-wrap gap-3">
            <a 
              href={document.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-secondary text-sm py-1.5 px-3"
            >
              <Eye className="w-4 h-4 mr-2" />
              View File
            </a>
            
            {/* Action buttons for Person A */}
            {isRequester && isUploaded && canReviewDocuments && (
              <div className="flex gap-2 ml-auto">
                <button 
                  onClick={() => setShowRejectBox(!showRejectBox)}
                  className="btn btn-danger text-sm py-1.5 px-3 bg-white text-error border border-error hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Reject
                </button>
                <button 
                  onClick={() => onVerify(document._id)}
                  className="btn btn-success text-sm py-1.5 px-3"
                >
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Verify Document
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reject Remarks Box */}
        {showRejectBox && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100 animate-fade-in">
            <label className="block text-sm font-medium text-red-800 mb-2">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input w-full p-2 text-sm border-red-200 focus:border-red-500 focus:ring-red-500 rounded-md"
              rows="2"
              placeholder="E.g., Document is blurry, please upload a clearer copy."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
            <div className="mt-3 flex justify-end gap-2">
              <button 
                onClick={() => setShowRejectBox(false)}
                className="text-sm px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleRejectSubmit}
                className="text-sm px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Submit Rejection
              </button>
            </div>
          </div>
        )}

        {/* Show remarks if already rejected */}
        {isRejected && document.remarks && !showRejectBox && (
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-800 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 text-error" />
            <div>
              <span className="font-semibold block mb-0.5">Rejection Remarks:</span>
              {document.remarks}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;
