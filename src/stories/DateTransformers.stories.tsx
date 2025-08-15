import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  formatDate,
  formatUSDate,
  formatEUDate,
  formatDateLocal,
  formatDateHuman,
  formatRelative,
  formatDateSmart,
  addDays,
  subtractDays,
  toUnixTimestamp,
  fromUnixTimestamp,
  isoDateToLocal,
} from '../transformers/date';

const DateTransformerDemo = ({
  transformer,
  defaultInput,
  inputType = 'datetime-local',
  codeExample,
  description,
  ...props
}: {
  transformer: (input: any) => any;
  defaultInput?: any;
  inputType?: 'datetime-local' | 'date' | 'number' | 'text';
  codeExample?: string;
  description?: string;
}) => {
  const [input, setInput] = useState(defaultInput?.toString() || '');
  
  let output;
  try {
    let processedInput;
    if (inputType === 'datetime-local' || inputType === 'date') {
      processedInput = input ? new Date(input) : new Date();
    } else if (inputType === 'number') {
      processedInput = parseFloat(input) || Date.now();
    } else {
      processedInput = input;
    }
    
    output = transformer(processedInput);
  } catch (error) {
    output = 'Error: ' + (error as Error).message;
  }

  return (
    <div style={{ padding: '20px' }}>
      {description && (
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
          {description}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            <strong>Input ({inputType}):</strong>
          </label>
          <input
            type={inputType}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              marginLeft: '10px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: inputType === 'number' ? '200px' : '250px',
              fontFamily: 'monospace',
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Output:</strong>
          <span
            style={{
              marginLeft: '10px',
              padding: '4px 8px',
              backgroundColor: '#f0f8ff',
              border: '1px solid #007acc',
              borderRadius: '4px',
              fontFamily: 'monospace',
              color: '#007acc',
            }}
          >
            {typeof output === 'string' ? `"${output}"` : String(output)}
          </span>
        </div>
      </div>

      {codeExample && (
        <div>
          <strong>Code Example:</strong>
          <pre
            style={{
              backgroundColor: '#f5f5f5',
              padding: '15px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            <code>{codeExample}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

const meta: Meta<typeof DateTransformerDemo> = {
  title: '📅 Date Transformers',
  component: DateTransformerDemo,
  parameters: {
    docs: {
      description: {
        component: `
# Date Transformers

Comprehensive date and time transformation utilities with timezone support. Built on date-fns and date-fns-tz for robust, internationalized date handling.

## Basic Usage

\`\`\`typescript
import { formatDate, formatRelative, formatDateHuman } from 'data-transform-kit';

const date = new Date();
const formatted = formatDate('yyyy-MM-dd')(date); // "2025-08-14"
const relative = formatRelative()(date); // "2 hours ago"
const human = formatDateHuman()(date); // "August 14, 2025 2:30 PM EDT"
\`\`\`

## Timezone-Aware Formatting

\`\`\`typescript
// Multi-timezone event display
const eventTime = new Date('2025-08-14T18:00:00Z');

const timezones = {
  ny: formatDateHuman('America/New_York')(eventTime),
  london: formatDateHuman('Europe/London')(eventTime),
  tokyo: formatDateHuman('Asia/Tokyo')(eventTime)
};
// Shows same moment in different timezones
\`\`\`

## Smart Formatting

\`\`\`typescript
// Adaptive formatting based on recency
const smartFormat = formatDateSmart(7); // 7-day cutoff
smartFormat(recentDate); // "2 hours ago"
smartFormat(oldDate); // "January 15, 2025 3:30 PM EST"
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateTransformerDemo>;

const now = new Date();
const defaultDateTime = now.toISOString().slice(0, 16); // Format for datetime-local input

export const FormatDate: Story = {
  args: {
    transformer: formatDate('yyyy-MM-dd HH:mm'),
    defaultInput: defaultDateTime,
    inputType: 'datetime-local',
    description: 'Custom date formatting with optional timezone support using date-fns format strings.',
    codeExample: `import { formatDate } from 'data-transform-kit';

const formatISO = formatDate('yyyy-MM-dd');
const formatLong = formatDate('MMMM d, yyyy');
const formatTime = formatDate('h:mm a');

formatISO(new Date()); // "2025-08-14"
formatLong(new Date()); // "August 14, 2025"
formatTime(new Date()); // "2:30 PM"

// With timezone
const formatNY = formatDate('MM/dd/yyyy h:mm a', 'America/New_York');`,
  },
};

export const FormatUSDate: Story = {
  args: {
    transformer: formatUSDate(),
    defaultInput: defaultDateTime,
    inputType: 'datetime-local',
    description: 'US date format (MM/dd/yyyy) with Eastern timezone by default.',
    codeExample: `import { formatUSDate } from 'data-transform-kit';

const formatEastern = formatUSDate();
formatEastern(new Date()); // "08/14/2025"

const formatPacific = formatUSDate('America/Los_Angeles');
formatPacific(new Date()); // Same date in Pacific time

// Perfect for US applications
const events = meetings.map(meeting => ({
  ...meeting,
  displayDate: formatEastern(meeting.date)
}));`,
  },
};

export const FormatEUDate: Story = {
  args: {
    transformer: formatEUDate(),
    defaultInput: defaultDateTime,
    inputType: 'datetime-local',
    description: 'European date format (dd.MM.yyyy) with Berlin timezone by default.',
    codeExample: `import { formatEUDate } from 'data-transform-kit';

const formatCET = formatEUDate();
formatCET(new Date()); // "14.08.2025"

const formatLondon = formatEUDate('Europe/London');
const formatParis = formatEUDate('Europe/Paris');

// Multi-office display
const offices = ['Europe/Berlin', 'Europe/London', 'Europe/Madrid'];
const times = offices.map(tz => formatEUDate(tz)(meetingTime));`,
  },
};

export const FormatDateHuman: Story = {
  args: {
    transformer: formatDateHuman(),
    defaultInput: defaultDateTime,
    inputType: 'datetime-local',
    description: 'Human-readable format with timezone abbreviation for clear communication.',
    codeExample: `import { formatDateHuman } from 'data-transform-kit';

const formatFriendly = formatDateHuman();
formatFriendly(new Date()); // "August 14, 2025 2:30 PM EDT"

// Global event scheduling
const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
const eventSchedule = timezones.map(tz => ({
  timezone: tz,
  localTime: formatDateHuman(tz)(eventTime)
}));

// Email notifications with clear timezone info`,
  },
};

export const FormatRelative: Story = {
  args: {
    transformer: formatRelative(),
    defaultInput: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString().slice(0, 16), // 2 hours ago
    inputType: 'datetime-local',
    description: 'Relative time formatting like "2 hours ago" or "in 3 days" for social media and activity feeds.',
    codeExample: `import { formatRelative } from 'data-transform-kit';

const formatRel = formatRelative();
formatRel(twoHoursAgo); // "2 hours ago"
formatRel(nextWeek); // "in 7 days"

// Social media feed
const posts = activities.map(post => ({
  ...post,
  timeAgo: formatRel(post.createdAt)
}));

// Comment timestamps
const comments = discussion.map(comment => ({
  ...comment,
  relativeTime: formatRel(comment.timestamp)
}));`,
  },
};

export const FormatDateSmart: Story = {
  args: {
    transformer: formatDateSmart(7),
    defaultInput: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // 3 days ago
    inputType: 'datetime-local',
    description: 'Smart formatting that shows relative time for recent dates, full format for older dates.',
    codeExample: `import { formatDateSmart } from 'data-transform-kit';

const smartFormat = formatDateSmart(7); // 7-day cutoff
smartFormat(yesterday); // "1 day ago"
smartFormat(lastMonth); // "July 15, 2025 3:30 PM EDT"

// Email inbox timestamps
const emails = messages.map(email => ({
  ...email,
  smartTime: smartFormat(email.received)
}));

// Document management
const files = documents.map(doc => ({
  ...doc,
  lastModified: smartFormat(doc.updatedAt)
}));`,
  },
};

export const AddDays: Story = {
  args: {
    transformer: addDays(7),
    defaultInput: defaultDateTime,
    inputType: 'datetime-local',
    description: 'Add specified number of days to a date for scheduling and deadline calculations.',
    codeExample: `import { addDays } from 'data-transform-kit';

const nextWeek = addDays(7);
nextWeek(new Date()); // Date 7 days from now

const addBusinessDays = addDays(5);
const deadline = addBusinessDays(startDate);

// Task scheduling
const createTask = (task, daysUntilDue) => ({
  ...task,
  dueDate: addDays(daysUntilDue)(new Date()),
  reminderDate: addDays(daysUntilDue - 1)(new Date())
});`,
  },
};

export const ToUnixTimestamp: Story = {
  args: {
    transformer: toUnixTimestamp,
    defaultInput: defaultDateTime,
    inputType: 'datetime-local',
    description: 'Convert Date to Unix timestamp (milliseconds) for database storage and API communication.',
    codeExample: `import { toUnixTimestamp } from 'data-transform-kit';

const timestamp = toUnixTimestamp(new Date());
console.log(timestamp); // 1723651200000

// API payload
const event = {
  title: 'Meeting',
  startTime: toUnixTimestamp(meetingDate),
  endTime: toUnixTimestamp(endDate)
};

// Database storage
const user = {
  ...userData,
  createdAt: toUnixTimestamp(new Date()),
  lastLogin: toUnixTimestamp(loginDate)
};`,
  },
};
