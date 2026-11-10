// Personal agent systems I run day to day. Private (they touch my own data); described here, not linked.
module.exports = {
  intro:
    "Personal systems I run every day. They stay private because they touch my own messages, health and accounts, but each one is a small agent with guardrails.",
  items: [
    {
      name: "Clip Desk",
      text: "Turns raw footage into vertical shorts with word-timed captions (faster-whisper), hooks and speaker tags. Long renders run in resumable chunks.",
      tags: ["Video", "Whisper", "Pipelines"],
    },
    {
      name: "Role Radar",
      text: "Watches about 170 companies' hiring systems, 127 job boards and 8 GitHub job lists. It ranks new roles and sends a daily email digest, using public data only.",
      tags: ["Crawling", "Ranking", "Automation"],
    },
    {
      name: "Whoop Sync",
      text: "Mirrors sleep and workouts from the Whoop API into Google Calendar through read-only OAuth, and never creates duplicates.",
      tags: ["OAuth", "Sync", "Calendar"],
    },
    {
      name: "Grade Outlook",
      text: "Pulls Canvas and Gradescope and works out each course's current grade, floor, ceiling and the score still needed. Two independent implementations cross-check each other.",
      tags: ["APIs", "Verification"],
    },
  ],
  more: [
    {
      name: "Veridian",
      text: "Agent-swarm operations center: a hackathon demo in React, Pixi and React Flow.",
      href: "https://github.com/MaximusAnax/veridian",
    },
    {
      name: "bulk_proj_mono",
      text: "Twelve local-first Python CLI tools, each planned, reviewed and gated by evals before it was built.",
      href: "https://github.com/MaximusAnax/bulk_proj_mono",
    },
  ],
};
