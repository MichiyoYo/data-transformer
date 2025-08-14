# Data Transform Kit

A comprehensive TypeScript library for transforming data between APIs and frontend applications. Built with functional programming principles and powered by battle-tested libraries like Lodash and date-fns.

## 🚀 Features

- **49 transformation functions** across 5 categories
- **Full TypeScript support** with comprehensive type definitions
- **Bidirectional adapters** for API ↔ UI data transformation
- **Functional programming** approach with composable transformers
- **Zero configuration** - works out of the box
- **Tree-shakeable** - only bundle what you use
- **Production-ready** - built on Lodash and date-fns

## 📦 Installation

```bash
npm install data-transform-kit
```

## 🎯 Quick Start

```typescript
import {
  capitalize,
  formatCurrency,
  formatDateHuman,
  pickFields,
  mapItems,
} from 'data-transform-kit';

// Transform API data to UI format
const user = {
  first_name: 'john',
  last_name: 'doe',
  salary: 75000,
  created_at: '2023-01-15T10:30:00Z',
};

const displayUser = {
  name: `${capitalize(user.first_name)} ${capitalize(user.last_name)}`,
  salary: formatCurrency()(user.salary), // "$75,000.00"
  joinedDate: formatDateHuman()(new Date(user.created_at)), // "January 15, 2023 10:30 AM PST"
};
```

## 📚 Categories & Functions

### 🔤 String Transformers

Transform and format text data:

```typescript
import { capitalize, trim, slugify, truncate } from 'data-transform-kit';

capitalize('hello world'); // "Hello world"
trim('  spaced out  '); // "spaced out"
slugify('Hello World!'); // "hello-world"
truncate(10)('This is a very long string'); // "This is..."
```

**Available functions:** `capitalize`, `trim`, `toUpperCase`, `toLowerCase`, `slugify`, `truncate`

### 🔢 Number Transformers

Format numbers, currencies, and percentages:

```typescript
import { formatCurrency, formatPercentage, toFixed } from 'data-transform-kit';

formatCurrency()(1234.56); // "$1,234.56"
formatCurrency('EUR')(1234.56); // "€1,234.56"
formatPercentage(2)(0.1234); // "12.34%"
toFixed(2)(3.14159); // "3.14"
```

**Available functions:** `toFixed`, `parseInt`, `parseFloat`, `toInteger`, `formatCurrency`, `formatPercentage`

### 📅 Date Transformers

Handle dates, timezones, and formatting:

```typescript
import {
  formatDateHuman,
  formatRelative,
  addDays,
  formatTimestampLocal,
} from 'data-transform-kit';

const date = new Date('2023-12-25T10:30:00Z');

formatDateHuman()(date); // "December 25, 2023 10:30 AM PST"
formatRelative()(date); // "2 months ago"
addDays(5)(date); // Date 5 days later
formatTimestampLocal()(1703505000000); // Local timezone format
```

**Available functions:** `formatDate`, `formatUSDate`, `formatEUDate`, `isoDateToLocal`, `formatDateHuman`, `formatRelative`, `addDays`, `subtractDays`, `toUnixTimestamp`, `fromUnixTimestamp`, and more timezone utilities.

### 🏗️ Object Transformers

Manipulate and reshape objects:

```typescript
import {
  pickFields,
  renameFields,
  keysToCamelCase,
  transformField,
} from 'data-transform-kit';

const apiUser = {
  id: 1,
  first_name: 'john',
  last_name: 'doe',
  email: 'john@example.com',
  created_at: '2023-01-15T10:30:00Z',
};

// Pick only needed fields
pickFields(['id', 'first_name', 'email'])(apiUser);

// Rename fields
renameFields({
  first_name: 'firstName',
  last_name: 'lastName',
})(apiUser);

// Convert to camelCase
keysToCamelCase()(apiUser);

// Transform specific field
transformField('first_name', capitalize)(apiUser);
```

**Available functions:** `pickFields`, `omitFields`, `renameFields`, `flattenObject`, `mergeObjects`, `transformField`, `keysToCamelCase`, `keysToSnakeCase`, `deepClone`

### 📋 Array Transformers

Process and transform arrays:

