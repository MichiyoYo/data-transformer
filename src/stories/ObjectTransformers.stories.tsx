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
    transformer: (obj: any) => {
      type SampleUser = typeof sampleUser;
      const transformer = transformField<SampleUser, 'createdAt', string>(
        'createdAt',
        formatDateHuman()
      );
      return transformer(obj);
    },
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

// Special demo component for API transformations
const ApiTransformationDemo = ({
  codeExample,
  description,
}: {
  codeExample: string;
  description: string;
}) => {
  const [direction, setDirection] = useState('api-to-ui');

  // Sample API response (snake_case, raw timestamps, nested structure)
  const apiResponse = {
    user_id: 42,
    first_name: 'jane',
    last_name: 'smith',
    email_address: 'jane.smith@company.com',
    phone_number: '+1-555-0123',
    created_at: '2025-08-14T10:30:00Z',
    updated_at: '2025-08-14T15:45:00Z',
    profile_data: {
      job_title: 'senior developer',
      department_name: 'engineering',
      salary_amount: 95000,
      start_date: '2022-03-15T09:00:00Z',
      is_manager: true,
      skills_list: ['javascript', 'typescript', 'react', 'node.js'],
      address_info: {
        street_address: '123 main street',
        city_name: 'san francisco',
        state_code: 'CA',
        zip_code: '94105',
      },
    },
    account_settings: {
      theme_preference: 'dark',
      email_notifications: true,
      two_factor_enabled: false,
      last_login_at: '2025-08-13T18:20:00Z',
    },
  };

  // Sample UI form data (camelCase, formatted values, flat structure)
  const uiFormData = {
    userId: 42,
    firstName: 'Jane',
    lastName: 'Smith',
    displayName: 'Jane Smith',
    emailAddress: 'jane.smith@company.com',
    phoneNumber: '+1-555-0123',
    createdDate: 'August 14, 2025 6:30 AM EDT',
    lastUpdated: 'August 14, 2025 11:45 AM EDT',
    jobTitle: 'Senior Developer',
    department: 'Engineering',
    formattedSalary: '$95,000',
    startDate: 'March 15, 2022',
    isManager: true,
    skillsCount: 4,
    topSkills: 'JavaScript, TypeScript, React',
    fullAddress: '123 Main Street, San Francisco, CA 94105',
    themePreference: 'dark',
    emailNotifications: true,
    twoFactorEnabled: false,
    lastLoginDisplay: '1 day ago',
  };

  // API to UI transformation pipeline
  const transformApiToUi = (apiData: any) => {
    let transformed = apiData;

    // Step 1: Convert keys to camelCase
    transformed = keysToCamelCase()(transformed);

    // Step 2: Rename and restructure fields
    transformed = renameFields({
      userId: 'userId',
      firstName: 'firstName',
      lastName: 'lastName',
      emailAddress: 'emailAddress',
      phoneNumber: 'phoneNumber',
    })(transformed);

    // Step 3: Transform dates to human-readable format
    if (transformed.createdAt) {
      transformed.createdDate = formatDateHuman()(
        new Date(transformed.createdAt)
      );
      delete transformed.createdAt;
    }
    if (transformed.updatedAt) {
      transformed.lastUpdated = formatDateHuman()(
        new Date(transformed.updatedAt)
      );
      delete transformed.updatedAt;
    }

    // Step 4: Flatten and transform nested profile data
    if (transformed.profileData) {
      const profile = transformed.profileData;
      transformed = {
        ...transformed,
        displayName: `${transformed.firstName} ${transformed.lastName}`,
        jobTitle: profile.jobTitle?.replace(/\b\w/g, (l: string) =>
          l.toUpperCase()
        ),
        department: profile.departmentName?.replace(/\b\w/g, (l: string) =>
          l.toUpperCase()
        ),
        formattedSalary: `$${profile.salaryAmount?.toLocaleString()}`,
        startDate: new Date(profile.startDate).toLocaleDateString(),
        isManager: profile.isManager,
        skillsCount: profile.skillsList?.length || 0,
        topSkills: profile.skillsList?.slice(0, 3).join(', ') || '',
        fullAddress: profile.addressInfo
          ? `${profile.addressInfo.streetAddress?.replace(
              /\b\w/g,
              (l: string) => l.toUpperCase()
            )}, ${profile.addressInfo.cityName?.replace(/\b\w/g, (l: string) =>
              l.toUpperCase()
            )}, ${profile.addressInfo.stateCode} ${profile.addressInfo.zipCode}`
          : '',
      };
      delete transformed.profileData;
    }

    // Step 5: Transform settings
    if (transformed.accountSettings) {
      const settings = transformed.accountSettings;
      transformed = {
        ...transformed,
        themePreference: settings.themePreference,
        emailNotifications: settings.emailNotifications,
        twoFactorEnabled: settings.twoFactorEnabled,
        lastLoginDisplay: settings.lastLoginAt
          ? Math.floor(
              (Date.now() - new Date(settings.lastLoginAt).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + ' days ago'
          : 'Never',
      };
      delete transformed.accountSettings;
    }

    // Step 6: Pick only UI-relevant fields
    transformed = pickFields([
      'userId',
      'firstName',
      'lastName',
      'displayName',
      'emailAddress',
      'phoneNumber',
      'createdDate',
      'lastUpdated',
      'jobTitle',
      'department',
      'formattedSalary',
      'startDate',
      'isManager',
      'skillsCount',
      'topSkills',
      'fullAddress',
      'themePreference',
      'emailNotifications',
      'twoFactorEnabled',
      'lastLoginDisplay',
    ] as any)(transformed);

    return transformed;
  };

  // UI to API transformation pipeline
  const transformUiToApi = (uiData: any) => {
    let transformed = uiData;

    // Step 1: Restructure for API format
    transformed = {
      user_id: transformed.userId,
      first_name: transformed.firstName?.toLowerCase(),
      last_name: transformed.lastName?.toLowerCase(),
      email_address: transformed.emailAddress,
      phone_number: transformed.phoneNumber,
      profile_data: {
        job_title: transformed.jobTitle?.toLowerCase(),
        department_name: transformed.department?.toLowerCase(),
        is_manager: transformed.isManager,
      },
      account_settings: {
        theme_preference: transformed.themePreference,
        email_notifications: transformed.emailNotifications,
        two_factor_enabled: transformed.twoFactorEnabled,
      },
    };

    // Step 2: Convert to snake_case
    transformed = keysToSnakeCase()(transformed);

    // Step 3: Clean up - remove UI-only fields
    transformed = omitFields([
      'display_name',
      'created_date',
      'last_updated',
      'formatted_salary',
      'start_date',
      'skills_count',
      'top_skills',
      'full_address',
      'last_login_display',
    ] as any)(transformed);

    return transformed;
  };

  const inputData = direction === 'api-to-ui' ? apiResponse : uiFormData;
  const transformer =
    direction === 'api-to-ui' ? transformApiToUi : transformUiToApi;
  const output = transformer(inputData);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
        {description}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginBottom: '10px', display: 'block' }}>
          <strong>Transformation Direction:</strong>
        </label>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '20px' }}>
            <input
              type='radio'
              value='api-to-ui'
              checked={direction === 'api-to-ui'}
              onChange={(e) => setDirection(e.target.value as 'api-to-ui')}
              style={{ marginRight: '5px' }}
            />
            API Response → UI Data
          </label>
          <label>
            <input
              type='radio'
              value='ui-to-api'
              checked={direction === 'ui-to-api'}
              onChange={(e) => setDirection(e.target.value as 'ui-to-api')}
              style={{ marginRight: '5px' }}
            />
            UI Form Data → API Payload
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>
            Input ({direction === 'api-to-ui' ? 'API Response' : 'UI Form Data'}
            ):
          </strong>
          <pre
            style={{
              marginTop: '5px',
              padding: '10px',
              backgroundColor: '#f8f8f8',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '11px',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
              maxHeight: '300px',
            }}
          >
            {JSON.stringify(inputData, null, 2)}
          </pre>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <strong>
            Output ({direction === 'api-to-ui' ? 'UI Data' : 'API Payload'}):
          </strong>
          <pre
            style={{
              marginTop: '5px',
              padding: '10px',
              backgroundColor: '#f0f8ff',
              border: '1px solid #007acc',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '11px',
              color: '#007acc',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
              maxHeight: '300px',
            }}
          >
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      </div>

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
    </div>
  );
};

