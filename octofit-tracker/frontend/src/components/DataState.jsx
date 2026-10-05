function DataState({ loading, error, isEmpty, onRetry }) {
  if (loading) {
    return (
      <div className="state-panel" role="status">
        <p className="state-title">Loading records</p>
        <p>Connecting to the OctoFit API.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-panel" role="alert">
        <p className="state-title">Records could not be loaded</p>
        <p>{error}</p>
        <button className="state-action" type="button" onClick={onRetry}>Try again</button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="state-panel">
        <p className="state-title">No records yet</p>
        <p>New entries will appear here when they are available.</p>
      </div>
    );
  }

  return null;
}

export default DataState;