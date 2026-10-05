import { useEffect, useState } from 'react';
import { apiBaseUrl, collectionItems, displayReference } from '../api.js';
import DataState from './DataState.jsx';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadUsers() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/api/users/`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        setUsers(collectionItems(await response.json()));
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Check the API connection and try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadUsers();
    return () => controller.abort();
  }, [refreshCount]);

  return (
    <section className="resource-page">
      <div className="resource-heading">
        <div>
          <p className="resource-kicker">DIRECTORY</p>
          <h1>Athletes</h1>
          <p className="resource-description">Student profiles and points earned.</p>
        </div>
        <div className="heading-actions">
          {!loading && !error && <span className="record-count">{users.length} athletes</span>}
          <button className="btn refresh-button" type="button" onClick={() => setRefreshCount((count) => count + 1)} disabled={loading}>Refresh</button>
        </div>
      </div>
      {loading || error || users.length === 0 ? (
        <DataState loading={loading} error={error} isEmpty={!loading && !error && users.length === 0} onRetry={() => setRefreshCount((count) => count + 1)} />
      ) : (
        <div className="data-panel table-scroll">
          <table className="table data-table">
            <thead><tr><th>ATHLETE</th><th>USERNAME</th><th>EMAIL</th><th>TEAM</th><th>POINTS</th></tr></thead>
            <tbody>{users.map((user, index) => (
              <tr key={user._id || `${user.username}-${index}`}>
                <td className="primary-cell">{user.name || user.username || 'Athlete'}</td>
                <td>{user.username || '—'}</td>
                <td>{user.email || '—'}</td>
                <td>{displayReference(user.team, 'Team')}</td>
                <td><span className="value-pill">{user.points ?? 0} pts</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Users;