import { useEffect, useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'
import api from '../../services/api.js'

function AttendanceSection({ subjects }) {
  const [subjectId, setSubjectId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (!subjects.length) return
    if (!subjectId) {
      setSubjectId(String(subjects[0].id))
      return
    }

    loadAttendance(subjectId, date)
  }, [subjects, subjectId, date])

  async function loadAttendance(currentSubjectId, currentDate) {
    const { data } = await api.get('/teacher/attendance', {
      params: {
        subject_id: currentSubjectId,
        date: currentDate,
      },
    })

    setRows(data.data)
  }

  async function submitAttendance(event) {
    event.preventDefault()

    await api.post('/teacher/attendance', {
      subject_id: Number(subjectId),
      date,
      entries: rows.map((row) => ({
        student_id: row.student_id,
        status: row.status || 'present',
      })),
    })

    await loadAttendance(subjectId, date)
  }

  return (
    <SectionCard id="attendance" eyebrow="Attendance" title="Mark attendance date-wise">
      <form className="space-y-4" onSubmit={submitAttendance}>
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
            <label className="form-label">Date</label>
            <input
              className="input-field"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.student_id}>
                  <td>{row.name}</td>
                  <td>{row.enrollment_no}</td>
                  <td>
                    <select
                      className="input-field table-input"
                      value={row.status ?? 'present'}
                      onChange={(event) =>
                        setRows((current) =>
                          current.map((item, currentIndex) =>
                            currentIndex === index
                              ? { ...item, status: event.target.value }
                              : item,
                          ),
                        )
                      }
                    >
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="excused">Excused</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="submit" className="btn-primary">
          Save Attendance
        </button>
      </form>
    </SectionCard>
  )
}

export default AttendanceSection
