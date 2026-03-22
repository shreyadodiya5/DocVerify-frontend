import React, { useRef, useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  UploadCloud,
  X,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatFileSize } from '../utils/helpers';

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function truncateFileName(name, max = 30) {
  if (!name || name.length <= max) return name || '';
  return `${name.slice(0, max)}...`;
}

const DetailDocumentSlot = ({
  requiredDoc,
  serverDoc,
  rejectedRemarks = null,
  slot = {},
  disabled = false,
  onSlotUpdate,
}) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    selectedFile = null,
    uploadStatus = 'idle',
    errorMessage = null,
    validationError = null,
    successFileName = null,
  } = slot;

  const validateAndSet = (file) => {
    if (!file) return;

    if (!ACCEPT_TYPES.includes(file.type)) {
      onSlotUpdate(requiredDoc.docType, {
        validationError: 'Invalid file type. Please upload PDF, JPG, or PNG only.',
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      onSlotUpdate(requiredDoc.docType, {
        validationError: 'File too large. Maximum size is 10MB.',
      });
      return;
    }

    onSlotUpdate(requiredDoc.docType, {
      selectedFile: file,
      validationError: null,
      errorMessage: null,
      uploadStatus: 'idle',
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    const f = e.dataTransfer.files?.[0];
    if (f) validateAndSet(f);
  };

  const handleInputChange = (e) => {
    const f = e.target.files?.[0];
    if (f) validateAndSet(f);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onSlotUpdate(requiredDoc.docType, {
      selectedFile: null,
      validationError: null,
      errorMessage: null,
      uploadStatus: 'idle',
    });
    if (inputRef.current) inputRef.current.value = '';
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const showSuccess =
    uploadStatus === 'success' ||
    (serverDoc?.fileUrl && serverDoc.status !== 'rejected');

  const displayName =
    successFileName ||
    serverDoc?.fileName ||
    selectedFile?.name ||
    '';

  const isImage = selectedFile?.type?.startsWith('image/');
  const previewIcon =
    selectedFile && isImage ? (
      <ImageIcon className="w-5 h-5 text-blue-600" />
    ) : (
      <FileText className="w-5 h-5 text-blue-600" />
    );

  const cardRing =
    uploadStatus === 'error'
      ? 'ring-2 ring-red-500 border-red-200'
      : selectedFile && uploadStatus !== 'success'
        ? 'ring-2 ring-[#3B82F6] border-blue-200'
        : 'border-slate-200';

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-shadow ${cardRing}`}
    >
      {rejectedRemarks && (
        <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-start gap-2 text-sm text-red-800">
          <span className="font-semibold shrink-0">Rejected:</span>
          <span>{rejectedRemarks}</span>
        </div>
      )}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-4 min-w-0">
            <div className="mt-1 shrink-0">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-800">{requiredDoc.label}</h4>
              <p className="text-sm text-slate-500 mt-0.5">{requiredDoc.docType}</p>
            </div>
          </div>
          <div className="shrink-0">
            {showSuccess ? (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-600 text-white">
                Submitted
              </span>
            ) : (
              <StatusBadge status="pending" />
            )}
          </div>
        </div>

        {showSuccess && (
          <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/80 px-3 py-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="min-w-0 text-sm flex-1">
              <span className="font-medium text-emerald-800">Uploaded successfully</span>
              {displayName && (
                <p className="text-emerald-700/90 truncate" title={displayName}>
                  {truncateFileName(displayName, 40)}
                </p>
              )}
            </div>
            {serverDoc?.fileUrl && (
              <a 
                href={serverDoc.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-secondary text-xs py-1 px-2 border-emerald-200 hover:bg-emerald-100/50"
              >
                View
              </a>
            )}
          </div>
        )}

        {!showSuccess && (
          <>
            {selectedFile ? (
              <div
                className={`mt-4 flex items-center justify-between gap-3 rounded-lg border border-blue-100 bg-sky-50/80 px-3 py-2.5 ${
                  disabled ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 rounded-md bg-white p-1.5 border border-blue-100">
                    {previewIcon}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium text-slate-800 truncate"
                      title={selectedFile.name}
                    >
                      {truncateFileName(selectedFile.name)}
                    </p>
                    <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  disabled={disabled}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                className={`mt-4 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
                  disabled
                    ? 'pointer-events-none opacity-50 border-slate-200'
                    : dragActive
                      ? 'border-[#3B82F6] bg-blue-50/50 cursor-pointer'
                      : 'border-slate-300 hover:border-[#3B82F6] hover:bg-slate-50/80 cursor-pointer'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={openPicker}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPicker();
                  }
                }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  onChange={handleInputChange}
                  disabled={disabled}
                />
                <UploadCloud className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG, DOCX up to 10MB</p>
              </div>
            )}

            {validationError && (
              <p className="mt-2 text-xs text-red-600">{validationError}</p>
            )}
            {uploadStatus === 'error' && errorMessage && (
              <p className="mt-2 text-xs font-medium text-red-600">{errorMessage}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DetailDocumentSlot;
