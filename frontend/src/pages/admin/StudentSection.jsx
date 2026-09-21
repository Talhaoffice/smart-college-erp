import { useState } from 'react'
import Badge from '../../components/ui/Badge.jsx'
import SectionCard from '../../components/ui/SectionCard.jsx'
import { currency } from '../../lib/utils.js'
import api from '../../services/api.js'
import StudentImportModal from './StudentImportModal.jsx'
import { Upload } from 'lucide-react'

const emptyStudentForm = {
  name: '',
  email: '',
  password: '',
  enrollment_no: '',
  department_id: '',
  semester: '1',
  phone: '',
  fee_amount: '',
  fee_status: 'paid',
  fee_due_date: '',
}

function StudentSection({ departments, students, onRefresh }) {
  const [form, setForm] = useState(emptyStudentForm)
  const [editingId, setEditingId] = useState(null)
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      ...form,
      department_id: Number(form.department_id),
      semester: Number(form.semester),
      fee_amount: Number(form.fee_amount),
      fee_due_date: form.fee_due_date || null,
    }

    if (!payload.password) {
      delete payload.password
    }

    if (editingId) {
      await api.put(`/admin/students/${editingId}`, payload)
    } else {
      await api.post('/admin/students', payload)
    }

    setForm(emptyStudentForm)
    setEditingId(null)
    await onRefresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this student account?')) return
    await api.delete(`/admin/students/${id}`)
    await onRefresh()
  }

  const filteredStudents = departmentFilter
    ? students.filter((student) => student.department?.id === Number(departmentFilter))
    : students

  return (
    <SectionCard id="students" eyebrow="Enrollment" title="Students">
      <div className="form-layout-lg">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Full Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>

          <div className="field-grid-2">
            <div>
              <label className="form-label">Email</label>
              <input
                className="input-field"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="form-label">
                Password {editingId ? '(optional on edit)' : ''}
              </label>
              <input
                className="input-field"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="field-grid-2">
            <div>
              <label className="form-label">Enrollment No</label>
              <input
                className="input-field"
                value={form.enrollment_no}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    enrollment_no: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="form-label">Department</label>
              <select
                className="input-field"
                value={form.department_id}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    department_id: event.target.value,
                  }))
                }
              >
                <option value="">Select department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-grid-3">
            <div>
              <label className="form-label">Semester</label>
              <input
                className="input-field"
                type="number"
                min="1"
                max="8"
                value={form.semester}
                onChange={(event) =>
                  setForm((current) => ({ ...current, semester: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                className="input-field"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="form-label">Fee Status</label>
              <select
                className="input-field"
                value={form.fee_status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, fee_status: event.target.value }))
                }
              >
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div className="field-grid-2">
            <div>
              <label className="form-label">Fee Amount</label>
              <input
                className="input-field"
                type="number"
                value={form.fee_amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, fee_amount: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="form-label">Fee Due Date</label>
              <input
                className="input-field"
                type="date"
                value={form.fee_due_date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, fee_due_date: event.target.value }))
                }
              />
            </div>
          </div>

          <div className="inline-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Student' : 'Add Student'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyStudentForm)
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="stack-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <select
              className="input-field max-w-xs"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn-secondary flex items-center gap-2"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="w-4 h-4" />
              Bulk Import Students
            </button>
          </div>

          <div className="table-wrap">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Fees</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>
                      <p className="font-semibold text-slate-900">{student.user?.name}</p>
                      <p className="text-xs text-slate-500">
                        {student.enrollment_no} / Semester {student.semester}
                      </p>
                      <p className="text-xs text-slate-500">{student.user?.email}</p>
                    </td>
                    <td>{student.department?.name}</td>
                    <td>
                      <div className="space-y-2">
                        <Badge value={student.fee?.status ?? 'N/A'} />
                        <p className="text-xs text-slate-500">{currency(student.fee?.amount)}</p>
                      </div>
                    </td>
                    <td>
                      <div className="inline-actions">
                        <button
                          type="button"
                          className="btn-secondary btn-sm"
                          onClick={() => {
                            setEditingId(student.id)
                            setForm({
                              name: student.user?.name ?? '',
                              email: student.user?.email ?? '',
                              password: '',
                              enrollment_no: student.enrollment_no ?? '',
                              department_id: String(student.department?.id ?? ''),
                              semester: String(student.semester ?? 1),
                              phone: student.phone ?? '',
                              fee_amount: String(student.fee?.amount ?? ''),
                              fee_status: student.fee?.status ?? 'paid',
                              fee_due_date: student.fee?.due_date ?? '',
                            })
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-danger btn-sm"
                          onClick={() => handleDelete(student.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <StudentImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
        onRefresh={onRefresh} 
      />
    </SectionCard>
  )
}

export default StudentSection
