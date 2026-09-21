function LoadingScreen({ label = 'Loading' }) {
  return (
    <div className="center-shell">
      <div className="card loading-card">
        <div className="mx-auto spinner" />
        <div>
          <p className="section-kicker">Please wait</p>
          <h1 className="mt-2 text-xl font-semibold text-slate-800">{label}</h1>
          <p className="mt-2 text-sm text-slate-500">Loading your data and portal view.</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
