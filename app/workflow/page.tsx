"use client";

import { useEffect, useState } from 'react';

const industries = [
  'FinTech',
  'Healthcare',
  'EdTech',
  'Retail',
  'Logistics',
  'Energy',
  'Real Estate',
  'Manufacturing',
  'Agriculture',
  'Entertainment',
];

interface BlockInfo {
  value: string;
  size: number;
  lastUpdated: string;
}

interface StatusResponse {
  sharedBlocks: Record<string, BlockInfo>;
}

export default function WorkflowDashboard() {
  const [status, setStatus] = useState<Record<string, BlockInfo>>({});
  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState('FinTech');
  const [started, setStarted] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/letta-workflow?action=status');
      const json = await res.json();
      if (json?.status?.sharedBlocks) {
        setStatus(json.status.sharedBlocks as StatusResponse['sharedBlocks']);
      }
      if (json?.status && !started) setStarted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      await fetch('/api/letta-workflow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', industry }),
      });
      setStarted(true);
      fetchStatus();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (started) {
      fetchStatus();
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [started]);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-extrabold mb-6 text-slate-800">MarketGap AI – Live Workflow</h1>

      {!started && (
        <div className="mb-6">
          <label className="mr-2 font-medium">Select Industry:</label>
          <select
            className="border px-2 py-1 mr-4"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-4 py-1 rounded"
            disabled={loading}
          >
            {loading ? 'Starting…' : 'Start Workflow'}
          </button>
        </div>
      )}
      {loading && <p className="text-sm text-gray-600">Refreshing…</p>}

      {/* Terminal Log */}
      {status['workflow_state'] && (
        <div className="mb-6 border rounded bg-black text-green-400 p-4 font-mono text-xs max-h-64 overflow-y-auto">
          {status['workflow_state'].value || '—'}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {Object.entries(status).map(([label, info]) => (
          <div key={label} className="border rounded p-4 shadow-sm bg-white">
            <h2 className="font-semibold mb-2 text-slate-700">{label}</h2>
            <p className="text-xs text-gray-500 mb-1">{(info.size/1024).toFixed(1)} KB</p>
            <p className="text-xs text-gray-500 mb-2">Last Updated: {new Date(info.lastUpdated).toLocaleString()}</p>
            <pre className="whitespace-pre-wrap text-sm max-h-60 overflow-y-auto bg-gray-100 p-2 rounded">
              {info.value || '—'}
            </pre>
          </div>
        ))}
      </div>
    </main>
  );
} 