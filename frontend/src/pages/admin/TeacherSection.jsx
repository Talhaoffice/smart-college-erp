import { useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import api from '../../services/api.js'

const emptyTeacherForm = {
  name: '',
  email: '',
  password: '',
  department_id: '',
  employee_id: '',
  designation: '',
}

function TeacherSection({ departments, teachers, onRefresh }) {
  const [form, setForm] = useState(emptyTeacherForm)
  const [editingId, setEditingId] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      ...form,
      department_id: Number(form.department_id),
      designation: form.designation || null,
    }

    if (!payload.password) {
      delete payload.password
    }

    if (editingId) {
      await api.put(`/admin/teachers/${editingId}`, payload)
    } else {
      await api.post('/admin/teachers', payload)
    }

    setForm(emptyTeacherForm)
    setEditingId(null)
    await onRefresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this teacher account?')) return
    await api.delete(`/admin/teachers/${id}`)
    await onRefresh()
  }

  return (
    <SectionCard id="teachers" eyebrow="People" title="Teachers">
      <div className="form-layout-md">
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
              Password {editingId ? '(leave blank to keep current)' : ''}
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
          <div className="field-grid-2">
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
            <div>
              <label className="form-label">Employee ID</label>
              <input
                className="input-field"
                value={form.employee_id}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    employee_id: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="form-label">Designation</label>
            <input
              className="input-field"
              value={form.designation}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  designation: event.target.value,
                }))
              }
            />
          </div>
          <div className="inline-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Teacher' : 'Add Teacher'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyTeacherForm)
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Subjects</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>
                    <p className="font-semibold text-slate-900">{teacher.user?.name}</p>
                    <p className="text-xs text-slate-500">{teacher.user?.email}</p>
                    <p className="text-xs text-slate-500">
                      {teacher.employee_id} / {teacher.designation}
                    </p>
                  </td>
                  <td>{teacher.department?.name}</td>
                  <td>{teacher.subjects_count}</td>
                  <td>
                    <div className="inline-actions">
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => {
                          setEditingId(teacher.id)
                          setForm({
                            name: teacher.user?.name ?? '',
                            email: teacher.user?.email ?? '',
                            password: '',
                            department_id: String(teacher.department?.id ?? ''),
                            employee_id: teacher.employee_id ?? '',
                            designation: teacher.designation ?? '',
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(teacher.id)}
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
    </SectionCard>
  )
}

export default TeacherSection
