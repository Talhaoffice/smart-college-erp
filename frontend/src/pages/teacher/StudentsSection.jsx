import { useState } from 'react'
import SectionCard from '../../components/ui/SectionCard.jsx'

function StudentsSection({ students, subjects }) {
  const [subjectFilter, setSubjectFilter] = useState('')

  const visibleStudents = subjectFilter
    ? students.filter((student) => {
        const subject = subjects.find((item) => item.id === Number(subjectFilter))
        return subject && student.department?.id === subject.department_id
      })
    : students

  return (
    <SectionCard
      id="students"
      eyebrow="Directory"
      title="Students by subject or department"
      description="Quickly inspect the student roster within your teaching scope."
    >
      <div className="stack-md">
        <select
          className="input-field max-w-sm"
          value={subjectFilter}
          onChange={(event) => setSubjectFilter(event.target.value)}
        >
          <option value="">All assigned subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>

        <div className="table-wrap">
          <table className="table-base">
            <thead>
              <tr>
                <th>Student</th>
                <th>Department</th>
                <th>Enrollment</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <p className="font-semibold text-slate-900">{student.user?.name}</p>
                    <p className="text-xs text-slate-500">{student.user?.email}</p>
                  </td>
                  <td>{student.department?.name}</td>
                  <td>{student.enrollment_no}</td>
                  <td>{student.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  )
}

export default StudentsSection
