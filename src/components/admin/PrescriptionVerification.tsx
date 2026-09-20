import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck2,
  FileText,
  Filter,
  ShieldCheck,
  User,
  XCircle,
} from 'lucide-react';
import { Prescription, PrescriptionStatus } from '../../types/pharmacy';

interface PrescriptionVerificationProps {
  prescriptions: Prescription[];
  onVerifyPrescription: (id: number, status: PrescriptionStatus, remarks: string) => void;
}

export const PrescriptionVerification: React.FC<PrescriptionVerificationProps> = ({
  prescriptions,
  onVerifyPrescription,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [remarks, setRemarks] = useState('');

  const filteredPrescriptions = prescriptions.filter((p) => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  const handleAction = (status: PrescriptionStatus) => {
    if (!selectedRx) return;
    onVerifyPrescription(selectedRx.id, status, remarks.trim() || (status === 'APPROVED' ? 'Prescription verified with clinic registry.' : 'Prescription rejected due to incomplete physician information.'));
    setSelectedRx(null);
    setRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileCheck2 className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Chief Pharmacist Prescription Verification (Rx)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Regulated review queue for physician prescriptions before controlled medicine dispensing.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              filter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            All ({prescriptions.length})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              filter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({prescriptions.filter((p) => p.status === 'PENDING').length})</span>
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              filter === 'APPROVED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </button>
          <button
            onClick={() => setFilter('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              filter === 'REJECTED' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-800'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </button>
        </div>
      </div>

      {/* Prescription List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPrescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400">RX #{rx.id}</span>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{rx.doctorName}</h3>
                </div>
                <div>
                  {rx.status === 'APPROVED' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      APPROVED
                    </span>
                  )}
                  {rx.status === 'PENDING' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      PENDING
                    </span>
                  )}
                  {rx.status === 'REJECTED' && (
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      REJECTED
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200/70">
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Patient:</span> {rx.userName}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Prescribed Medicine:</span>{' '}
                  <span className="text-teal-700 font-medium">{rx.medicineName || 'Unspecified'}</span>
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Dosage Regimen:</span> {rx.dosage}
                </div>
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-800">Date Issued:</span> {rx.date}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] pt-1">
                  <FileText className="w-3.5 h-3.5 text-teal-600" />
                  <span>Attached File: {rx.filePath}</span>
                </div>
              </div>

              {rx.notes && (
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-[11px] border border-slate-200">
                  <span className="font-semibold">Pharmacist Audit Remarks:</span> {rx.notes}
                </div>
              )}
            </div>

            {/* Verification Button Bar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">HIPAA Protected</span>
              <button
                onClick={() => {
                  setSelectedRx(rx);
                  setRemarks(rx.notes || '');
                }}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Review & Change Status
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Dialog Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Pharmacist Rx Evaluation</h4>
                <p className="text-[11px] text-slate-500">Reviewing Prescription #{selectedRx.id}</p>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <strong>Physician:</strong> {selectedRx.doctorName}
              </div>
              <div>
                <strong>Patient:</strong> {selectedRx.userName}
              </div>
              <div>
                <strong>Instructions:</strong> {selectedRx.dosage}
              </div>
              <div>
                <strong>Document File:</strong> {selectedRx.filePath}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Clinical Pharmacist Audit Note / Reason
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Verified with state medical board registry. Safe for dispensing."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedRx(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('REJECTED')}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Reject Prescription
              </button>
              <button
                onClick={() => handleAction('APPROVED')}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs cursor-pointer"
              >
                Approve & Validate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
