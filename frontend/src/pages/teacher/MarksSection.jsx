import { useEffect, useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import api from '../../services/api.js'

function MarksSection({ subjects }) {
  const [subjectId, setSubjectId] = useState('')
  const [marksType, setMarksType] = useState('internal')
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (!subjects.length) return
    if (!subjectId) {
      setSubjectId(String(subjects[0].id))
      return
    }

    loadMarks(subjectId)
  }, [subjects, subjectId])

  async function loadMarks(currentSubjectId) {
    const { data } = await api.get('/teacher/marks', {
      params: {
        subject_id: currentSubjectId,
      },
    })

    setRows(data.data)
  }

  async function submitMarks(event) {
    event.preventDefault()

    await api.post('/teacher/marks', {
      subject_id: Number(subjectId),
      marks_type: marksType,
      entries: rows.map((row) => ({
        student_id: row.student_id,
        marks:
          marksType === 'internal'
            ? Number(row.internal || 0)
            : Number(row.external || 0),
      })),
    })

    await loadMarks(subjectId)
  }

  return (
    <SectionCard id="marks" eyebrow="Assessment" title="Upload marks">
      <form className="space-y-4" onSubmit={submitMarks}>
        <div className="field-grid-2">
          <div>
            <label className="form-label">Subject</label>
            <select
              className="input-field"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Marks Type</label>
            <select
              className="input-field"
              value={marksType}
              onChange={(event) => setMarksType(event.target.value)}
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrollment</th>
                <th>{marksType === 'internal' ? 'Internal Marks' : 'External Marks'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.student_id}>
                  <td>{row.name}</td>
                  <td>{row.enrollment_no}</td>
                  <td>
                    <input
                      className="input-field table-input"
                      type="number"
                      min="0"
                      max="100"
                      value={marksType === 'internal' ? row.internal ?? '' : row.external ?? ''}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item, currentIndex) =>
                            currentIndex === index
                              ? {
                                  ...item,
                                  [marksType]: event.target.value,
                                }
                              : item,
                          ),
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="btn-primary">
          Save {marksType === 'internal' ? 'Internal' : 'External'} Marks
        </button>
      </form>
    </SectionCard>
  )
}

export default MarksSection
