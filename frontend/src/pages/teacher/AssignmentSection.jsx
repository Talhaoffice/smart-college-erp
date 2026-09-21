import { useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import { formatDateTime } from '../../lib/utils.js'
import api from '../../services/api.js'

const emptyAssignmentForm = {
  subject_id: '',
  title: '',
  description: '',
  deadline: '',
}

function AssignmentSection({ assignments, subjects, onRefresh }) {
  const [form, setForm] = useState(emptyAssignmentForm)

  async function handleSubmit(event) {
    event.preventDefault()

    await api.post('/teacher/assignments', {
      ...form,
      subject_id: Number(form.subject_id),
    })

    setForm(emptyAssignmentForm)
    await onRefresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this assignment?')) return
    await api.delete(`/teacher/assignments/${id}`)
    await onRefresh()
  }

  return (
    <SectionCard id="assignments" eyebrow="Homework" title="Assignments">
      <div className="form-layout-md">
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="form-label">Subject</label>
            <select
              className="input-field"
              value={form.subject_id}
              onChange={(event) =>
                setForm((current) => ({ ...current, subject_id: event.target.value }))
              }
            >
              <option value="">Select subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
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
            <label className="form-label">Description</label>
            <textarea
              className="textarea-field"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({ ...current, description: event.target.value }))
              }
            />
          </div>
          <div>
            <label className="form-label">Deadline</label>
            <input
              className="input-field"
              type="datetime-local"
              value={form.deadline}
              onChange={(event) =>
                setForm((current) => ({ ...current, deadline: event.target.value }))
              }
            />
          </div>
          <button type="submit" className="btn-primary">
            Publish Assignment
          </button>
        </form>

        <div className="stack-md">
          {assignments.map((assignment) => (
            <article key={assignment.id} className="list-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-800">{assignment.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{assignment.description}</p>
                </div>
                <button
                  type="button"
                  className="btn-danger btn-sm"
                  onClick={() => handleDelete(assignment.id)}
                >
                  Delete
                </button>
              </div>
              <div className="meta-row">
                <span>{assignment.subject?.name}</span>
                <span>{assignment.subject?.department?.name}</span>
                <span>{formatDateTime(assignment.deadline)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

export default AssignmentSection
