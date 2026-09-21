import { statusTone } from '../../lib/utils.js'

function Badge({ value }) {
  return <span className={`status-chip ${statusTone(value)}`}>{value}</span>
}

export default Badge
