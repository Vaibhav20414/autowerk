import { DiagramFrame, Node, Edge, EdgeLabel, Legend } from './DiagramKit';

export default function AgentStateDiagram() {
  return (
    <DiagramFrame
      width={1000}
      height={1210}
      minWidth={880}
      label="Agent finite state machine with the tool calls each state makes and the PostgreSQL tables they write to"
    >
      {/* State transitions */}
      <Edge d="M330 84 V130" />
      <Edge d="M330 194 V222 H170 V250" />
      <Edge d="M330 194 V222 H500 V250" />
      <Edge d="M330 222 V530" />
      <Edge d="M170 314 V380" />
      <Edge d="M170 444 V500 H250 V530" />
      <Edge d="M500 314 V500 H410 V530" />
      <Edge d="M330 594 V650" />
      <Edge d="M330 714 V770" />

      {/* Escalation from any state */}
      <Edge dashed color="#A1A1AA" d="M210 52 H20 V922 H180" />
      <EdgeLabel x={10} y={480} rotate={-90}>any state → escalate</EdgeLabel>
      <EdgeLabel x={338} y={360} anchor="start">fast-booking path</EdgeLabel>

      {/* Tool calls */}
      <Edge dashed d="M450 162 H720" />
      <Edge dashed d="M280 412 H800 V194" />
      <Edge dashed d="M480 562 H720" />
      <Edge dashed d="M480 682 H720" />
      <Edge dashed d="M480 922 H720" />

      {/* Tools to database */}
      <Edge dashed arrow={false} d="M960 162 H985" />
      <Edge dashed arrow={false} d="M960 562 H985" />
      <Edge dashed arrow={false} d="M960 682 H985" />
      <Edge dashed arrow={false} d="M960 922 H985" />
      <Edge dashed d="M985 162 V1035 H960" />

      {/* FSM states */}
      <Node x={210} y={20} w={240} h={64} title="GREETING" sub="Initial contact" />
      <Node x={210} y={130} w={240} h={64} tone="core" title="NEED_ID" sub="score_lead() called" />
      <Node x={60} y={250} w={220} h={64} tone="core" title="IMPLANT_EDUCATE" sub="Educate on procedure" />
      <Node x={390} y={250} w={220} h={64} tone="core" title="GENERIC_QUALIFY" sub="Non-implant query" />
      <Node x={60} y={380} w={220} h={64} tone="core" title="INSURANCE_CHECK" sub="score_lead() re-called" />
      <Node
        x={180}
        y={530}
        w={300}
        h={64}
        tone="human"
        title="SUGGEST_APPOINTMENT"
        sub="suggest_appointment() called"
      />
      <Node
        x={180}
        y={650}
        w={300}
        h={64}
        tone="human"
        title="CONFIRM_BOOKING"
        sub="confirm_appointment() called"
      />
      <Node
        x={180}
        y={770}
        w={300}
        h={64}
        tone="done"
        title="CONVERSATION_COMPLETE"
        sub="Terminal state"
      />
      <Node
        x={180}
        y={890}
        w={300}
        h={64}
        tone="alert"
        title="ESCALATE"
        sub="escalate() · terminal"
      />

      {/* Tools */}
      <Node x={720} y={130} w={240} h={64} tone="tool" title="score_lead" sub="funnel_stage=qualified" />
      <Node x={720} y={530} w={240} h={64} tone="tool" title="suggest_appointment" sub="top 3 slots · 2h hold" />
      <Node
        x={720}
        y={650}
        w={240}
        h={64}
        tone="tool"
        title="confirm_appointment"
        sub="SELECT FOR UPDATE · booked"
      />
      <Node x={720} y={890} w={240} h={64} tone="tool" title="escalate" sub="state=ESCALATE · log" />

      {/* Database */}
      <Node
        x={60}
        y={1000}
        w={900}
        h={70}
        title="PostgreSQL"
        sub="leads · conversations · appointments · conversation_events · celery_jobs"
      />

      <Legend
        x={60}
        y={1110}
        w={900}
        h={76}
        items={[
          { tone: 'base', label: 'Start' },
          { tone: 'core', label: 'FSM state' },
          { tone: 'human', label: 'Booking state' },
          { tone: 'done', label: 'Terminal' },
          { tone: 'tool', label: 'Tool call' },
          { tone: 'alert', label: 'Escalate path' },
        ]}
        note="Dashed links = tool calls · Claude loop runs up to 5 tool rounds per message"
      />
    </DiagramFrame>
  );
}