export const ApiDataTransformation: Story = {
  render: () => (
    <ApiTransformationDemo
      description='Complete bidirectional data transformation pipeline showing how to convert between API and UI data shapes using multiple transformers in sequence.'
      codeExample={`import { 
  keysToCamelCase, keysToSnakeCase, renameFields, 
  transformField, pickFields, omitFields, formatDateHuman 
} from 'data-transform-kit';

// API Response → UI Data Pipeline
const transformApiToUi = (apiResponse) => {
  let data = apiResponse;
  
  // Step 1: Convert snake_case to camelCase
  data = keysToCamelCase()(data);
  
  // Step 2: Transform date fields to human-readable format
  data = transformField('createdAt', formatDateHuman())(data);
  data = transformField('updatedAt', formatDateHuman())(data);
  
  // Step 3: Flatten nested profile data
  if (data.profileData) {
    const profile = data.profileData;
    data = {
      ...data,
      displayName: \`\${data.firstName} \${data.lastName}\`,
      jobTitle: profile.jobTitle?.replace(/\\b\\w/g, l => l.toUpperCase()),
      department: profile.departmentName?.replace(/\\b\\w/g, l => l.toUpperCase()),
      formattedSalary: \`$\${profile.salaryAmount?.toLocaleString()}\`,
      skillsCount: profile.skillsList?.length || 0,
      topSkills: profile.skillsList?.slice(0, 3).join(', ') || ''
    };
    delete data.profileData;
  }
  
  // Step 4: Pick only UI-relevant fields
  return pickFields([
    'userId', 'displayName', 'emailAddress', 'jobTitle',
    'department', 'formattedSalary', 'skillsCount', 'topSkills'
  ])(data);
};

// UI Form Data → API Payload Pipeline
const transformUiToApi = (formData) => {
  let data = formData;
  
  // Step 1: Restructure for API format
  data = {
    user_id: data.userId,
    first_name: data.firstName?.toLowerCase(),
    last_name: data.lastName?.toLowerCase(),
    email_address: data.emailAddress,
    profile_data: {
      job_title: data.jobTitle?.toLowerCase(),
      department_name: data.department?.toLowerCase(),
      is_manager: data.isManager
    }
  };
  
  // Step 2: Convert to snake_case
  data = keysToSnakeCase()(data);
  
  // Step 3: Remove UI-only fields
  return omitFields([
    'display_name', 'formatted_salary', 'skills_count', 'top_skills'
  ])(data);
};

// Usage in React components
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Fetch from API and transform for UI
    fetchUser(userId)
      .then(transformApiToUi)
      .then(setUser);
  }, [userId]);
  
  const handleSave = (formData) => {
    // Transform UI data for API and save
    const apiPayload = transformUiToApi(formData);
    return updateUser(userId, apiPayload);
  };
  
  return user ? <UserForm user={user} onSave={handleSave} /> : <Loading />;
};

// Real-world patterns
export const createUserAdapter = () => ({
  // API → UI transformation
  fromApi: transformApiToUi,
  
  // UI → API transformation  
  toApi: transformUiToApi,
  
  // Validation and normalization
  validateUiData: (data) => pickFields(['firstName', 'lastName', 'email'])(data),
  validateApiData: (data) => pickFields(['user_id', 'email_address'])(data)
});`}
    />
  ),
};
