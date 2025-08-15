import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  transformField,
  pickFields,
  omitFields,
  renameFields,
  flattenObject,
  mergeObjects,
  deepClone,
  keysToCamelCase,
  keysToSnakeCase,
} from '../transformers/object';
import { formatDateHuman } from '../transformers/date';

const ObjectTransformerDemo = ({
  transformer,
  defaultInput,
  additionalInput,
  codeExample,
  description,
  ...props
}: {
  transformer: (input: any, ...args: any[]) => any;
  defaultInput?: any;
  additionalInput?: any;
  codeExample?: string;
  description?: string;
}) => {
  const [input, setInput] = useState(
    JSON.stringify(defaultInput || {}, null, 2)
  );
  const [additional, setAdditional] = useState(
    JSON.stringify(additionalInput || '', null, 2)
  );

  let output;
  try {
    const parsedInput = JSON.parse(input);
    let args: any[] = [];

    if (additional && additional.trim() !== '""') {
      try {
        const parsedAdditional = JSON.parse(additional);
        if (parsedAdditional !== '') {
          args = [parsedAdditional];
        }
      } catch {
        // Fallback for non-JSON strings
        args = [additional.replace(/^"|"$/g, '')];
      }
    }

    output = transformer(parsedInput, ...args);
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
            <strong>Input Object (JSON):</strong>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              display: 'block',
              marginTop: '5px',
              width: '100%',
              minHeight: '120px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
            }}
          />
        </div>

        {additionalInput !== undefined && (
          <div style={{ marginBottom: '10px' }}>
            <label>
              <strong>Additional Parameter (JSON):</strong>
            </label>
            <textarea
              value={additional}
              onChange={(e) => setAdditional(e.target.value)}
              style={{
                display: 'block',
                marginTop: '5px',
                width: '100%',
                minHeight: '60px',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '10px' }}>
          <strong>Output:</strong>
          <pre
            style={{
              marginTop: '5px',
              padding: '10px',
              backgroundColor: '#f0f8ff',
              border: '1px solid #007acc',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: '#007acc',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
            }}
          >
            {typeof output === 'object'
              ? JSON.stringify(output, null, 2)
              : String(output)}
          </pre>
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

const meta: Meta<typeof ObjectTransformerDemo> = {
  title: '🏗️ Object Transformers',
  component: ObjectTransformerDemo,
  parameters: {
    docs: {
      description: {
        component: `
# Object Transformers

Powerful object manipulation utilities for data transformation, API response processing, and configuration management. Built on Lodash for robust, performant operations.

## Basic Usage

\`\`\`typescript
import { transformField, pickFields, renameFields, flattenObject } from 'data-transform-kit';

const user = { id: 1, name: 'John', createdAt: '2025-08-14T10:00:00Z' };
const withFormattedDate = transformField('createdAt', formatDateHuman())(user);
const basicInfo = pickFields(['id', 'name'])(user);
const flatData = flattenObject()(complexObject);
\`\`\`

## Data Transformation Pipelines

\`\`\`typescript
// API response normalization
const normalizeApiResponse = (data) => {
  let normalized = data;
  normalized = renameFields({ user_id: 'id', full_name: 'name' })(normalized);
  normalized = transformField('createdAt', formatDateHuman())(normalized);
  normalized = pickFields(['id', 'name', 'email', 'createdAt'])(normalized);
  return normalized;
};
\`\`\`

## Key Case Conversion

\`\`\`typescript
// Convert API snake_case to UI camelCase
const apiResponse = { first_name: 'John', last_name: 'Doe', created_at: '2025-01-01' };
const uiData = keysToCamelCase()(apiResponse);
// { firstName: 'John', lastName: 'Doe', createdAt: '2025-01-01' }

// Convert UI camelCase to API snake_case
const formData = { firstName: 'Jane', lastName: 'Smith' };
const apiPayload = keysToSnakeCase()(formData);
// { first_name: 'Jane', last_name: 'Smith' }
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ObjectTransformerDemo>;

const sampleUser = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: '2025-08-14T10:00:00Z',
  profile: {
    age: 30,
    city: 'New York',
  },
  settings: {
    theme: 'dark',
    notifications: true,
  },
};

export const TransformField: Story = {
  args: {
    transformer: transformField('createdAt', formatDateHuman()),
    defaultInput: sampleUser,
    description:
      'Transform a specific field in an object while preserving all other fields.',
    codeExample: `import { transformField } from 'data-transform-kit';
import { formatDateHuman } from 'data-transform-kit';

const formatCreatedAt = transformField('createdAt', formatDateHuman());
const userWithFormattedDate = formatCreatedAt(user);

// Transform nested fields
const formatAge = transformField('profile', (profile) => ({
  ...profile,
  ageGroup: profile.age >= 30 ? 'adult' : 'young'
}));

// Chain transformations
const processUser = (user) => {
  let processed = user;
  processed = transformField('createdAt', formatDateHuman())(processed);
  processed = transformField('email', (email) => email.toLowerCase())(processed);
  return processed;
};`,
  },
};

export const PickFields: Story = {
  args: {
    transformer: (obj: any, fields: string[]) => pickFields(fields)(obj),
    defaultInput: sampleUser,
    additionalInput: ['id', 'name', 'email'],
    description:
      'Extract only the specified fields from an object, creating a new object with just those fields.',
    codeExample: `import { pickFields } from 'data-transform-kit';

const getBasicInfo = pickFields(['id', 'name', 'email']);
const basicUser = getBasicInfo(user);

// API response filtering
const getPublicData = pickFields(['id', 'name', 'profile']);
const publicUser = getPublicData(user);

// Form data extraction
const getContactInfo = pickFields(['name', 'email']);
const contactData = getContactInfo(user);

// Nested field picking
const getSettings = pickFields(['settings']);
const userSettings = getSettings(user);`,
  },
};

export const OmitFields: Story = {
  args: {
    transformer: (obj: any, fields: string[]) => omitFields(fields)(obj),
    defaultInput: sampleUser,
    additionalInput: ['settings', 'createdAt'],
    description:
      'Remove specified fields from an object, returning a new object without those fields.',
    codeExample: `import { omitFields } from 'data-transform-kit';

const removePrivateData = omitFields(['settings']);
const publicUser = removePrivateData(user);

// Security filtering
const sanitizeUser = omitFields(['password', 'ssn', 'internal']);
const safeUser = sanitizeUser(user);

// API response cleanup
const clientSafeData = omitFields(['id', 'createdAt']);
const displayData = clientSafeData(user);

// Remove multiple fields
const getDisplayData = omitFields(['settings', 'createdAt', 'profile']);`,
  },
};

export const RenameFields: Story = {
  args: {
    transformer: (obj: any, fieldMap: Record<string, string>) =>
      renameFields(fieldMap)(obj),
    defaultInput: sampleUser,
    additionalInput: { name: 'displayName', email: 'emailAddress' },
    description:
      'Rename object fields according to a mapping, useful for API response normalization.',
    codeExample: `import { renameFields } from 'data-transform-kit';

// API response normalization
const normalizeApiFields = renameFields({
  user_id: 'id',
  full_name: 'name',
  email_address: 'email',
  created_at: 'createdDate'
});
const normalizedUser = normalizeApiFields(apiResponse);

// Database to UI mapping
const dbToUi = renameFields({
  created_at: 'createdDate',
  updated_at: 'lastModified',
  is_active: 'active'
});

// Form field mapping
const mapFormFields = renameFields({
  firstName: 'first_name',
  lastName: 'last_name'
});`,
  },
};

export const FlattenObject: Story = {
  args: {
    transformer: flattenObject(),
    defaultInput: sampleUser,
    description:
      'Flatten nested objects into dot-notation key-value pairs for easier processing and indexing.',
    codeExample: `import { flattenObject } from 'data-transform-kit';

const flatten = flattenObject();
const flattened = flatten(user);
// {
//   'id': 1,
//   'name': 'John Doe',
//   'email': 'john@example.com',
//   'profile.age': 30,
//   'profile.city': 'New York',
//   'settings.theme': 'dark',
//   'settings.notifications': true
// }

// Custom separator
const flattenWithUnderscore = flattenObject('_');
const flattenedWithUnderscore = flattenWithUnderscore(user);

// Configuration management
const config = { database: { host: 'localhost', port: 5432 } };
const flatConfig = flatten(config);

// Search indexing
const searchableFields = flatten(productData);`,
  },
};

export const MergeObjects: Story = {
  args: {
    transformer: (obj: any, params: any) => {
      const { override, sources } = params;
      return mergeObjects(
        override,
        ...(Array.isArray(sources) ? sources : [sources])
      )(obj);
    },
    defaultInput: sampleUser,
    additionalInput: {
      override: true,
      sources: [{ name: 'Jane Doe', settings: { theme: 'light' } }],
    },
    description:
      'Merge multiple objects with control over whether to override existing values or preserve them.',
    codeExample: `import { mergeObjects } from 'data-transform-kit';

// Add defaults (preserve existing values)
const addDefaults = mergeObjects(false, { 
  settings: { theme: 'light', notifications: true },
  profile: { city: 'Unknown' }
});
const userWithDefaults = addDefaults(user);

// Override with new values
const applyUpdates = mergeObjects(true, { 
  name: 'Updated Name',
  settings: { theme: 'dark' }
});
const updatedUser = applyUpdates(user);

// Multiple source objects
const mergeMultiple = mergeObjects(true, 
  { name: 'New Name' }, 
  { settings: { theme: 'blue' } },
  { profile: { age: 31 } }
);`,
  },
};

export const DeepClone: Story = {
  args: {
    transformer: deepClone,
    defaultInput: sampleUser,
    description:
      'Create a deep copy of an object, ensuring complete independence from the original.',
    codeExample: `import { deepClone } from 'data-transform-kit';

const clonedUser = deepClone(originalUser);

// Safe to modify without affecting original
clonedUser.settings.theme = 'light';
clonedUser.profile.age = 31;
// originalUser remains unchanged

// Useful for state management
const updateUserState = (currentUser, updates) => {
  const newUser = deepClone(currentUser);
  Object.assign(newUser, updates);
  return newUser;
};

// Form data handling
const createEditableUser = (user) => {
  return deepClone(user); // Safe to edit
};`,
  },
};

export const KeysToCamelCase: Story = {
  args: {
    transformer: keysToCamelCase(),
    defaultInput: {
      user_id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email_address: 'john@example.com',
      created_at: '2025-08-14T10:00:00Z',
    },
    description:
      'Convert all object keys from snake_case or other formats to camelCase for JavaScript conventions.',
    codeExample: `import { keysToCamelCase } from 'data-transform-kit';

const toCamelCase = keysToCamelCase();

// API response normalization
const apiResponse = {
  user_id: 1,
  first_name: 'John',
  last_name: 'Doe',
  created_at: '2025-01-01'
};
const uiData = toCamelCase(apiResponse);
// { userId: 1, firstName: 'John', lastName: 'Doe', createdAt: '2025-01-01' }

// Database records to UI
const dbRecord = {
  product_id: 123,
  product_name: 'Widget',
  unit_price: 29.99,
  in_stock: true
};
const productData = toCamelCase(dbRecord);`,
  },
};

export const KeysToSnakeCase: Story = {
  args: {
    transformer: keysToSnakeCase(),
    defaultInput: {
      userId: 1,
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com',
      createdAt: '2025-08-14T10:00:00Z',
    },
    description:
      'Convert all object keys from camelCase to snake_case for API requests and database operations.',
    codeExample: `import { keysToSnakeCase } from 'data-transform-kit';

const toSnakeCase = keysToSnakeCase();

// UI form data to API payload
const formData = {
  firstName: 'Jane',
  lastName: 'Smith',
  emailAddress: 'jane@example.com',
  phoneNumber: '555-1234'
};
const apiPayload = toSnakeCase(formData);
// { first_name: 'Jane', last_name: 'Smith', email_address: 'jane@example.com', phone_number: '555-1234' }

// JavaScript objects to database format
const userUpdate = {
  displayName: 'John Doe',
  isActive: true,
  lastLoginAt: new Date()
};
const dbUpdate = toSnakeCase(userUpdate);`,
  },
};
