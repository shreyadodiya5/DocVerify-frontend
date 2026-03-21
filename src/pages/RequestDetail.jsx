import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import DocumentCard from '../components/DocumentCard';
import DetailDocumentSlot from '../components/DetailDocumentSlot';
import Loader from '../components/Loader';
import StatusBadge from '../components/StatusBadge';
import { requestService } from '../services/requestService';
import { documentService } from '../services/documentService';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Send, 
  Trash2,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [request, setRequest] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [uploadSlots, setUploadSlots] = useState({});
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const activeRequestIdRef = useRef(id);

  useEffect(() => {
    activeRequestIdRef.current = id;
  }, [id]);

  const fetchDetails = async ({ silent } = {}) => {
    const requestId = activeRequestIdRef.current;
    try {
      if (!silent) setLoading(true);
      const [reqRes, docRes] = await Promise.all([
        requestService.getRequestById(requestId),
        documentService.getDocumentsByRequest(requestId)
      ]);

      if (activeRequestIdRef.current !== requestId) return;

      setRequest(reqRes.data);
      setDocuments(docRes.data || []);
    } catch (error) {
      if (activeRequestIdRef.current !== requestId) return;
      toast.error('Failed to load request details');
      if (!silent) navigate('/dashboard');
    } finally {
      if (activeRequestIdRef.current === requestId && !silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    setUploadSlots({});
    setBatchSubmitting(false);
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const [reqRes, docRes] = await Promise.all([
          requestService.getRequestById(id),
          documentService.getDocumentsByRequest(id),
        ]);
        if (cancelled || activeRequestIdRef.current !== id) return;
        setRequest(reqRes.data);
        setDocuments(docRes.data || []);
      } catch (error) {
        if (cancelled || activeRequestIdRef.current !== id) return;
        toast.error('Failed to load request details');
        navigate('/dashboard');
      } finally {
        if (!cancelled && activeRequestIdRef.current === id) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleResend = async () => {
    if (!window.confirm('Are you sure you want to resend the notification to the client?')) return;
    
    setResending(true);
    try {
      await requestService.resendNotification(id);
      toast.success('Notification sent successfully');
      fetchDetails();
    } catch (error) {
      toast.error('Failed to resend notification');
    } finally {
      setResending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Warning: This will permanently delete this request and all associated documents. Are you sure?')) return;
    
    setDeleting(true);
    try {
      await requestService.deleteRequest(id);
      toast.success('Request deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to delete request');
      setDeleting(false);
    }
  };

  const handleVerifyDoc = async (docId) => {
    try {
      await documentService.verifyDocument(docId);
      toast.success('Document verified');
      fetchDetails();
    } catch (error) {
      toast.error('Failed to verify document');
    }
  };

  const handleRejectDoc = async (docId, remarks) => {
    try {
      await documentService.rejectDocument(docId, remarks);
      toast.success('Document rejected');
      fetchDetails();
    } catch (error) {
      toast.error('Failed to reject document');
    }
  };

  const handleSlotUpdate = (docType, patch) => {
    setUploadSlots((prev) => ({
      ...prev,
      [docType]: {
        selectedFile: null,
        uploadStatus: 'idle',
        errorMessage: null,
        validationError: null,
        successFileName: null,
        ...prev[docType],
        ...patch,
      },
    }));
  };

  const handleSubmitAllDocuments = async () => {
    if (!request) return;
    const requestId = activeRequestIdRef.current;

    const needUploadDocTypes = request.requiredDocuments
      .filter((rd) => {
        const d = documents.find((x) => x.docType === rd.docType);
        return !d?.fileUrl || d?.status === 'rejected';
      })
      .map((rd) => rd.docType);

    const snapshots = needUploadDocTypes
      .map((docType) => ({
        docType,
        file: uploadSlots[docType]?.selectedFile,
      }))
      .filter((s) => s.file);

    if (snapshots.length === 0) return;

    setBatchSubmitting(true);
    let successes = 0;
    let failures = 0;

    for (const { docType, file } of snapshots) {
      const formData = new FormData();
      formData.append('files', file);
      formData.append('docTypes', docType);
      const reqDoc = request.requiredDocuments.find((d) => d.docType === docType);
      if (reqDoc) formData.append('label', reqDoc.label);

      try {
        await documentService.uploadDocumentsAuthenticated(requestId, formData);
        successes++;
        setUploadSlots((prev) => {
          const next = { ...prev };
          delete next[docType];
          return next;
        });
      } catch (error) {
        failures++;
        console.error(`Error uploading ${docType}:`, error);
        setUploadSlots((prev) => ({
          ...prev,
          [docType]: {
            ...prev[docType],
            selectedFile: file,
            uploadStatus: 'error',
            errorMessage: 'Upload failed — try again',
          },
        }));
      }
    }

    setBatchSubmitting(false);
    if (activeRequestIdRef.current === requestId) {
      await fetchDetails({ silent: true });
    }

    if (failures === 0 && successes > 0) {
      toast.success('Documents submitted successfully!');
    } else if (failures > 0 && successes === 0) {
      toast.error('Upload failed. Please try again.');
    } else if (failures > 0 && successes > 0) {
      toast.warning('Some documents failed. Please retry the items marked below.');
    }
  };

  if (loading) return <Loader />;

  if (!request) return null;

  const isRecipient = user && user.email === request.recipientEmail;
  const creatorId = request.createdBy?._id ?? request.createdBy;
  const isRequester = user && String(user._id) === String(creatorId);
  const canUpload = isRecipient || isRequester;

  const mergedDocuments = request.requiredDocuments.map(reqDoc => {
    const uploaded = documents.find(d => d.docType === reqDoc.docType);
    if (uploaded) {
      return { ...reqDoc, ...uploaded, isUploaded: true };
    }
    return { ...reqDoc, status: 'pending', isUploaded: false, _id: `req-${reqDoc.docType}` };
  });

  const totalDocs = mergedDocuments.length;
  const verifiedDocs = mergedDocuments.filter(d => d.status === 'verified').length;
  const submittedDocsCount = mergedDocuments.filter(
    (d) => d.fileUrl && d.status !== 'rejected'
  ).length;
  const submissionProgress =
    totalDocs === 0 ? 0 : Math.round((submittedDocsCount / totalDocs) * 100);
  const needUploadDocs = mergedDocuments.filter(
    (d) => !d.fileUrl || d.status === 'rejected'
  );
  const anyNeedsUpload = needUploadDocs.length > 0;
  const selectedCount = needUploadDocs.filter(
    (d) => uploadSlots[d.docType]?.selectedFile
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-8 lg:pt-8 min-w-0">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900 line-clamp-1">
                    {request.recipientName}
                  </h1>
                  <StatusBadge status={request.status} />
                </div>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Created {formatDate(request.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleResend}
                disabled={resending || request.status === 'approved'}
                className="btn btn-secondary py-2 px-3 text-sm disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-1.5" />
                {resending ? 'Sending...' : 'Resend Link'}
              </button>
              <button 
                onClick={handleDelete}
                disabled={deleting}
                className="btn btn-danger py-2 px-3 text-sm bg-white text-error border border-error hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {isRecipient ? 'Upload Progress' : 'Verification Progress'}
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {`${submittedDocsCount} / ${totalDocs}`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${submissionProgress}%` }}
                  ></div>
                </div>
                {verifiedDocs === totalDocs && totalDocs > 0 && (
                  <p className="text-xs text-success mt-3 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> All documents verified successfully.
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">
                  {isRecipient ? 'Upload Required Documents' : 'Requested Documents'}
                </h3>
                
                {mergedDocuments.map((doc) => {
                  const needsUpload = !doc.fileUrl || doc.status === 'rejected';

                  if (needsUpload && canUpload) {
                    return (
                      <DetailDocumentSlot
                        key={doc.docType}
                        requiredDoc={{
                          label: doc.label,
                          docType: doc.docType,
                          description: doc.description,
                        }}
                        serverDoc={doc.fileUrl ? doc : null}
                        rejectedRemarks={
                          doc.status === 'rejected' ? doc.remarks : null
                        }
                        slot={uploadSlots[doc.docType] || {}}
                        disabled={batchSubmitting}
                        onSlotUpdate={handleSlotUpdate}
                      />
                    );
                  }

                  if (!needsUpload && isRequester) {
                    return (
                      <DocumentCard
                        key={doc._id}
                        document={doc}
                        isRequester={true}
                        onVerify={handleVerifyDoc}
                        onReject={handleRejectDoc}
                      />
                    );
                  }

                  if (!needsUpload && isRecipient) {
                    return (
                      <DetailDocumentSlot
                        key={doc.docType}
                        requiredDoc={{
                          label: doc.label,
                          docType: doc.docType,
                        }}
                        serverDoc={doc}
                        slot={{}}
                        disabled={false}
                        onSlotUpdate={() => {}}
                      />
                    );
                  }

                  return (
                    <DocumentCard
                      key={doc._id}
                      document={doc}
                      isRequester={false}
                      onVerify={handleVerifyDoc}
                      onReject={handleRejectDoc}
                    />
                  );
                })}

                {canUpload && mergedDocuments.length > 0 && (
                  <div className="pt-2 space-y-2">
                    {anyNeedsUpload ? (
                      <>
                        <button
                          type="button"
                          onClick={handleSubmitAllDocuments}
                          disabled={batchSubmitting || selectedCount === 0}
                          className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-white font-semibold transition-colors ${
                            batchSubmitting || selectedCount === 0
                              ? 'bg-slate-400 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                        >
                          {batchSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Submit All Documents
                            </>
                          )}
                        </button>
                        {selectedCount === needUploadDocs.length &&
                          needUploadDocs.length > 0 && (
                            <p className="text-sm text-center text-green-600">
                              ✓ All documents ready to submit
                            </p>
                          )}
                        {selectedCount > 0 &&
                          selectedCount < needUploadDocs.length && (
                            <p className="text-sm text-center text-amber-600">
                              ⚠ {selectedCount} of {needUploadDocs.length}{' '}
                              documents selected — you can still submit partial
                            </p>
                          )}
                      </>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold bg-green-600 text-white cursor-not-allowed opacity-95"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        All Submitted
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>

            <div className="lg:col-span-1 space-y-6">
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                  Recipient Details
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">Full Name</span>
                      <span className="text-sm font-medium text-slate-900">{request.recipientName}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-xs text-slate-500 block mb-0.5">Email</span>
                      <span className="text-sm font-medium text-slate-900 truncate block">{request.recipientEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs text-slate-500 block mb-0.5">Phone</span>
                      <span className="text-sm font-medium text-slate-900">{request.recipientPhone}</span>
                    </div>
                  </div>
                </div>
                
                {request.description && (
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 block mb-1">Attached Message</span>
                    <p className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{request.description}"
                    </p>
                  </div>
                )}
            </div>

          </div>
          </div>
          </div>
        </main>
      </div>
    );
  };

export default RequestDetail;
