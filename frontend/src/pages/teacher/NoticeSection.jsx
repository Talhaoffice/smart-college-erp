import { useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import { formatDateTime } from '../../lib/utils.js'
import api from '../../services/api.js'

const emptyNoticeForm = {
  title: '',
  content: '',
  target_department_id: '',
}

function NoticeSection({ notices, subjects, onRefresh }) {
  const [form, setForm] = useState(emptyNoticeForm)
  const departmentOptions = Array.from(
    new Map(
      subjects.map((subject) => [subject.department.id, subject.department]),
    ).values(),
  )

  async function handleSubmit(event) {
    event.preventDefault()

    await api.post('/teacher/notices', {
      ...form,
      target_department_id: form.target_department_id
        ? Number(form.target_department_id)
        : null,
    })

    setForm(emptyNoticeForm)
    await onRefresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this notice?')) return
    await api.delete(`/teacher/notices/${id}`)
    await onRefresh()
  }

  return (
    <SectionCard id="notices" eyebrow="Notices" title="Department or global notices">
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
              <option value="">All Students</option>
              {departmentOptions.map((department) => (
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
          <button type="submit" className="btn-primary">
            Publish Notice
          </button>
        </form>

        <div className="stack-md">
          {notices.map((notice) => (
            <article key={notice.id} className="list-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-800">{notice.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{notice.content}</p>
                </div>
                <button
                  type="button"
                  className="btn-danger btn-sm"
                  onClick={() => handleDelete(notice.id)}
                >
                  Delete
                </button>
              </div>
              <div className="meta-row">
                <span>{notice.is_global ? 'All Students' : notice.department?.name}</span>
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
