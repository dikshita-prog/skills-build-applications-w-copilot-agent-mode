import { useEffect, useState } from 'react';
import { apiBaseUrl, collectionItems } from '../api.js';
import DataState from './DataState.jsx';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadTeams() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiBaseUrl}/api/teams/`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        setTeams(collectionItems(await response.json()));
      } catch (requestError) {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Check the API connection and try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadTeams();
    return () => controller.abort();
  }, [refreshCount]);

  return (
    <section className="resource-page">
      <div className="resource-heading">
        <div>
          <p className="resource-kicker">GROUPS</p>
          <h1>Teams</h1>
          <p className="resource-description">Groups training and earning points together.</p>
        </div>
        <div className="heading-actions">
          {!loading && !error && <span className="record-count">{teams.length} teams</span>}
          <button className="btn refresh-button" type="button" onClick={() => setRefreshCount((count) => count + 1)} disabled={loading}>Refresh</button>
        </div>
      </div>
      {loading || error || teams.length === 0 ? (
        <DataState loading={loading} error={error} isEmpty={!loading && !error && teams.length === 0} onRetry={() => setRefreshCount((count) => count + 1)} />
      ) : (
        <div className="data-panel table-scroll">
          <table className="table data-table">
            <thead><tr><th>TEAM</th><th>ABOUT</th><th>MEMBERS</th><th>POINTS</th></tr></thead>
            <tbody>{teams.map((team, index) => (
              <tr key={team._id || `${team.name}-${index}`}>
                <td className="primary-cell">{team.name || 'Unnamed team'}</td>
                <td>{team.description || '—'}</td>
                <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
                <td><span className="value-pill">{team.points ?? 0} pts</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Teams;