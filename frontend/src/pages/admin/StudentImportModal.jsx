import { useState, useRef } from 'react'
import api from '../../services/api.js'
import { Download, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function StudentImportModal({ isOpen, onClose, onRefresh }) {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  if (!isOpen) return null;

  const handleDownloadSample = async () => {
    try {
      const response = await api.get('/admin/students/sample', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'students_sample.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading sample:', error);
      alert('Failed to download sample file.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null); // Clear previous results
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/admin/students/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setResult({
        success: true,
        data: response.data,
      });
      
      // Clear file input
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh the table if at least one row was successful
      if (response.data.success_count > 0) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error importing students:', error);
      setResult({
        success: false,
        message: error.response?.data?.message || 'Failed to upload and import the file.',
        errors: error.response?.data?.errors || {},
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">Bulk Import Students</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 stack-md">
          <div className="flex justify-between items-center bg-sky-50 border border-sky-100 rounded-lg p-4">
            <div>
              <p className="text-sm font-medium text-sky-900">Need the correct format?</p>
              <p className="text-xs text-sky-700 mt-1">Download the sample CSV file to see the required structure.</p>
            </div>
            <button 
              onClick={handleDownloadSample}
              className="btn-secondary btn-sm flex items-center gap-2 bg-white"
            >
              <Download className="w-4 h-4" />
              Sample CSV
            </button>
          </div>

          <div>
            <label className="form-label block mb-2">Upload Data File (.csv, .xlsx)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              {file ? (
                <p className="text-sm font-medium text-slate-700">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-slate-700">Click to browse or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">Excel or CSV files only</p>
                </>
              )}
            </div>
          </div>

          {result && result.success && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900">Import Complete</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    Successfully imported {result.data.success_count} student(s).
                  </p>
                  
                  {result.data.failed_count > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-rose-800 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> 
                        Skipped {result.data.failed_count} row(s) due to errors:
                      </p>
                      <div className="mt-2 max-h-40 overflow-y-auto bg-white rounded border border-rose-100 text-xs text-rose-700 p-2">
                        {result.data.failures.map((f, i) => (
                          <div key={i} className="mb-2 last:mb-0 border-b border-rose-50 last:border-0 pb-1">
                            <span className="font-semibold">Row {f.row}:</span> {f.errors.join(', ')}
                            <br/><span className="text-slate-500">({f.attribute} was '{f.values[f.attribute]}')</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {result && !result.success && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-900">Import Failed</h4>
                  <p className="text-sm text-rose-700 mt-1">{result.message}</p>
                  {Object.keys(result.errors || {}).length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-xs text-rose-700">
                      {Object.entries(result.errors).map(([key, messages]) => (
                        <li key={key}>{messages[0]}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Close
          </button>
          <button 
            onClick={handleUpload}
            className="btn-primary"
            disabled={!file || loading}
          >
            {loading ? 'Importing...' : 'Upload & Import'}
          </button>
        </div>
      </div>
    </div>
  )
}
