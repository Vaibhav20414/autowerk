export const caseStudies = [
  {
    slug: 'dental-agent',
    title: 'Dental Agent',
    eyebrow: 'WhatsApp AI agent',
    client: 'Dental implant clinic',
    summary:
      'An AI agent that answers implant enquiries on WhatsApp, qualifies each patient and books free consultations, with staff in the loop wherever it matters.',
    tags: ['AI agents', 'WhatsApp', 'Healthcare'],
    problem:
      'Implant enquiries arrive on WhatsApp at all hours. Front-desk staff reply late or inconsistently, objections go unanswered, and leads go cold before a consultation is ever booked.',
    solution:
      'A WhatsApp agent runs the whole first conversation: it qualifies the patient, explains implants, handles objections, offers real appointment slots and books the consultation. Replies that need a human eye are drafted in Slack for staff to approve, edit or reject before anything reaches the patient.',
    outcomes: [
      {
        title: 'Every enquiry gets a conversation',
        text: 'Each inbound message is picked up and walked through a structured flow instead of waiting in an inbox.',
      },
      {
        title: 'Leads qualified automatically',
        text: 'The agent scores each lead and moves it through the funnel as the conversation unfolds.',
      },
      {
        title: 'Staff stay in control',
        text: 'Drafts that need review land in Slack with approve, edit and reject controls before anything is sent.',
      },
      {
        title: 'Booking without back-and-forth',
        text: 'The agent suggests slots, holds them for two hours and locks in the one the patient confirms.',
      },
      {
        title: 'Reminders on autopilot',
        text: 'Patients get WhatsApp reminders 48 hours, 24 hours and 2 hours before the appointment.',
      },
      {
        title: 'Ready for more clinics',
        text: 'Each clinic has its own number, Slack channel, doctor, pricing and availability, all configured as data.',
      },
    ],
    howItWorks: [
      {
        title: 'Patient messages on WhatsApp',
        text: 'Twilio receives the message and hands it to the agent.',
      },
      {
        title: 'Claude runs the conversation',
        text: 'A state machine guides greeting, qualification, education and booking, calling tools to score the lead, suggest slots, confirm or escalate.',
      },
      {
        title: 'Staff review the draft',
        text: 'Replies that need review go to Slack, where staff approve, edit or reject before the patient sees anything.',
      },
      {
        title: 'The appointment is booked',
        text: 'The patient gets a confirmation with the clinic address, and staff get a booking alert.',
      },
      {
        title: 'Reminders fire automatically',
        text: 'WhatsApp reminders go out 48h, 24h and 2h before the appointment.',
      },
    ],
    stack: [
      'FastAPI',
      'Claude (tool use)',
      'PostgreSQL',
      'SQLAlchemy Core',
      'asyncpg',
      'Alembic',
      'Celery',
      'Twilio WhatsApp',
      'Slack Block Kit',
    ],
    diagrams: [
      {
        key: 'system-flow',
        title: 'System flow',
        caption:
          'From inbound WhatsApp message to reply: the agent drafts, a rule decides whether it can auto-send, and anything else waits for human review in Slack.',
      },
      {
        key: 'agent-states',
        title: 'Agent loop',
        caption:
          'The conversation is a finite state machine. Each state calls specific tools that write to PostgreSQL, and escalation to a human is available from any state.',
      },
    ],
  },
];

export const getCaseStudy = (slug) => caseStudies.find((c) => c.slug === slug);
