import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  toFixed,
  parseInt,
  parseFloat,
  toInteger,
  formatCurrency,
  formatPercentage,
} from '../transformers/number';

const NumberTransformerDemo = ({
  transformer,
  defaultInput,
  inputType = 'number',
  codeExample,
  description,
  ...props
}: {
  transformer: (input: any) => any;
  defaultInput?: any;
  inputType?: 'number' | 'string';
  codeExample?: string;
  description?: string;
}) => {
  const [input, setInput] = useState(defaultInput?.toString() || '');
  
  let output;
  try {
    const processedInput = inputType === 'number' ? parseFloat(input) || 0 : input;
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
            type={inputType === 'number' ? 'number' : 'text'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              marginLeft: '10px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '200px',
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

const meta: Meta<typeof NumberTransformerDemo> = {
  title: '🔢 Number Transformers',
  component: NumberTransformerDemo,
  parameters: {
    docs: {
      description: {
        component: `
# Number Transformers

Number transformation utilities for formatting, parsing, and converting numeric values. All functions are pure, composable, and powered by Lodash for consistent behavior.

## Basic Usage

\`\`\`typescript
import { formatCurrency, formatPercentage, toFixed } from 'data-transform-kit';

const price = formatCurrency()(1234.56); // "$1,234.56"
const rate = formatPercentage(2)(0.1234); // "12.34%"
const precise = toFixed(2)(3.14159); // "3.14"
\`\`\`

## Common Patterns

\`\`\`typescript
// E-commerce pricing
const formatPrice = formatCurrency('USD');
const products = [
  { name: 'Laptop', price: formatPrice(999.99) },
  { name: 'Mouse', price: formatPrice(29.95) }
];

// Financial calculations
const formatRate = formatPercentage(2);
const portfolio = {
  return: formatRate(0.0847), // "8.47%"
  fees: formatRate(0.005)     // "0.50%"
};
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NumberTransformerDemo>;

export const ToFixed: Story = {
  args: {
    transformer: toFixed(2),
    defaultInput: 3.14159,
    inputType: 'number',
    description: 'Formats a number to a fixed number of decimal places with consistent rounding.',
    codeExample: `import { toFixed } from 'data-transform-kit';

const formatPrice = toFixed(2);
formatPrice(19.999); // "20.00"
formatPrice(5); // "5.00"

// Scientific measurements
const formatMeasurement = toFixed(3);
formatMeasurement(3.14159); // "3.142"`,
  },
};

export const ParseInt: Story = {
  args: {
    transformer: parseInt,
    defaultInput: '123abc',
    inputType: 'string',
    description: 'Parses a string and returns an integer using lenient parsing (stops at first non-numeric character).',
    codeExample: `import { parseInt } from 'data-transform-kit';

parseInt('42'); // 42
parseInt('42.7'); // 42
parseInt('123abc'); // 123
parseInt('abc123'); // NaN

// Form processing
const quantity = parseInt('5 items'); // 5`,
  },
};

export const ParseFloat: Story = {
  args: {
    transformer: parseFloat,
    defaultInput: '3.14abc',
    inputType: 'string',
    description: 'Parses a string and returns a floating point number with better edge case handling.',
    codeExample: `import { parseFloat } from 'data-transform-kit';

parseFloat('3.14'); // 3.14
parseFloat('3.14abc'); // 3.14
parseFloat('1.23e-4'); // 0.000123

// Price processing
const price = parseFloat('$19.99'.replace('$', '')); // 19.99`,
  },
};

export const ToInteger: Story = {
  args: {
    transformer: toInteger,
    defaultInput: '123abc',
    inputType: 'string',
    description: 'Converts to integer using strict parsing. Returns 0 if conversion fails (safe fallback).',
    codeExample: `import { toInteger } from 'data-transform-kit';

toInteger('123'); // 123
toInteger('123abc'); // 0 (safe fallback)
toInteger('abc'); // 0

// Safe configuration parsing
const maxRetries = toInteger(config.maxRetries) || 3;`,
  },
};

export const FormatCurrency: Story = {
  args: {
    transformer: formatCurrency(),
    defaultInput: 1234.56,
    inputType: 'number',
    description: 'Formats a number as currency with proper locale formatting and currency symbols.',
    codeExample: `import { formatCurrency } from 'data-transform-kit';

const formatUSD = formatCurrency('USD');
formatUSD(1234.56); // "$1,234.56"

const formatEUR = formatCurrency('EUR');
formatEUR(1234.56); // "€1,234.56"

// E-commerce
const products = [
  { name: 'Laptop', price: formatUSD(999.99) },
  { name: 'Mouse', price: formatUSD(29.95) }
];`,
  },
};

export const FormatPercentage: Story = {
  args: {
    transformer: formatPercentage(2),
    defaultInput: 0.1234,
    inputType: 'number',
    description: 'Formats a decimal as a percentage with specified decimal places.',
    codeExample: `import { formatPercentage } from 'data-transform-kit';

const formatPercent = formatPercentage(2);
formatPercent(0.1234); // "12.34%"
formatPercent(0.5); // "50.00%"

// Analytics dashboard
const metrics = {
  conversion: formatPercent(0.0347), // "3.47%"
  bounce: formatPercent(0.68)        // "68.00%"
};`,
  },
};
