import { DiagramFrame, Node, Diamond, Edge, EdgeLabel, Legend } from './DiagramKit';

export default function SystemFlowDiagram() {
  return (
    <DiagramFrame
      width={900}
      height={1200}
      label="System flow from inbound WhatsApp message to reply, with human review, auto-send, reminders and a dead letter queue"
    >
      {/* Edges */}
      <Edge d="M200 62 H240" />
      <Edge d="M420 62 H460" />
      <Edge d="M580 94 V140" />
      <Edge d="M580 210 V260" />
      <Edge d="M580 330 V380" />
      <Edge d="M580 450 V490" />
      <Edge d="M430 415 H230" />
      <Edge d="M450 540 H250" />
      <Edge d="M710 540 H740" />
      <Edge d="M155 575 V620" />
      <Edge d="M265 670 H430" />
      <Edge d="M155 720 V770" />
      <Edge d="M580 710 V770" />
      <Edge d="M580 840 V890" />
      <Edge d="M795 575 V920 H730" />
      <Edge dashed d="M430 920 H160 V1010" />
      <Edge dashed d="M730 295 H880 V1042 H860" />

      <EdgeLabel x={330} y={405}>escalate</EdgeLabel>
      <EdgeLabel x={350} y={530}>no</EdgeLabel>
      <EdgeLabel x={725} y={528}>yes</EdgeLabel>
      <EdgeLabel x={347} y={660}>approve · edit</EdgeLabel>
      <EdgeLabel x={165} y={750} anchor="start">reject</EdgeLabel>
      <EdgeLabel x={805} y={285}>max retries</EdgeLabel>

      {/* Inbound */}
      <Node x={40} y={30} w={160} h={64} title="Patient" />
      <Node x={240} y={30} w={180} h={64} title="WhatsApp" sub="Inbound message" />
      <Node x={460} y={30} w={240} h={64} title="Twilio" sub="POST /webhook/twilio" />
      <Node
        x={430}
        y={140}
        w={300}
        h={70}
        title="Twilio webhook handler"
        sub="Rate limit · dedup MessageSid · create job"
      />

      {/* Agent */}
      <Node
        x={430}
        y={260}
        w={300}
        h={70}
        tone="core"
        title="Celery task dispatched"
        sub="process_inbound_message · idempotent"
      />
      <Node
        x={430}
        y={380}
        w={300}
        h={70}
        tone="core"
        title="run_agent()"
        sub="Claude loop · tool calls · FSM advance"
      />
      <Node
        x={40}
        y={385}
        w={190}
        h={60}
        tone="alert"
        title="Escalate tool"
        sub="Slack alert · human"
      />

      {/* Decision + review */}
      <Diamond cx={580} cy={540} hw={130} hh={50} title="should_auto_send()?" />
      <Node x={60} y={515} w={190} h={60} tone="human" title="Slack draft" sub="Block Kit message" />
      <Node x={740} y={515} w={110} h={60} title="Twilio" sub="auto-send" />
      <Diamond cx={155} cy={670} hw={110} hh={50} title="Human review" />
      <Node
        x={430}
        y={640}
        w={300}
        h={70}
        tone="human"
        title="Slack webhook handler"
        sub="POST /webhook/slack · HMAC verify"
      />
      <Node x={60} y={770} w={190} h={60} tone="alert" title="Mark rejected" sub="No message sent" />
      <Node
        x={430}
        y={770}
        w={300}
        h={70}
        title="Send via Twilio"
        sub="mark approved / edited"
      />
      <Node x={430} y={890} w={300} h={60} title="WhatsApp reply to patient" />

      {/* Background */}
      <Node
        x={40}
        y={1010}
        w={240}
        h={64}
        tone="core"
        title="Reminder loop"
        sub="48h · 24h · 2h reminders"
      />
      <Node
        x={560}
        y={1010}
        w={300}
        h={64}
        tone="alert"
        title="Dead letter queue"
        sub="max retries · Slack DLQ alert"
      />

      <Legend
        x={40}
        y={1110}
        w={820}
        h={64}
        items={[
          { tone: 'base', label: 'Twilio / WhatsApp' },
          { tone: 'core', label: 'Celery / Claude agent' },
          { tone: 'human', label: 'Slack / human approval' },
          { tone: 'alert', label: 'Error / escalate' },
        ]}
      />
    </DiagramFrame>
  );
}
