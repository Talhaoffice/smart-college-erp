import { useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import { formatDateTime } from '../../lib/utils.js'
import api from '../../services/api.js'

const emptyNoticeForm = { title: '', content: '', target_department_id: '' }

function NoticeSection({ departments, notices, onRefresh }) {
  const [form, setForm] = useState(emptyNoticeForm)
  const [editingId, setEditingId] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      ...form,
      target_department_id: form.target_department_id
        ? Number(form.target_department_id)
        : null,
    }

    if (editingId) {
      await api.put(`/admin/notices/${editingId}`, payload)
    } else {
      await api.post('/admin/notices', payload)
    }

    setForm(emptyNoticeForm)
    setEditingId(null)
    await onRefresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this notice?')) return
    await api.delete(`/admin/notices/${id}`)
    await onRefresh()
  }

  return (
    <SectionCard id="notices" eyebrow="Communications" title="Notice Board">
      <div className="form-layout-md">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Title</label>
            <input
              className="input-field"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({ ...current, title: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="form-label">Target Department</label>
            <select
              className="input-field"
              value={form.target_department_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  target_department_id: event.target.value,
                }))
              }
            >
              <option value="">All departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Content</label>
            <textarea
              className="textarea-field"
              value={form.content}
              onChange={(event) =>
                setForm((current) => ({ ...current, content: event.target.value }))
              }
            />
          </div>
          <div className="inline-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Notice' : 'Publish Notice'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyNoticeForm)
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="stack-md">
          {notices.map((notice) => (
            <article key={notice.id} className="list-card">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-800">{notice.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{notice.content}</p>
                </div>
                <div className="inline-actions">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={() => {
                      setEditingId(notice.id)
                      setForm({
                        title: notice.title ?? '',
                        content: notice.content ?? '',
                        target_department_id: String(notice.target_department_id ?? ''),
                      })
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn-danger btn-sm"
                    onClick={() => handleDelete(notice.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="meta-row">
                <span>{notice.is_global ? 'All Departments' : notice.department?.name}</span>
                <span>{notice.author?.name}</span>
                <span>{formatDateTime(notice.created_at)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

export default NoticeSection