```typescript
import {
  mapItems,
  filterItems,
  sortItems,
  groupBy,
  uniqueBy,
} from 'data-transform-kit';

const users = [
  { name: 'alice', age: 25, role: 'admin' },
  { name: 'bob', age: 30, role: 'user' },
  { name: 'charlie', age: 25, role: 'user' },
];

// Transform each item
mapItems((user) => ({ ...user, name: capitalize(user.name) }))(users);

// Filter items
filterItems((user) => user.role === 'admin')(users);

// Sort by property
sortItems((user) => user.age)(users);

// Group by property
groupBy((user) => user.role)(users); // { admin: [...], user: [...] }

// Remove duplicates by property
uniqueBy((user) => user.age)(users);
```

**Available functions:** `mapItems`, `filterItems`, `sortItems`, `groupBy`, `uniqueBy`, `findItem`, `reduceItems`

## 🔄 Bidirectional Adapters

Create adapters that transform data in both directions:

```typescript
import {
  BidirectionalAdapter,
  capitalize,
  isoDateToLocal,
} from 'data-transform-kit';

interface ApiUser {
  id: string;
  first_name: string;
  created_at: string;
}

interface UiUser {
  id: string;
  displayName: string;
  joinedDate: Date;
}

const userAdapter: BidirectionalAdapter<ApiUser, UiUser> = {
  toUi: (apiUser) => ({
    id: apiUser.id,
    displayName: capitalize(apiUser.first_name),
    joinedDate: isoDateToLocal(apiUser.created_at),
  }),

  toApi: (uiUser) => ({
    id: uiUser.id,
    first_name: uiUser.displayName.toLowerCase(),
    created_at: uiUser.joinedDate.toISOString(),
  }),
};

// Use the adapter
const uiUser = userAdapter.toUi(apiResponse);
const apiPayload = userAdapter.toApi(formData);
```

## 🧩 Composition

All transformers are designed to be composable:

```typescript
import {
  mapItems,
  transformField,
  capitalize,
  isoDateToLocal,
} from 'data-transform-kit';

// Compose transformers for complex operations
const transformUsers = mapItems(transformField('name', capitalize));

const transformPosts = mapItems(transformField('created_at', isoDateToLocal));

// Chain transformations
const processApiResponse = (data) => {
  return transformUsers(transformPosts(data));
};
```

## 🌍 Timezone Support

Built-in timezone handling for global applications:

```typescript
import {
  formatDateHuman,
  formatTimestampLocal,
  getUserTimezone,
} from 'data-transform-kit';

// Automatic user timezone detection
const userTz = getUserTimezone(); // "America/Los_Angeles"

// Format in specific timezones
formatDateHuman('Europe/London')(date); // "December 25, 2023 6:30 PM GMT"
formatDateHuman('Asia/Tokyo')(date); // "December 26, 2023 3:30 AM JST"

// Format timestamps in user's local timezone
formatTimestampLocal()(timestamp); // Automatically uses user's timezone
```

## 🎨 TypeScript Support

Full type safety with intelligent inference:

```typescript
import { Transformer, pickFields } from 'data-transform-kit';

// Create custom transformers with full type safety
const extractUserInfo: Transformer<ApiUser, UserSummary> = (user) => ({
  id: user.id,
  name: capitalize(user.first_name),
  isActive: user.status === 'active',
});

// Type-safe field picking
const picker = pickFields(['id', 'name']); // TypeScript knows the return type
```

## 🏗️ Advanced Usage

### Custom Transformers

Create your own transformers following the same patterns:

```typescript
import { Transformer } from 'data-transform-kit';

const addPrefix = (prefix: string): Transformer<string, string> => {
  return (str: string) => `${prefix}${str}`;
};

const formatPhoneNumber: Transformer<string, string> = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};
```

### Conditional Transformations

```typescript
import { transformField } from 'data-transform-kit';

const conditionalTransform = <T>(
  condition: (value: T) => boolean,
  transformer: Transformer<T, T>
): Transformer<T, T> => {
  return (value: T) => (condition(value) ? transformer(value) : value);
};
```

## 📄 License

MIT © [Your Name]

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🐛 Issues

Found a bug? Please [create an issue](https://github.com/yourusername/frontend-data-adapters/issues).
