import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  capitalize,
  trim,
  toUpperCase,
  toLowerCase,
  slugify,
  truncate,
} from '../transformers/string';

// Enhanced demo component with code examples
const StringTransformerDemo = ({
  transformer,
  defaultInput = 'hello world',
  codeExample,
  description,
  ...props
}: {
  transformer: (input: string) => string;
  defaultInput?: string;
  codeExample?: string;
  description?: string;
  [key: string]: any;
}) => {
  const [input, setInput] = useState(defaultInput);
  const output = transformer(input);

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
            <strong>Input:</strong>
          </label>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              marginLeft: '10px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '300px',
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
            "{output}"
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

const meta: Meta<typeof StringTransformerDemo> = {
  title: '🔤 String Transformers',
  component: StringTransformerDemo,
  parameters: {
    docs: {
      description: {
        component: `
# String Transformers

String transformation utilities for text processing and formatting. All functions are pure and composable.

## Basic Usage

\`\`\`typescript
import { capitalize, trim, slugify } from 'data-transform-kit';

const result = capitalize('hello world'); // "Hello world"
\`\`\`

## Composition Examples

String transformers can be easily composed to create complex transformations:

\`\`\`typescript
import { capitalize, trim, slugify } from 'data-transform-kit';

// Compose multiple transformers
const cleanAndFormat = (text: string) => 
  capitalize(trim(text));

cleanAndFormat('  hello world  '); // "Hello world"

// Create reusable transformation pipelines
const createSlug = (text: string) => 
  slugify(trim(text.toLowerCase()));

createSlug('  My Blog Post Title!  '); // "my-blog-post-title"
\`\`\`

## With Arrays

Use \`mapItems\` to apply string transformers to arrays:

\`\`\`typescript
import { mapItems, capitalize } from 'data-transform-kit';

const capitalizeAll = mapItems(capitalize);
capitalizeAll(['hello', 'world']); // ['Hello', 'World']
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StringTransformerDemo>;

export const Capitalize: Story = {
  args: {
    transformer: capitalize,
    defaultInput: 'hello world',
    description:
      'Capitalizes the first letter of a string while preserving the rest.',
    codeExample: `import { capitalize } from 'data-transform-kit';

const result = capitalize('hello world');
console.log(result); // "Hello world"

// Use with user input
const formatName = (name: string) => capitalize(name.trim());
formatName('  john doe  '); // "John doe"`,
  },
};

export const Trim: Story = {
  args: {
    transformer: trim,
    defaultInput: '  spaced out  ',
    description: 'Removes leading and trailing whitespace from a string.',
    codeExample: `import { trim } from 'data-transform-kit';

const clean = trim('  hello world  ');
console.log(clean); // "hello world"

// Common use case: cleaning user input
const processInput = (input: string) => trim(input);`,
  },
};

export const Slugify: Story = {
  args: {
    transformer: slugify,
    defaultInput: 'Hello World! 123',
    description:
      'Converts text to a URL-friendly slug by removing special characters and using hyphens.',
    codeExample: `import { slugify } from 'data-transform-kit';

const slug = slugify('My Blog Post!');
console.log(slug); // "my-blog-post"

// Perfect for creating URLs
const createUrl = (title: string) => 
  \`/blog/\${slugify(title)}\`;
  
createUrl('10 Tips for Better Code'); // "/blog/10-tips-for-better-code"`,
  },
};

export const Truncate: Story = {
  args: {
    transformer: truncate(20),
    defaultInput: 'This is a very long string that will be truncated',
    description: 'Truncates a string to a specified length and adds ellipsis.',
    codeExample: `import { truncate } from 'data-transform-kit';

const short = truncate(10)('This is too long');
console.log(short); // "This is..."

// Create different truncation lengths
const truncateTitle = truncate(50);
const truncateDescription = truncate(100);

truncateTitle('Very long article title here');
// "Very long article title here"

truncateDescription('Even longer description...');`,
  },
};
