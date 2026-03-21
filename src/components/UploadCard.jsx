import React, { useState, useRef } from 'react';
import { Upload, X, File, AlertCircle, CheckCircle } from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

const UploadCard = ({ requiredDoc, onFileSelect, existingFile, rejectedRemarks }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Invalid file format. Please upload JPG, PNG, or PDF.');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Maximum size is 10MB.');
      return;
    }

    setSelectedFile(file);
    onFileSelect(requiredDoc.docType, file);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    onFileSelect(requiredDoc.docType, null);
    if (inputRef.current) inputRef.current.value = '';
  };

  if (existingFile && !rejectedRemarks) {
    return (
      <div className="card p-5 border-l-4 border-l-success bg-emerald-50/30">
        <div className="flex items-center gap-4">
          <CheckCircle className="w-8 h-8 text-success" />
          <div>
            <h4 className="font-semibold text-slate-800">{requiredDoc.label}</h4>
            <p className="text-sm text-slate-500 mt-0.5">
              Successfully requested and uploaded.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card overflow-hidden ${rejectedRemarks ? 'border-error ring-1 ring-error shadow-sm' : ''}`}>
      {rejectedRemarks && (
        <div className="bg-red-50 p-3 border-b border-red-100 flex items-start gap-2 text-sm text-red-800">
          <AlertCircle className="w-5 h-5 shrink-0 text-error" />
          <div>
            <strong className="block mb-1">Action Required: Document Rejected</strong>
            {rejectedRemarks}
          </div>
        </div>
      )}
      
      <div className="p-5">
        <div className="mb-4">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            {requiredDoc.label}
            {requiredDoc.isRequired && <span className="text-error text-sm">*</span>}
          </h4>
          {requiredDoc.description && (
            <p className="text-sm text-slate-500 mt-1">{requiredDoc.description}</p>
          )}
        </div>

        {selectedFile ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 bg-blue-100 rounded text-primary shrink-0">
                <File className="w-6 h-6" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-slate-700 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <button 
              onClick={removeFile}
              className="p-1.5 text-slate-400 hover:text-error hover:bg-red-50 rounded-md transition-colors"
              title="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-primary bg-blue-50' : 'border-slate-300 hover:border-primary hover:bg-slate-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              onChange={handleChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-slate-700 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-500">
              PDF, JPG or PNG (max. 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadCard;
