import { useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import api from '../../services/api.js'

const emptySubjectForm = {
  code: '',
  name: '',
  department_id: '',
  teacher_id: '',
  credits: '3',
}

function SubjectSection({ departments, subjects, teachers, onRefresh }) {
  const [form, setForm] = useState(emptySubjectForm)
  const [editingId, setEditingId] = useState(null)

  const teacherOptions = form.department_id
    ? teachers.filter((teacher) => teacher.department?.id === Number(form.department_id))
    : teachers

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      ...form,
      department_id: Number(form.department_id),
      teacher_id: form.teacher_id ? Number(form.teacher_id) : null,
      credits: Number(form.credits),
    }

    if (editingId) {
      await api.put(`/admin/subjects/${editingId}`, payload)
    } else {
      await api.post('/admin/subjects', payload)
    }

    setForm(emptySubjectForm)
    setEditingId(null)
    await onRefresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this subject?')) return
    await api.delete(`/admin/subjects/${id}`)
    await onRefresh()
  }

  return (
    <SectionCard
      id="subjects"
      eyebrow="Academics"
      title="Subjects and Teacher Assignment"
    >
      <div className="form-layout-md">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="field-grid-2">
            <div>
              <label className="form-label">Code</label>
              <input
                className="input-field"
                value={form.code}
                onChange={(event) =>
                  setForm((current) => ({ ...current, code: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="form-label">Credits</label>
              <input
                className="input-field"
                type="number"
                min="1"
                max="6"
                value={form.credits}
                onChange={(event) =>
                  setForm((current) => ({ ...current, credits: event.target.value }))
                }
              />
            </div>
          </div>
          <div>
            <label className="form-label">Subject Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
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
                  teacher_id: '',
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
            <label className="form-label">Assigned Teacher</label>
            <select
              className="input-field"
              value={form.teacher_id}
              onChange={(event) =>
                setForm((current) => ({ ...current, teacher_id: event.target.value }))
              }
            >
              <option value="">Unassigned</option>
              {teacherOptions.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.user?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="inline-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Subject' : 'Add Subject'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptySubjectForm)
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
                <th>Subject</th>
                <th>Department</th>
                <th>Teacher</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>
                    <p className="font-semibold text-slate-900">{subject.name}</p>
                    <p className="text-xs text-slate-500">
                      {subject.code} / {subject.credits} credits
                    </p>
                  </td>
                  <td>{subject.department?.name}</td>
                  <td>{subject.teacher?.user?.name ?? 'Unassigned'}</td>
                  <td>
                    <div className="inline-actions">
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => {
                          setEditingId(subject.id)
                          setForm({
                            code: subject.code ?? '',
                            name: subject.name ?? '',
                            department_id: String(subject.department?.id ?? ''),
                            teacher_id: String(subject.teacher?.id ?? ''),
                            credits: String(subject.credits ?? 3),
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(subject.id)}
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

export default SubjectSection
