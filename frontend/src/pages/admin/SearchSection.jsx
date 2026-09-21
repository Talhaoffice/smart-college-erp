import { useDeferredValue, useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge.jsx'
import SectionCard from '../../components/ui/SectionCard.jsx'
import api from '../../services/api.js'

function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearch = useDeferredValue(searchQuery)
  const [searchResult, setSearchResult] = useState(null)
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    if (deferredSearch.trim().length < 5) {
      setSearchResult(null)
      setSearchError('')
      return
    }

    api
      .get(`/students/search/${encodeURIComponent(deferredSearch.trim())}`)
      .then(({ data }) => {
        setSearchResult(data.data)
        setSearchError('')
      })
      .catch((requestError) => {
        setSearchResult(null)
        setSearchError(
          requestError.response?.data?.message ?? 'No student matched that enrollment number.',
        )
      })
  }, [deferredSearch])

  return (
    <SectionCard
      id="search"
      eyebrow="Instant Search"
      title="Find a student by enrollment number"
      description="Type an enrollment number to pull the matching record."
    >
      <div className="form-layout-md">
        <div>
          <label className="form-label" htmlFor="enrollment-search">
            Enrollment Number
          </label>
          <input
            id="enrollment-search"
            className="input-field"
            placeholder="Example: IT2026001"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchError ? <p className="mt-2 text-sm text-rose-600">{searchError}</p> : null}
        </div>

        <div className="muted-panel">
          {searchResult ? (
            <div className="field-grid-2">
              <div>
                <p className="tiny-label">Student Name</p>
                <p className="mt-1 font-semibold text-slate-900">{searchResult.name}</p>
              </div>
              <div>
                <p className="tiny-label">Department</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {searchResult.department?.name}
                </p>
              </div>
              <div>
                <p className="tiny-label">Enrollment</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {searchResult.enrollment_no}
                </p>
              </div>
              <div>
                <p className="tiny-label">Fee Status</p>
                <div className="mt-1">
                  <Badge value={searchResult.fee?.status ?? 'N/A'} />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              Search results will appear here once a matching enrollment number is found.
            </p>
          )}
        </div>
      </div>
    </SectionCard>
  )
}

export default SearchSection
