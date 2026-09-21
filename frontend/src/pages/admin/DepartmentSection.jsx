import { useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import api from '../../services/api.js'

const emptyDepartmentForm = { name: '', code: '', description: '' }

function DepartmentSection({ departments, onRefresh }) {
  const [form, setForm] = useState(emptyDepartmentForm)
  const [editingId, setEditingId] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      ...form,
      description: form.description || null,
    }

    if (editingId) {
      await api.put(`/admin/departments/${editingId}`, payload)
    } else {
      await api.post('/admin/departments', payload)
    }

    setForm(emptyDepartmentForm)
    setEditingId(null)
    await onRefresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this department?')) return
    await api.delete(`/admin/departments/${id}`)
    await onRefresh()
  }

  return (
    <SectionCard
      id="departments"
      eyebrow="Configuration"
      title="Departments"
      description="Create and update department names, codes and short notes."
    >
      <div className="form-layout-sm">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Department Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </div>
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
            <label className="form-label">Description</label>
            <textarea
              className="textarea-field"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>
          <div className="inline-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Department' : 'Add Department'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyDepartmentForm)
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
                <th>Code</th>
                <th>Teachers</th>
                <th>Students</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id}>
                  <td>
                    <p className="font-semibold text-slate-900">{department.name}</p>
                    <p className="text-xs text-slate-500">{department.description}</p>
                  </td>
                  <td>{department.code}</td>
                  <td>{department.teachers_count}</td>
                  <td>{department.students_count}</td>
                  <td>
                    <div className="inline-actions">
                      <button
                        type="button"
                        className="btn-secondary btn-sm"
                        onClick={() => {
                          setEditingId(department.id)
                          setForm({
                            name: department.name,
                            code: department.code,
                            description: department.description ?? '',
                          })
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-danger btn-sm"
                        onClick={() => handleDelete(department.id)}
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

export default DepartmentSection
