import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { getAllLeads, updateLeadStatus, deleteLead } from '../../lib/leads';
import type { Lead, LeadStatus } from '../../types/leads';
import AdminLogin from './AdminLogin';
import './Admin.css';

const STATUS_OPTIONS: LeadStatus[] = ['new', 'nurturing', 'qualified', 'contacted', 'customer'];

function scoreClass(score: number): string {
  if (score >= 81) return 'admin-score--qualified';
  if (score >= 51) return 'admin-score--hot';
  if (score >= 21) return 'admin-score--warm';
  return 'admin-score--cold';
}

function scoreLabel(score: number): string {
  if (score >= 81) return 'QUALIFIED';
  if (score >= 51) return 'HOT';
  if (score >= 21) return 'WARM';
  return 'COLD';
}

function formatDate(ts: { seconds?: number; toDate?: () => Date } | null): string {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date((ts.seconds ?? 0) * 1000);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!auth) {
      setAuthChecked(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return unsub;
  }, []);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllLeads();
      setLeads(data);
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchLeads();
  }, [user, fetchLeads]);

  if (!authChecked) return null;
  if (!user) return <AdminLogin onAuth={() => {}} />;

  const filtered = leads.filter((l) => {
    if (filter !== 'all' && l.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.email.toLowerCase().includes(q) ||
        (l.name?.toLowerCase().includes(q)) ||
        (l.company?.toLowerCase().includes(q)) ||
        l.source.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: leads.length,
    hot: leads.filter((l) => l.score >= 51).length,
    qualified: leads.filter((l) => l.score >= 81).length,
    newLeads: leads.filter((l) => l.status === 'new').length,
  };

  async function handleStatusChange(leadId: string, status: LeadStatus) {
    await updateLeadStatus(leadId, status);
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
  }

  async function handleDelete(leadId: string) {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    await deleteLead(leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  }

  async function handleLogout() {
    if (auth) await signOut(auth);
  }

  function exportCSV() {
    const headers = ['Email', 'Name', 'Company', 'Source', 'Score', 'Status', 'Products', 'Created'];
    const rows = filtered.map((l) => [
      l.email,
      l.name || '',
      l.company || '',
      l.source,
      String(l.score),
      l.status,
      l.productInterests.join('; '),
      formatDate(l.createdAt),
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ndn-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-dash">
      <div className="admin-dash__header">
        <h1 className="admin-dash__title">Lead Dashboard</h1>
        <div className="admin-dash__actions">
          <input
            className="admin-search"
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="admin-dash__logout" onClick={exportCSV} style={{ marginRight: 8 }}>Export CSV</button>
          <button className="admin-dash__logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-dash__stats">
        <div className="admin-stat">
          <div className="admin-stat__label">Total Leads</div>
          <div className="admin-stat__value">{stats.total}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__label">Hot Leads</div>
          <div className="admin-stat__value">{stats.hot}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__label">Qualified</div>
          <div className="admin-stat__value">{stats.qualified}</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__label">New (Unprocessed)</div>
          <div className="admin-stat__value">{stats.newLeads}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-dash__filters">
        {(['all', ...STATUS_OPTIONS] as const).map((s) => (
          <button
            key={s}
            className={`admin-filter-btn ${filter === s ? 'admin-filter-btn--active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Loading leads...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No leads found</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Source</th>
                <th>Score</th>
                <th>Status</th>
                <th>Products</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.email}</td>
                  <td>{lead.name || '—'}</td>
                  <td>{lead.source.replace(/_/g, ' ')}</td>
                  <td>
                    <span className={`admin-score ${scoreClass(lead.score)}`}>
                      {lead.score} · {scoreLabel(lead.score)}
                    </span>
                  </td>
                  <td>
                    <select
                      className="admin-status-select"
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>{lead.productInterests.join(', ') || '—'}</td>
                  <td>{formatDate(lead.createdAt)}</td>
                  <td>
                    <button className="admin-delete-btn" onClick={() => handleDelete(lead.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
