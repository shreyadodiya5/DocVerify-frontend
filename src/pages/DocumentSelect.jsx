import React, { useState } from 'react';
import { Check, Plus, AlertCircle } from 'lucide-react';

const PREDEFINED_DOCS = [
  { id: 'aadhaar_card', label: 'Aadhaar Card' },
  { id: 'pan_card', label: 'PAN Card' },
  { id: 'passport', label: 'Passport' },
  { id: 'voter_id', label: 'Voter ID' },
  { id: 'driving_license', label: 'Driving License' },
  { id: '10th_marksheet', label: '10th Marksheet' },
  { id: '12th_marksheet', label: '12th Marksheet' },
  { id: 'graduation_cert', label: 'Graduation Certificate' },
  { id: 'bank_statement', label: 'Bank Statement' },
  { id: 'salary_slip', label: 'Salary Slip' },
  { id: 'utility_bill', label: 'Utility Bill' },
  { id: 'rental_agreement', label: 'Rental Agreement' },
  { id: 'photo', label: 'Passport Size Photo' },
  { id: 'signature', label: 'Signature' },
];

const DocumentSelect = ({ selectedDocs, setSelectedDocs, onBack, onSubmit, isSubmitting }) => {
  const [customDocType, setCustomDocType] = useState('');
  const [customDocDesc, setCustomDocDesc] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const toggleDocument = (doc) => {
    const exists = selectedDocs.find(d => d.docType === doc.id);
    if (exists) {
      setSelectedDocs(selectedDocs.filter(d => d.docType !== doc.id));
    } else {
      setSelectedDocs([...selectedDocs, { 
        docType: doc.id, 
        label: doc.label, 
        description: '', 
        isRequired: true 
      }]);
    }
  };

  const handleAddCustom = () => {
    if (!customDocType.trim()) return;
    
    const docId = customDocType.toLowerCase().replace(/\s+/g, '_');
    
    if (selectedDocs.find(d => d.docType === docId)) {
      alert('This document is already in the list.');
      return;
    }

    setSelectedDocs([...selectedDocs, {
      docType: docId,
      label: customDocType.trim(),
      description: customDocDesc.trim(),
      isRequired: true
    }]);

    setCustomDocType('');
    setCustomDocDesc('');
    setShowCustom(false);
  };

  const removeDoc = (docId) => {
    setSelectedDocs(selectedDocs.filter(d => d.docType !== docId));
  };

  const toggleRequired = (docId) => {
    setSelectedDocs(selectedDocs.map(d => 
      d.docType === docId ? { ...d, isRequired: !d.isRequired } : d
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Documents to request</h3>
        <p className="text-sm text-slate-500 mb-4">
          Pick from the list or add any custom document name — you are not limited to presets.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {PREDEFINED_DOCS.map(doc => {
            const isSelected = !!selectedDocs.find(d => d.docType === doc.id);
            return (
              <div 
                key={doc.id}
                onClick={() => toggleDocument(doc)}
                className={`border p-3 rounded-lg cursor-pointer flex items-start gap-3 transition-colors ${
                  isSelected 
                    ? 'border-primary bg-blue-50 ring-1 ring-primary' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'bg-primary text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                  {doc.label}
                </span>
              </div>
            );
          })}
          
          <div 
            onClick={() => setShowCustom(true)}
            className="border border-dashed border-slate-300 p-3 rounded-lg cursor-pointer flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-primary text-slate-500 hover:text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Custom</span>
          </div>
        </div>

        {showCustom && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 animate-fade-in">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Add Custom Document</h4>
            <div className="space-y-3">
              <div>
                <label className="label text-xs">Document Name</label>
                <input 
                  type="text" 
                  className="input py-1.5"
                  placeholder="E.g., NDA Form"
                  value={customDocType}
                  onChange={e => setCustomDocType(e.target.value)}
                />
              </div>
              <div>
                <label className="label text-xs">Instructions (Optional)</label>
                <input 
                  type="text" 
                  className="input py-1.5"
                  placeholder="Format requirements or instructions"
                  value={customDocDesc}
                  onChange={e => setCustomDocDesc(e.target.value)}
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCustom(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleAddCustom}
                  className="px-3 py-1.5 text-xs font-medium bg-primary text-white hover:bg-blue-800 rounded-md"
                >
                  Add Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-24">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-100">
            Selected Documents ({selectedDocs.length})
          </h3>
          
          {selectedDocs.length === 0 ? (
            <div className="text-center py-6 text-slate-500 flex flex-col items-center">
              <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-sm">No documents selected yet.</p>
              <p className="text-xs mt-1">Select from the list to continue.</p>
            </div>
          ) : (
            <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
              {selectedDocs.map(doc => (
                <div key={doc.docType} className="bg-slate-50 rounded-lg p-3 border border-slate-100 group relative">
                  <div className="flex justify-between items-start mb-2">
                    <input 
                      type="text"
                      className="text-sm font-semibold text-slate-800 pr-5 bg-transparent border-none focus:ring-0 w-full p-0"
                      value={doc.label}
                      onChange={(e) => {
                        setSelectedDocs(selectedDocs.map(d => 
                          d.docType === doc.docType ? { ...d, label: e.target.value } : d
                        ));
                      }}
                      placeholder="Document label"
                    />
                    <button 
                      type="button"
                      onClick={() => removeDoc(doc.docType)}
                      className="text-slate-400 hover:text-error absolute top-3 right-3"
                    >
                      <Plus className="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                  
                  <div className="mb-2">
                    <input 
                      type="text"
                      className="text-[11px] text-slate-500 bg-white/50 border-slate-200 rounded px-1.5 py-0.5 w-full focus:bg-white"
                      placeholder="Add instructions (optional)..."
                      value={doc.description || ''}
                      onChange={(e) => {
                        setSelectedDocs(selectedDocs.map(d => 
                          d.docType === doc.docType ? { ...d, description: e.target.value } : d
                        ));
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/50">
                    <input 
                      type="checkbox" 
                      id={`req-${doc.docType}`}
                      checked={doc.isRequired}
                      onChange={() => toggleRequired(doc.docType)}
                      className="w-3.5 h-3.5 text-primary rounded border-slate-300 focus:ring-primary"
                    />
                    <label htmlFor={`req-${doc.docType}`} className="text-xs text-slate-600 select-none cursor-pointer">
                      Required document
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button 
              type="button" 
              onClick={onBack}
              className="btn btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Back
            </button>
            <button 
              type="button" 
              onClick={onSubmit}
              className="btn btn-primary flex-1"
              disabled={selectedDocs.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSelect;
