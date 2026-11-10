// Selected work, in display order. Keep every claim checkable against the linked code.
const gh = (repo) => `https://github.com/MaximusAnax/${repo}`;

module.exports = [
  {
    id: "orbit",
    title: "Orbit",
    kind: "Agent memory",
    years: "2026",
    status: "v2 in progress",
    tagline: "Relationship memory, built three times, each time closer to the agent.",
    summary:
      "Orbit remembers what the people in your life told you, so you can follow up like you were paying attention. I've rebuilt it three times. Each version moves more of the work from app code into a model that is constrained, evaluated and auditable.",
    versions: [
      {
        tag: "v0",
        name: "Web app",
        text: "Next.js and Supabase with pgvector semantic search. OpenAI extracts people, facts and follow-ups from notes.",
        links: [
          { label: "Live demo", href: "https://orbit-six-blond.vercel.app" },
          { label: "Code", href: gh("orbit-web") },
        ],
      },
      {
        tag: "v1",
        name: "Local-first iOS",
        text: "Swift packages over a bitemporal SQLite ledger, on-device Whisper, and versioned extraction prompts gated by an eval harness.",
        links: [{ label: "Code", href: gh("orbit") }],
      },
      {
        tag: "v2",
        name: "Agent-native",
        text: "No app at all: plain-text memory operated by Claude skills (capture, brief, connect, gardening), with ratchet CI and an eval suite.",
        links: [],
        note: "Private while it holds real data",
      },
    ],
    stack: ["Swift", "SQLite", "Whisper", "Next.js", "Supabase", "pgvector", "Claude"],
  },
  {
    id: "traceback",
    title: "TraceBack",
    kind: "Autonomous maintenance",
    years: "2026",
    status: "2nd place · Felicis Hackathon",
    tagline: "Production errors in, reviewable pull requests out.",
    summary:
      "TraceBack takes incidents from Sentry and GitHub and routes each one through three agents: Maestro plans, Surgeon edits, and Verifier gates. Before a PR opens, each run records its reproduction attempts, reasoning, rule audit and cost for a human to review.",
    points: [
      "Fastify and BullMQ/Redis pipeline on the Cursor SDK, with every handoff between agents validated by Zod schemas.",
      "Built evidence-first: the gate decides on review artifacts, not blind auto-merge. Next step: run the reproduction test in a sandbox so the gate proves the fix, not just records it.",
      "The hackathon prototype (a Claude tool-use loop, a rule-based patch auditor, and a human approval dashboard) placed 2nd of 50+ teams at the Felicis Hackathon.",
    ],
    stack: ["TypeScript", "Fastify", "BullMQ", "Redis", "Zod", "Cursor SDK"],
    links: [
      { label: "Code", href: gh("traceback-ai") },
      { label: "Hackathon demo", href: gh("traceback_ai_hackathon_demo") },
    ],
  },
  {
    id: "cua",
    title: "Computer-use agent research",
    kind: "Research · CMU Machine Learning Dept.",
    years: "2026 –",
    status: "Ongoing",
    tagline: "Why do agents that drive a desktop from pixels fail, and how can small models do it?",
    summary:
      "I work with Prof. Matt Gormley on computer-use agents for small, on-device vision-language models that act from screen pixels alone.",
    points: [
      "Built an OSWorld-style harness: it runs tasks automatically, logs every trajectory, and makes benchmark runs reproducible.",
      "Built failure-analysis tooling: trace logging, failure detectors, and failure attribution by a VLM judge.",
      "Designed a modular agent with separate perception, planning, action-selection and recovery components.",
    ],
    stack: ["Python", "VLMs", "OSWorld"],
    links: [],
    note: "Lab code is private",
  },
  {
    id: "terrabot",
    title: "TerraBot greenhouse agent",
    kind: "Autonomous agents · 15-482",
    years: "2026",
    status: "Hands-off deployment",
    tagline: "Keeping real plants alive with no human in the loop.",
    summary:
      "A team-built agent for CMU's TerraBot, a sensor-laden greenhouse robot. It ran on its own for a multi-week grow period. The agent sensed, planned and acted on light, water, temperature and humidity, and monitors checked its work.",
    points: [
      "Behaviors are finite-state machines on ROS, run by a scheduler, with safety limits on every actuator.",
      "Monitors check that sensors are sane, that each behavior actually achieved its effect, and that the logs show it.",
      "A camera pipeline measures plant health. The agent was tested in simulation before the real deployment.",
    ],
    stack: ["Python", "ROS", "FSMs", "OpenCV"],
    links: [{ label: "Design write-up", href: gh("terrabot-agent") }],
    note: "Course code stays private per course policy",
  },
  {
    id: "hirevault",
    title: "HireVault",
    kind: "Full-stack product",
    years: "2026",
    status: "Working MVP",
    tagline: "A command center for the job search.",
    summary:
      "A Turborepo monorepo: a Next.js 15 web app, a Chrome MV3 extension that captures postings, LaTeX resume templates for tailoring, and Supabase underneath.",
    points: [],
    stack: ["Next.js 15", "Turborepo", "Chrome MV3", "Supabase", "LaTeX"],
    links: [{ label: "Code", href: gh("hire-vault") }],
  },
  {
    id: "contract-clarity",
    title: "Contract Clarity",
    kind: "LLM product",
    years: "2026",
    status: "4-day MVP",
    tagline: "Upload a contract. Get the summary, the red flags, and the jargon in plain English.",
    summary:
      "Built on Next.js and Claude. It turns a contract into a structured analysis and exports a PDF report.",
    points: [],
    stack: ["Next.js", "TypeScript", "Claude"],
    links: [{ label: "Code", href: gh("contract-clarity") }],
  },
  {
    id: "portfolio-optimizer",
    title: "Regime-switching portfolio optimizer",
    kind: "Quant",
    years: "2024 –",
    status: "Personal project",
    tagline: "Allocate differently when the market changes regime.",
    summary:
      "A Hidden Markov Model labels markets as calm or crisis. Mean-variance allocation with Ledoit-Wolf shrinkage then blends the portfolio for each regime, and a walk-forward backtest checks it against benchmarks.",
    points: [],
    stack: ["Python", "HMM", "MPT", "Backtesting"],
    links: [{ label: "Code", href: gh("portfolio_optimizer") }],
  },
];
