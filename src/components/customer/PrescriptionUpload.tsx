import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  FileUp,
  ShieldAlert,
  UploadCloud,
  XCircle,
} from 'lucide-react';
import { Prescription, User } from '../../types/pharmacy';

interface PrescriptionUploadProps {
  prescriptions: Prescription[];
  currentUser: User;
  onUploadPrescription: (data: {
    doctorName: string;
    dosage: string;
    medicineName: string;
    filePath: string;
  }) => void;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  prescriptions,
  currentUser,
  onUploadPrescription,
}) => {
  const [doctorName, setDoctorName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const userPrescriptions = prescriptions.filter((p) => p.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !dosage || !fileName) return;

    onUploadPrescription({
      doctorName,
      dosage,
      medicineName: medicineName || 'Prescription Medication',
      filePath: fileName,
    });

    setDoctorName('');
    setDosage('');
    setMedicineName('');
    setFileName('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Upload Form Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <FileUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload Digital Doctor Prescription (Rx)</h2>
            <p className="text-xs text-slate-500">
              Submit physician prescriptions for pharmacist verification before dispensing regulated drugs.
            </p>
          </div>
        </div>

        {isSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Prescription uploaded successfully. Chief Pharmacist review status is currently PENDING.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Attending Physician / Doctor Name *
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Gregory House, MD (Cardiology)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Medicine Name (Optional)
              </label>
              <input
                type="text"
                value={medicineName}
                onChange={(e) => setMedicineName(e.target.value)}
                placeholder="e.g. Amoxicillin 500mg or Atorvastatin 20mg"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dosage & Usage Instructions from Prescription *
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g. 1 capsule three times daily for 7 days with meals"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
              required
            />
          </div>

          {/* Drag and Drop File Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Prescription Document / Scan (PDF, JPG, PNG) *
            </label>
            <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 text-center bg-slate-50 transition-colors">
              <UploadCloud className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                {fileName ? fileName : 'Choose prescription file or drag & drop here'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Supports scans up to 10MB (HIPAA Compliant encrypted storage)</p>
              <label className="mt-3 inline-block px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 shadow-xs cursor-pointer">
                <span>Browse Local Files</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!doctorName || !dosage || !fileName}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Submit for Pharmacist Review
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Prescriptions List */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span>Submitted Prescription History</span>
          <span className="text-xs font-normal text-slate-500">{userPrescriptions.length} records</span>
        </h3>

        {userPrescriptions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No prescriptions on file. Use the form above to upload a new prescription.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {userPrescriptions.map((rx) => (
              <div key={rx.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{rx.doctorName}</span>
                    <span className="text-[11px] text-slate-400">Date: {rx.date}</span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-teal-800">Dosage:</span> {rx.dosage}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-400" />
                    <span>File: {rx.filePath}</span>
                  </div>
                  {rx.notes && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1.5">
                      <span className="font-semibold text-slate-700">Pharmacist Note:</span> {rx.notes}
                    </div>
                  )}
                </div>

                <div>
                  {rx.status === 'APPROVED' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>APPROVED</span>
                    </span>
                  )}
                  {rx.status === 'PENDING' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>PENDING REVIEW</span>
                    </span>
                  )}
                  {rx.status === 'REJECTED' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>REJECTED</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
