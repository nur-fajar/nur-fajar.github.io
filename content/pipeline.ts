export interface PipelineNode {
  phase: string;
  name: string;
  gate?: boolean;
}

export interface AgentStep {
  id: string; // "AGENT 01 / 09 · DATA & ENRICHMENT"
  title: string;
  file: string;
  claim?: string; // the one bold callout line, gate step only
  body: string[];
  io: { in: string; out: string; model: string };
  note?: string;
  gate?: boolean;
}

export const PIPELINE_MAP: PipelineNode[] = [
  { phase: 'DATA', name: 'Enricher' },
  { phase: 'DATA', name: 'Lead Gen' },
  { phase: 'CONTEXT', name: 'News' },
  { phase: 'OUTREACH', name: 'Cold Draft' },
  { phase: 'GATE', name: 'Dispatch', gate: true },
  { phase: 'RESPONSE', name: 'Logger' },
  { phase: 'RESPONSE', name: 'Classifier' },
  { phase: 'RESPONSE', name: 'Reply' },
  { phase: 'ANALYTICS', name: 'Reports' },
];

export const AGENT_STEPS: AgentStep[] = [
  {
    id: 'AGENT 01 / 09 · DATA & ENRICHMENT',
    title: 'Contact Enricher',
    file: 'verify_contact.py · v7–v8.1',
    body: [
      'Validates and enriches CRM contacts with employment status, tenure dates, and relocation gating. Filters out former employees and irrelevant leads before any outreach begins.',
    ],
    io: {
      in: 'CRM contact list (REST API) · company name + job title',
      out: 'Enriched record · employment status flag · outreach-eligible boolean',
      model: 'GPT-4o-mini — date parsing and classification',
    },
    note: 'Eight iterations to get here. Most of that was date parsing: "since 2019", "3 yrs", and an empty field all have to resolve to the same answer.',
  },
  {
    id: 'AGENT 02 / 09 · DATA & ENRICHMENT',
    title: 'Lead Generator',
    file: 'lead_generator.py',
    body: [
      'Identifies new qualified contacts from maritime and offshore industry sources. Applies domain filters and scores leads against target ICP criteria.',
    ],
    io: {
      in: 'Industry domain list · ICP criteria config',
      out: 'Scored lead list · CRM import payload',
      model: 'GPT-4o-mini — ICP scoring',
    },
  },
  {
    id: 'AGENT 03 / 09 · CONTEXT LAYER',
    title: 'Company News Enricher',
    file: 'news_enricher.py',
    body: [
      'Pulls recent company news from multi-source RSS feeds so outreach can reference something real. Includes a no-news sentinel and a cooldown so stale items are never reused.',
    ],
    io: {
      in: 'Contact company domains · RSS feed configs',
      out: 'Recent news digest per company · no-news sentinel flag',
      model: 'None — deterministic',
    },
    note: 'The sentinel matters more than the digest. Without an explicit "no news" value, a personalisation step will happily invent one.',
  },
  {
    id: 'AGENT 04 / 09 · OUTREACH EXECUTION',
    title: 'Cold Email Drafter',
    file: 'email_drafter.py',
    body: [
      'Writes personalised cold emails and the follow-up sequence — F1, F2, F3 at 3, 7, and 14 days. Applies anti-AI writing rules to keep the tone human, and handles out-of-office detection.',
    ],
    io: {
      in: 'Enriched contact · news context · cadence position',
      out: 'Draft email · subject line variants · OOO-aware scheduling',
      model: 'GPT-4o-mini — drafting under anti-AI instructions',
    },
  },
  {
    id: 'AGENT 05 / 09 · THE GATE',
    title: 'Email Dispatcher',
    file: 'email_dispatcher.py',
    gate: true,
    claim: 'Outbound email is the one action in this pipeline that cannot be undone.',
    body: [
      'Everything upstream can be re-run. A bad enrichment is a wasted API call; a bad draft is a discarded string. A sent email is a sent email — it is in someone’s inbox, attached to a company name, and there is no retraction.',
      'So this is the only step that does not run unattended. Dispatch is orchestrated around a **19:00–22:00 SGT review window**: three hours in which a human reads what the model wrote and approves it. Automation handles the other eight agents. It does not handle this one.',
    ],
    io: {
      in: 'Human-approved drafts · send schedule · sender identity config',
      out: 'Sent email log · retry queue for failures',
      model: 'None — SMTP with retry, rate limiting, sender rotation',
    },
    note: 'This is the decision I would defend in an interview. Full autonomy was available and technically easy. It was the wrong call, because the cost of a bad send is borne by the recipient and the brand, not by the pipeline.',
  },
  {
    id: 'AGENT 06 / 09 · RESPONSE HANDLING',
    title: 'Inbound Email Logger',
    file: 'inbound_logger.py',
    body: [
      'Monitors the IMAP inbox for replies and logs every inbound message to the CRM. Normalises email metadata and creates activity records linked back to the originating contact.',
    ],
    io: {
      in: 'IMAP mailbox · CRM contact index',
      out: 'CRM activity records · reply thread metadata',
      model: 'None — deterministic',
    },
  },
  {
    id: 'AGENT 07 / 09 · RESPONSE HANDLING',
    title: 'Reply Classifier',
    file: 'reply_classifier.py',
    body: [
      'Sorts inbound replies into four categories: positive (interested), negative (opt-out), out-of-office, and HITL — meaning the model is not confident and a human decides. Routes each accordingly.',
    ],
    io: {
      in: 'Inbound email text · thread context',
      out: 'Sentiment category · HITL flag · routing decision',
      model: 'GPT-4o — the one place the full model is used',
    },
    note: 'A misread opt-out is a compliance problem, not an inconvenience. That is why this single step gets GPT-4o while everything else runs on mini, and why "I am not sure" is a valid output.',
  },
  {
    id: 'AGENT 08 / 09 · RESPONSE HANDLING',
    title: 'Reply Drafter',
    file: 'reply_drafter.py',
    body: [
      'Drafts follow-ups to positive replies, keeping conversation context and tone guidelines. Anything flagged HITL goes to a human queue instead of being sent.',
    ],
    io: {
      in: 'Original thread · sentiment classification · contact context',
      out: 'Draft reply · HITL queue if flagged',
      model: 'GPT-4o-mini — reply drafting',
    },
  },
  {
    id: 'AGENT 09 / 09 · REPORTING & CRM SYNC',
    title: 'Report Builder',
    file: 'crm_report_builder.py',
    body: [
      'Produces multi-sheet Excel reports with pipeline metrics and AI-written contact summaries, then PATCHes the CRM to update records. Scheduled weekly for management review.',
    ],
    io: {
      in: 'CRM data export · pipeline logs',
      out: 'Multi-sheet Excel report · CRM PATCH payload',
      model: 'GPT-4o-mini — contact summaries',
    },
  },
];

export const MODEL_ROUTES = [
  {
    id: 'DEFAULT · 8 OF 9 AGENTS',
    title: 'GPT-4o-mini',
    body: 'Drafting, enrichment, ICP scoring, date parsing, contact summaries. High volume, and a wrong answer costs one retry.',
    hot: false,
  },
  {
    id: 'RESERVED · 1 OF 9 AGENTS',
    title: 'GPT-4o',
    body: 'Reply classification only — the single place where output quality decides routing, and where misreading an opt-out is a compliance problem rather than a wasted call.',
    hot: true,
  },
];
