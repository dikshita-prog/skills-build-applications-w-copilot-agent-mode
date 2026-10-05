import { useEffect, useState } from 'react';
import { apiBaseUrl, collectionItems } from '../api.js';
import DataState from './DataState.jsx';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadWorkouts() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/api/workouts/`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        setWorkouts(collectionItems(await response.json()));
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Check the API connection and try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadWorkouts();
    return () => controller.abort();
  }, [refreshCount]);

  return (
    <section className="resource-page">
      <div className="resource-heading">
        <div>
          <p className="resource-kicker">TRAINING LIBRARY</p>
          <h1>Workouts</h1>
          <p className="resource-description">Sessions matched to different training levels.</p>
        </div>
        <div className="heading-actions">
          {!loading && !error && <span className="record-count">{workouts.length} workouts</span>}
          <button className="btn refresh-button" type="button" onClick={() => setRefreshCount((count) => count + 1)} disabled={loading}>Refresh</button>
        </div>
      </div>
      {loading || error || workouts.length === 0 ? (
        <DataState loading={loading} error={error} isEmpty={!loading && !error && workouts.length === 0} onRetry={() => setRefreshCount((count) => count + 1)} />
      ) : (
        <div className="data-panel table-scroll">
          <table className="table data-table">
            <thead><tr><th>WORKOUT</th><th>TARGET</th><th>DURATION</th><th>DIFFICULTY</th></tr></thead>
            <tbody>{workouts.map((workout, index) => (
              <tr key={workout._id || `${workout.title}-${index}`}>
                <td className="primary-cell">{workout.title || 'Workout'}<span className="secondary-cell">{workout.description || 'No description'}</span></td>
                <td>{workout.target || '—'}</td>
                <td>{workout.durationMinutes ?? '—'} min</td>
                <td><span className="value-pill">{workout.difficulty || 'Unrated'}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Workouts;