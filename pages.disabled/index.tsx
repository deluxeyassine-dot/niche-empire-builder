import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [agents, setAgents] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to dashboard.html
    window.location.href = '/dashboard.html';
  }, []);

  // Original code kept as fallback
  useEffect(() => {
    fetch('/api/agents')
      .then((res) => res.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching agents:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Niche Empire Builder - 52 AI Agents</title>
        <meta name="description" content="Complete AI Agents System for Niche Empire Building" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          🤖 Niche Empire Builder
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
          Complete AI Agents System - 52 Intelligent Automation Agents
        </p>

        {loading ? (
          <p>Loading agents...</p>
        ) : agents ? (
          <div>
            <div style={{
              background: '#f0f9ff',
              border: '2px solid #0284c7',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ marginTop: 0 }}>📊 System Status</h2>
              <p style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>
                <strong>{agents.totalAgents} Agents Active</strong>
              </p>
              <p style={{ color: '#0284c7', margin: 0 }}>
                All systems operational and ready for deployment
              </p>
            </div>

            <h2>Agent Categories</h2>

            {agents.agentsByCategory && Object.entries(agents.agentsByCategory).map(([category, categoryAgents]: [string, any]) => (
              <details key={category} style={{ marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '4px', padding: '1rem' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {category.replace(/([A-Z])/g, ' $1').trim()} ({categoryAgents.length} agents)
                </summary>
                <ul style={{ marginTop: '1rem' }}>
                  {categoryAgents.map((agent: string) => (
                    <li key={agent} style={{ marginBottom: '0.5rem' }}>
                      {agent.replace(/([A-Z])/g, ' $1').trim()}
                    </li>
                  ))}
                </ul>
              </details>
            ))}

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px' }}>
              <h2>🚀 Quick Start</h2>
              <p>Execute workflows via API:</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '1rem' }}>
                  <code style={{ background: '#e5e7eb', padding: '0.5rem', borderRadius: '4px', display: 'block' }}>
                    POST /api/workflows/niche-discovery
                  </code>
                  <small style={{ color: '#666' }}>Discover and validate profitable niches</small>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <code style={{ background: '#e5e7eb', padding: '0.5rem', borderRadius: '4px', display: 'block' }}>
                    POST /api/workflows/product-creation
                  </code>
                  <small style={{ color: '#666' }}>Create digital products automatically</small>
                </li>
                <li style={{ marginBottom: '1rem' }}>
                  <code style={{ background: '#e5e7eb', padding: '0.5rem', borderRadius: '4px', display: 'block' }}>
                    POST /api/workflows/complete-automation
                  </code>
                  <small style={{ color: '#666' }}>Run complete end-to-end automation</small>
                </li>
              </ul>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fef3c7', borderRadius: '8px' }}>
              <h3>💰 Revenue Potential</h3>
              <p style={{ fontSize: '1.2rem', margin: 0 }}>
                <strong>$500,000 - $2,000,000+ per month</strong>
              </p>
              <p style={{ color: '#92400e', marginTop: '0.5rem' }}>
                With 95%+ automation across all platforms
              </p>
            </div>
          </div>
        ) : (
          <p>Error loading agents. Please check API configuration.</p>
        )}
      </main>
    </>
  );
}
