import { useEffect, useState } from 'react';
import { apiBaseUrl, collectionItems, displayReference } from '../api.js';
import DataState from './DataState.jsx';

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadLeaderboard() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/api/leaderboard/`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        setEntries(collectionItems(await response.json()));
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Check the API connection and try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadLeaderboard();
    return () => controller.abort();
  }, [refreshCount]);

  return (
    <section className="resource-page">
      <div className="resource-heading">
        <div>
          <p className="resource-kicker">POINTS TABLE</p>
          <h1>Leaderboard</h1>
          <p className="resource-description">A snapshot of points earned by the team.</p>
        </div>
        <div className="heading-actions">
          {!loading && !error && <span className="record-count">{entries.length} athletes</span>}
          <button className="btn refresh-button" type="button" onClick={() => setRefreshCount((count) => count + 1)} disabled={loading}>Refresh</button>
        </div>
      </div>
      {loading || error || entries.length === 0 ? (
        <DataState loading={loading} error={error} isEmpty={!loading && !error && entries.length === 0} onRetry={() => setRefreshCount((count) => count + 1)} />
      ) : (
        <div className="data-panel table-scroll">
          <table className="table data-table">
            <thead><tr><th>RANK</th><th>ATHLETE</th><th>TEAM</th><th>POINTS</th></tr></thead>
            <tbody>{entries.map((entry, index) => (
              <tr key={entry._id || `${entry.user}-${index}`}>
                <td className="rank-cell">{entry.rank ?? index + 1}</td>
                <td className="primary-cell">{displayReference(entry.user, 'Athlete')}</td>
                <td>{displayReference(entry.team, 'Team')}</td>
                <td><span className="value-pill">{entry.points ?? 0} pts</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Leaderboard;