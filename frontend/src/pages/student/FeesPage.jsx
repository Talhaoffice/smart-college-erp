import { CreditCard, GraduationCap, UserRound } from 'lucide-react'
import Badge from '../../components/ui/Badge.jsx'
import Card from '../../components/ui/Card.jsx'
import PageIntro from '../../components/ui/PageIntro.jsx'
import StatCard from '../../components/ui/StatCard.jsx'
import { currency, formatDate } from '../../lib/utils.js'
import { useStudentPortal } from './StudentLayout.jsx'

function StudentFeesPage() {
  const { fees, dashboard } = useStudentPortal()

  const feeAccent =
    fees?.status === 'paid' ? 'emerald' : fees?.status === 'partial' ? 'amber' : 'rose'

  return (
    <>
      <PageIntro
        eyebrow="Fees"
        title="Fees"
        description="Current fee record and a quick reminder section."
      />

      <section className="stats-grid stats-grid-3">
        <StatCard
          label="Status"
          value={fees?.status ?? 'N/A'}
          hint="Current payment state"
          icon={CreditCard}
          accent={feeAccent}
        />
        <StatCard
          label="Amount"
          value={currency(fees?.amount)}
          hint="Assigned fee amount"
          icon={GraduationCap}
          accent="sky"
        />
        <StatCard
          label="Due Date"
          value={fees?.due_date ? formatDate(fees.due_date) : 'Not set'}
          hint="Latest due date on file"
          icon={UserRound}
          accent="amber"
        />
      </section>

      <div className="detail-grid detail-grid-wide">
        <Card className="section-card">
          <p className="section-kicker">Current Record</p>
          <h3 className="section-title mt-2">Fee summary</h3>

          <div className="field-grid-2 mt-5">
            <div className="muted-panel">
              <p className="tiny-label">Payment Status</p>
              <div className="mt-3">
                <Badge value={fees?.status ?? 'N/A'} />
              </div>
            </div>

            <div className="muted-panel">
              <p className="tiny-label">Fee Amount</p>
              <p className="mt-3 text-2xl font-semibold text-slate-800">
                {currency(fees?.amount)}
              </p>
            </div>

            <div className="muted-panel">
              <p className="tiny-label">Due Date</p>
              <p className="mt-3 font-semibold text-slate-800">
                {fees?.due_date ? formatDate(fees.due_date) : 'Not assigned'}
              </p>
            </div>

            <div className="muted-panel">
              <p className="tiny-label">Department</p>
              <p className="mt-3 font-semibold text-slate-800">
                {dashboard?.profile?.department?.name ?? 'Department'}
              </p>
            </div>
          </div>
        </Card>

        <Card subtle className="section-card">
          <p className="section-kicker">Quick Note</p>
          <h3 className="section-title mt-2">Simple finance reference</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            If this record looks incorrect, the safest next step is to confirm the
            amount and due date with the college office before making any payment.
          </p>

          <div className="stack-sm mt-5 text-sm text-slate-600">
            <div className="list-card">
              Semester {dashboard?.profile?.semester ?? '-'} /{' '}
              {dashboard?.profile?.enrollment_no ?? 'Enrollment pending'}
            </div>
            <div className="list-card">Contact the admin desk if you need a receipt correction or due-date clarification.</div>
          </div>
        </Card>
      </div>
    </>
  )
}

export default StudentFeesPage
