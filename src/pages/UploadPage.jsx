import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Info,
} from 'lucide-react';
import { formatFileSize } from '../utils/helpers';

const API_BASE =
  (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

const publicClient = axios.create({
  baseURL: API_BASE,
});

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

function truncateName(name, max = 35) {
  if (!name || name.length <= max) return name || '';
  return `${name.slice(0, max)}…`;
}

const initialSlot = () => ({
  file: null,
  validationError: null,
  uploadError: null,
});

export default function UploadPage() {
  const { token } = useParams();

  const [phase, setPhase] = useState('loading');
  const [verifyError, setVerifyError] = useState(null);

  const [requestId, setRequestId] = useState(null);
  const [requesterName, setRequesterName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredDocuments, setRequiredDocuments] = useState([]);
  const [serverDocuments, setServerDocuments] = useState([]);

  const [slots, setSlots] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successSubmittedLabels, setSuccessSubmittedLabels] = useState([]);

  const activeTokenRef = useRef(token);
  useEffect(() => {
    activeTokenRef.current = token;
  }, [token]);

  const applySlot = useCallback((docType, patch) => {
    setSlots((prev) => ({
      ...prev,
      [docType]: { ...initialSlot(), ...prev[docType], ...patch },
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setPhase('loading');
      setVerifyError(null);
      try {
        const { data: body } = await publicClient.get(`/requests/verify/${token}`);
        if (cancelled || activeTokenRef.current !== token) return;
        if (!body?.success || !body.data) {
          throw new Error(body?.message || 'Invalid response');
        }
        const d = body.data;
        setRequestId(d.requestId);
        setRequesterName(d.requesterName || 'The requester');
        setRecipientName(d.recipientName || '');
        setDescription(d.description || '');
        setRequiredDocuments(Array.isArray(d.requiredDocuments) ? d.requiredDocuments : []);
        setServerDocuments(Array.isArray(d.documents) ? d.documents : []);

        const nextSlots = {};
        (d.requiredDocuments || []).forEach((rd) => {
          nextSlots[rd.docType] = initialSlot();
        });
        setSlots(nextSlots);
        setPhase('ready');
      } catch (e) {
        if (cancelled || activeTokenRef.current !== token) return;
        setVerifyError(e.response?.data?.message || e.message || 'Invalid link');
        setPhase('error');
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const total = requiredDocuments.length;

  const filledCount = useMemo(() => {
    return requiredDocuments.filter((rd) => {
      const srv = serverDocuments.find((x) => x.docType === rd.docType);
      const satisfiedOnServer =
        srv?.fileUrl && srv.status !== 'rejected';
      const slot = slots[rd.docType];
      return satisfiedOnServer || !!slot?.file;
    }).length;
  }, [requiredDocuments, serverDocuments, slots]);

  const selectedNewFilesCount = useMemo(() => {
    return requiredDocuments.filter((rd) => {
      const srv = serverDocuments.find((x) => x.docType === rd.docType);
      const needsNew = !srv?.fileUrl || srv.status === 'rejected';
      return needsNew && slots[rd.docType]?.file;
    }).length;
  }, [requiredDocuments, serverDocuments, slots]);

  const needsActionCount = useMemo(() => {
    return requiredDocuments.filter((rd) => {
      const srv = serverDocuments.find((x) => x.docType === rd.docType);
      return !srv?.fileUrl || srv.status === 'rejected';
    }).length;
  }, [requiredDocuments, serverDocuments]);

  const missingAfterSelection = Math.max(0, needsActionCount - selectedNewFilesCount);

  const allReadyToSubmit =
    needsActionCount > 0 && selectedNewFilesCount === needsActionCount;

  const validateFile = (file) => {
    if (!ACCEPT_TYPES.includes(file.type)) {
      return 'Please upload a PDF, JPG, or PNG file only.';
    }
    if (file.size > MAX_BYTES) {
      return 'File too large. Maximum 10MB allowed.';
    }
    return null;
  };

  const handlePick = (docType, file) => {
    if (!file) return;
    const err = validateFile(file);
    if (err) {
      applySlot(docType, { validationError: err, file: null });
      return;
    }
    applySlot(docType, { file, validationError: null, uploadError: null });
  };

  const clearFile = (docType) => {
    applySlot(docType, { file: null, validationError: null, uploadError: null });
  };

  const handleSubmit = async () => {
    if (!token || selectedNewFilesCount === 0) return;

    const toSend = requiredDocuments
      .map((rd) => {
        const srv = serverDocuments.find((x) => x.docType === rd.docType);
        const needsNew = !srv?.fileUrl || srv.status === 'rejected';
        const f = needsNew ? slots[rd.docType]?.file : null;
        return needsNew && f ? { docType: rd.docType, file: f, label: rd.label } : null;
      })
      .filter(Boolean);

    if (toSend.length === 0) return;

    setSubmitting(true);
    toSend.forEach(({ docType }) =>
      applySlot(docType, { uploadError: null })
    );

    const formData = new FormData();
    toSend.forEach(({ docType, file }) => {
      formData.append('files', file);
      formData.append('docTypes', docType);
    });
    if (requestId) {
      formData.append('requestId', String(requestId));
    }
    try {
      const { data: res } = await publicClient.post(
        `/documents/upload/${token}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (activeTokenRef.current !== token) return;

      if (!res?.success) {
        throw new Error(res?.message || 'Upload failed');
      }

      const labels = toSend.map((x) => x.label || x.docType);
      setSuccessSubmittedLabels(labels);
      setPhase('success');

      toSend.forEach(({ docType }) => {
        applySlot(docType, { file: null, uploadError: null, validationError: null });
      });
    } catch (e) {
      if (activeTokenRef.current !== token) return;
      toast.error('Upload failed. Please try again.');
      const msg = 'Upload failed for this document';
      toSend.forEach(({ docType }) => applySlot(docType, { uploadError: msg }));
    } finally {
      if (activeTokenRef.current === token) setSubmitting(false);
    }
  };

  if (phase === 'loading') {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: '#F0F4F8' }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className="w-12 h-12 animate-spin"
            style={{ color: '#1E40AF' }}
            aria-hidden
          />
          <p className="text-slate-600 text-sm font-medium">Loading secure upload…</p>
        </div>
      </div>
    );
  }

  if (phase === 'error') {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-10"
        style={{ backgroundColor: '#F0F4F8' }}
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 sm:p-8 text-center border border-slate-100">
          <XCircle
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: '#EF4444' }}
            strokeWidth={1.5}
          />
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
            Link Expired or Invalid
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            This upload link is no longer valid. Please contact the person who sent you this
            request to get a new link.
          </p>
          {verifyError && (
            <p className="mt-4 text-xs text-slate-400 break-words">{verifyError}</p>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div
        className="min-h-screen px-4 py-10 sm:py-14"
        style={{ backgroundColor: '#F0F4F8' }}
      >
        <style>{`
          @keyframes dv-scale-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .dv-success-icon { animation: dv-scale-in 0.45s ease-out forwards; }
        `}</style>
        <header className="max-w-3xl mx-auto mb-8 flex items-center">
          <span className="text-xl font-bold" style={{ color: '#1E40AF' }}>
            DocVerify
          </span>
        </header>
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-5 sm:p-8 md:p-10 text-center border border-slate-100">
          <div className="dv-success-icon mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center bg-emerald-50">
            <CheckCircle2 className="w-12 h-12" style={{ color: '#10B981' }} strokeWidth={2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Documents Submitted Successfully!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Thank you{recipientName ? `, ${recipientName}` : ''}. Your documents have been received
            and will be reviewed shortly. You will be notified once verification is complete.
          </p>
          <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
            {successSubmittedLabels.map((label) => (
              <li
                key={label}
                className="flex items-center gap-3 text-sm sm:text-base text-slate-800"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: '#10B981' }} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs sm:text-sm text-slate-500">You can safely close this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F4F8' }}>
      <header
        className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-sm sticky top-0 z-20"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4 flex items-center">
          <span className="text-lg sm:text-xl font-bold" style={{ color: '#1E40AF' }}>
            DocVerify
          </span>
        </div>
      </header>

      <main className="px-4 sm:px-8 py-6 sm:py-10 pb-16 max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 sm:p-6 md:p-8 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-2">
            Document Upload Portal
          </h1>
          <p className="text-center text-slate-600 text-sm sm:text-base leading-relaxed">
            <span className="font-semibold text-slate-800">{requesterName}</span> has requested the
            following documents from you. Please upload each document below.
          </p>

          {description ? (
            <div
              className="mt-5 flex gap-3 rounded-xl p-4 text-sm text-slate-800 border"
              style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}
            >
              <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#1E40AF' }} />
              <p>{description}</p>
            </div>
          ) : null}

          <div className="mt-6">
            <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
              <span>
                {filledCount} of {total} documents uploaded
              </span>
              <span className="text-slate-500">{total ? Math.round((filledCount / total) * 100) : 0}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${total ? (filledCount / total) * 100 : 0}%`,
                  backgroundColor: '#1E40AF',
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {requiredDocuments.map((rd) => {
            const srv = serverDocuments.find((d) => d.docType === rd.docType);
            const needsNew = !srv?.fileUrl || srv.status === 'rejected';
            const satisfied = srv?.fileUrl && srv.status !== 'rejected';
            const slot = slots[rd.docType] || initialSlot();
            const inputId = `upload-${rd.docType}`;

            const showPreview = !!slot.file;
            const rejected = srv?.status === 'rejected';

            return (
              <div
                key={rd.docType}
                className={`bg-white rounded-2xl shadow-md border p-5 sm:p-6 ${
                  showPreview ? 'border-l-4' : 'border-slate-100'
                }`}
                style={
                  showPreview ? { borderLeftColor: '#10B981' } : undefined
                }
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex gap-3 min-w-0">
                    <FileText className="w-8 h-8 text-slate-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                        {rd.label || rd.docType}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{rd.docType}</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      rd.isRequired
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {rd.isRequired ? 'Required' : 'Optional'}
                  </span>
                </div>

                {rejected && srv?.remarks ? (
                  <div className="mb-4 flex gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-800">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{srv.remarks}</span>
                  </div>
                ) : null}

                {satisfied && !needsNew ? (
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3">
                    <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: '#10B981' }} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-emerald-900">Already uploaded</p>
                      <p className="text-xs text-emerald-800/90 truncate" title={srv.fileName}>
                        {truncateName(srv.fileName || 'Document', 40)}
                      </p>
                    </div>
                  </div>
                ) : !showPreview ? (
                  <>
                    <label
                      htmlFor={inputId}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (submitting) return;
                        const f = e.dataTransfer.files?.[0];
                        if (f) handlePick(rd.docType, f);
                      }}
                      className={`block rounded-xl border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors min-h-[140px] flex flex-col items-center justify-center ${
                        submitting
                          ? 'opacity-50 pointer-events-none border-slate-200 bg-slate-50'
                          : 'border-slate-300 hover:border-[#1E40AF] hover:bg-blue-50/40'
                      }`}
                    >
                      <input
                        id={inputId}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        disabled={submitting}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handlePick(rd.docType, f);
                          e.target.value = '';
                        }}
                      />
                      <UploadCloud className="w-12 h-12 text-slate-400 mb-2" />
                      <span className="text-sm font-medium text-slate-800">
                        Click to upload or drag & drop
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        PDF, JPG, PNG — Max 10MB
                      </span>
                    </label>
                    {slot.validationError ? (
                      <p className="mt-2 text-sm" style={{ color: '#EF4444' }}>
                        {slot.validationError}
                      </p>
                    ) : null}
                    {slot.uploadError ? (
                      <p className="mt-2 text-sm" style={{ color: '#EF4444' }}>
                        {slot.uploadError}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3">
                      {slot.file?.type === 'application/pdf' ? (
                        <FileText className="w-6 h-6 shrink-0 text-emerald-700" />
                      ) : (
                        <ImageIcon className="w-6 h-6 shrink-0 text-emerald-700" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 truncate" title={slot.file?.name}>
                          {truncateName(slot.file?.name || '')}
                        </p>
                        <p className="text-xs text-slate-600">
                          {slot.file ? formatFileSize(slot.file.size) : ''}
                        </p>
                      </div>
                      <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: '#10B981' }} />
                    </div>
                    <button
                      type="button"
                      disabled={submitting}
                      className="mt-2 text-xs font-medium text-slate-500 hover:text-[#1E40AF] disabled:opacity-50"
                      onClick={() => clearFile(rd.docType)}
                    >
                      Change
                    </button>
                    {slot.validationError ? (
                      <p className="mt-2 text-sm" style={{ color: '#EF4444' }}>
                        {slot.validationError}
                      </p>
                    ) : null}
                    {slot.uploadError ? (
                      <p className="mt-2 text-sm" style={{ color: '#EF4444' }}>
                        {slot.uploadError}
                      </p>
                    ) : null}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 space-y-3">
          {needsActionCount === 0 && total > 0 ? (
            <p className="text-center text-sm sm:text-base font-medium py-3" style={{ color: '#10B981' }}>
              ✓ All requested documents are already on file. No further upload is needed.
            </p>
          ) : selectedNewFilesCount === 0 ? (
            <>
              <button
                type="button"
                disabled
                className="w-full min-h-[48px] rounded-xl font-semibold text-white cursor-not-allowed bg-slate-400 px-4 py-3 text-base"
              >
                Upload Documents
              </button>
              <p className="text-center text-sm text-slate-500">
                Please select at least one document to continue
              </p>
            </>
          ) : allReadyToSubmit ? (
            <>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="w-full min-h-[48px] rounded-xl font-semibold text-white px-4 py-3 text-base flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ backgroundColor: '#1E40AF' }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>Submit All Documents ✓</>
                )}
              </button>
              <p className="text-center text-sm font-medium" style={{ color: '#10B981' }}>
                ✓ All {needsActionCount} document{needsActionCount === 1 ? '' : 's'} ready to submit
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="w-full min-h-[48px] rounded-xl font-semibold text-white px-4 py-3 text-base flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ backgroundColor: '#1E40AF' }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    Submit Selected Documents ({selectedNewFilesCount} of {needsActionCount})
                  </>
                )}
              </button>
              <p className="text-center text-sm" style={{ color: '#F59E0B' }}>
                ⚠ {missingAfterSelection} document(s) not yet selected. You can still submit what you
                have.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
