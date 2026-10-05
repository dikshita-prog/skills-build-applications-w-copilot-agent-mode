import { useEffect, useState } from 'react';
import { apiBaseUrl, collectionItems, displayReference, formatDate } from '../api.js';
import DataState from './DataState.jsx';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadActivities() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/api/activities/`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        setActivities(collectionItems(await response.json()));
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Check the API connection and try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadActivities();
    return () => controller.abort();
  }, [refreshCount]);

  return (
    <section className="resource-page">
      <div className="resource-heading">
        <div>
          <p className="resource-kicker">MOVEMENT LOG</p>
          <h1>Activities</h1>
          <p className="resource-description">Recent training recorded across the program.</p>
        </div>
        <div className="heading-actions">
          {!loading && !error && <span className="record-count">{activities.length} records</span>}
          <button className="btn refresh-button" type="button" onClick={() => setRefreshCount((count) => count + 1)} disabled={loading}>Refresh</button>
        </div>
      </div>
      {loading || error || activities.length === 0 ? (
        <DataState loading={loading} error={error} isEmpty={!loading && !error && activities.length === 0} onRetry={() => setRefreshCount((count) => count + 1)} />
      ) : (
        <div className="data-panel table-scroll">
          <table className="table data-table">
            <thead><tr><th>ACTIVITY</th><th>ATHLETE</th><th>DURATION</th><th>CALORIES</th><th>COMPLETED</th></tr></thead>
            <tbody>{activities.map((activity, index) => (
              <tr key={activity._id || `${activity.type}-${index}`}>
                <td className="primary-cell">{activity.type || 'Activity'}</td>
                <td>{displayReference(activity.user, 'Athlete')}</td>
                <td>{activity.durationMinutes ?? '—'} min</td>
                <td>{activity.calories ?? '—'}</td>
                <td>{formatDate(activity.completedAt)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Activities;