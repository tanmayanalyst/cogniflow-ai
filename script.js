// CogniFlow AI - Interactive Agent Simulation & Logic

document.addEventListener('DOMContentLoaded', () => {
  // Playground Presets Data
  const presets = {
    security: {
      language: 'TypeScript',
      code: `// Vulnerable Authentication Token Verification
export async function verifyUserToken(req, res, next) {
  const token = req.headers['x-auth-token'];
  // CRITICAL: Unhashed token comparison prone to timing attacks
  const user = await db.users.find({ token });
  if (user) {
    req.userId = user.id;
    return next();
  }
  return res.status(401).send("Unauthorized");
}`,
      steps: [
        { type: 'info', text: '⚡ Initializing Claude 3.5 Sonnet context parser...' },
        { type: 'info', text: '🔍 AST traversal detected: Plaintext token lookup in database.' },
        { type: 'warning', text: '⚠️ Vulnerability Identified: CWE-208 (Information Exposure Through Timing Discrepancy)' },
        { type: 'reasoning', text: '🧠 Reasoning: Raw auth tokens must be stored as SHA-256 digests and compared using crypto.timingSafeEqual to prevent side-channel timing leaks.' },
        { type: 'success', text: '✨ Synthesized production patch with constant-time verification:' },
        {
          type: 'code',
          content: `// CogniFlow Autonomous Patch #CF-SEC-092
import crypto from 'crypto';

export async function verifyUserToken(req, res, next) {
  const token = req.headers['x-auth-token'];
  if (!token || typeof token !== 'string') {
    return res.status(401).json({ error: "Missing authentication token" });
  }

  const tokenDigest = crypto.createHash('sha256').update(token).digest();
  const user = await db.users.find({ tokenHash: tokenDigest.toString('hex') });

  if (!user || !user.tokenSecret) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  // Guaranteed constant-time comparison
  const isValid = crypto.timingSafeEqual(
    Buffer.from(tokenDigest),
    Buffer.from(user.tokenSecret, 'hex')
  );

  if (isValid) {
    req.userId = user.id;
    return next();
  }
  return res.status(401).json({ error: "Invalid credentials" });
}`
        },
        { type: 'done', text: '✓ Verified by CogniFlow Sandbox: 12/12 unit tests passed. 0 regression risks.' }
      ]
    },

    concurrency: {
      language: 'Go',
      code: `// Concurrent Inventory Deduction Service
type InventoryService struct {
    stock map[string]int
}

func (s *InventoryService) DeductItem(item string, qty int) bool {
    // BUG: Unsynchronized concurrent map access
    if s.stock[item] >= qty {
        s.stock[item] -= qty
        return true
    }
    return false
}`,
      steps: [
        { type: 'info', text: '⚡ Initializing Go AST analyzer with Claude 3.5 Sonnet...' },
        { type: 'warning', text: '⚠️ Race Condition Detected: Concurrent map read and write without sync.RWMutex' },
        { type: 'reasoning', text: '🧠 Reasoning: Under high traffic bursts, concurrent deductions will cause fatal panic (concurrent map writes) and negative inventory anomalies.' },
        { type: 'success', text: '✨ Synthesized thread-safe atomic mutex implementation:' },
        {
          type: 'code',
          content: `// CogniFlow Thread-Safe Solution
type InventoryService struct {
    mu    sync.RWMutex
    stock map[string]int
}

func (s *InventoryService) DeductItem(item string, qty int) bool {
    s.mu.Lock()
    defer s.mu.Unlock()

    current, exists := s.stock[item]
    if !exists || current < qty {
        return false
    }

    s.stock[item] = current - qty
    return true
}`
        },
        { type: 'done', text: '✓ Go Race Detector passed (go test -race ./...). Zero deadlock conditions.' }
      ]
    },

    sql: {
      language: 'SQL / ORM',
      code: `SELECT u.id, u.email, o.order_id, o.amount, o.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.status = 'COMPLETED'
  AND o.created_at >= NOW() - INTERVAL '30 days'
ORDER BY o.created_at DESC;`,
      steps: [
        { type: 'info', text: '⚡ Analyzing PostgreSQL execution plan via Claude 3.5 Sonnet...' },
        { type: 'warning', text: '⚠️ Performance Bottleneck: Sequential scan on orders table (Est. 4.2M rows scanned).' },
        { type: 'reasoning', text: '🧠 Reasoning: Multi-column partial composite index required on (status, created_at, user_id) to convert sequential table scan into sub-millisecond index-only scan.' },
        { type: 'success', text: '✨ Generated zero-downtime concurrent indexing migration:' },
        {
          type: 'code',
          content: `-- CogniFlow DB Optimization Migration
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_active_recent
ON orders (status, created_at DESC)
INCLUDE (user_id, amount)
WHERE status = 'COMPLETED';

-- Execution speed improved from 1,420ms -> 4.8ms (295x acceleration)`
        },
        { type: 'done', text: '✓ Query execution cost dropped by 99.6%. Query cache optimized.' }
      ]
    }
  };

  let currentPreset = 'security';
  const presetButtons = document.querySelectorAll('.preset-btn');
  const inputCodeElem = document.querySelector('#playgroundInputCode code');
  const inputLanguageElem = document.getElementById('inputLanguage');
  const agentOutputStream = document.getElementById('agentOutputStream');
  const agentStatus = document.getElementById('agentStatus');
  const runBtn = document.getElementById('runSimulatorBtn');

  // Handle Preset Switching
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPreset = btn.dataset.preset;

      const data = presets[currentPreset];
      inputLanguageElem.textContent = data.language;
      inputCodeElem.textContent = data.code;
      agentOutputStream.innerHTML = `
        <div class="empty-state">
          Click <strong>"Run CogniFlow Agent"</strong> above to trigger autonomous analysis and zero-shot remediation.
        </div>
      `;
      agentStatus.innerHTML = '<span class="dot"></span> Ready';
      agentStatus.style.color = '#10b981';
    });
  });

  // Run Agent Simulation with Streaming Effect
  let isRunning = false;
  runBtn.addEventListener('click', async () => {
    if (isRunning) return;
    isRunning = true;
    runBtn.disabled = true;
    runBtn.style.opacity = '0.7';

    agentStatus.innerHTML = '<span class="dot" style="background:#f59e0b; animation: pulse 1s infinite;"></span> Reasoning...';
    agentStatus.style.color = '#f59e0b';
    agentOutputStream.innerHTML = '';

    const presetData = presets[currentPreset];

    for (const step of presetData.steps) {
      await new Promise(r => setTimeout(r, 600));

      const stepElem = document.createElement('div');
      stepElem.className = 'stream-step';
      stepElem.style.marginBottom = '12px';

      if (step.type === 'info') {
        stepElem.innerHTML = `<span style="color:#06b6d4;">${step.text}</span>`;
      } else if (step.type === 'warning') {
        stepElem.innerHTML = `<span style="color:#f59e0b; font-weight:600;">${step.text}</span>`;
      } else if (step.type === 'reasoning') {
        stepElem.innerHTML = `<div style="background:rgba(139,92,246,0.1); border-left:3px solid #8b5cf6; padding:8px 12px; border-radius:4px; color:#ddd6fe; margin:8px 0;">${step.text}</div>`;
      } else if (step.type === 'success') {
        stepElem.innerHTML = `<span style="color:#10b981; font-weight:600;">${step.text}</span>`;
      } else if (step.type === 'code') {
        stepElem.innerHTML = `<pre style="background:#05070c; border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:12px; margin-top:8px; overflow-x:auto; color:#a78bfa; font-size:0.82rem;"><code>${escapeHtml(step.content)}</code></pre>`;
      } else if (step.type === 'done') {
        stepElem.innerHTML = `<span style="color:#34d399; font-weight:700;">${step.text}</span>`;
      }

      agentOutputStream.appendChild(stepElem);
      agentOutputStream.scrollTop = agentOutputStream.scrollHeight;
    }

    agentStatus.innerHTML = '<span class="dot" style="background:#10b981;"></span> Completed';
    agentStatus.style.color = '#10b981';
    runBtn.disabled = false;
    runBtn.style.opacity = '1';
    isRunning = false;
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;');
  }

  // Modal Management
  const modal = document.getElementById('waitlistModal');
  const modalClose = document.getElementById('modalCloseBtn');
  const triggerBtns = [
    document.getElementById('requestAccessBtn'),
    document.getElementById('heroWaitlistBtn'),
    document.getElementById('loginBtn')
  ];

  triggerBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
      });
    }
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Handle Waitlist Form Submit
  const form = document.getElementById('waitlistForm');
  const successBox = document.getElementById('waitlistSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('workEmail').value;
    const size = document.getElementById('teamSize').value;

    localStorage.setItem('cogniflow_lead', JSON.stringify({ name, email, size, timestamp: new Date().toISOString() }));

    form.style.display = 'none';
    successBox.style.display = 'block';

    setTimeout(() => {
      modal.classList.remove('active');
      setTimeout(() => {
        form.style.display = 'flex';
        successBox.style.display = 'none';
        form.reset();
      }, 500);
    }, 3000);
  });
});
