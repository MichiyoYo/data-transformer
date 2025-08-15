import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  mapItems,
  filterItems,
  sortItems,
  groupBy,
  uniqueBy,
  findItem,
  reduceItems,
} from '../transformers/array';
import { capitalize } from '../transformers/string';
import { toFixed } from '../transformers/number';

const ArrayTransformerDemo = ({
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
  const [input, setInput] = useState(JSON.stringify(defaultInput || [], null, 2));
  const [additional, setAdditional] = useState(JSON.stringify(additionalInput || '', null, 2));
  
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
            <strong>Input Array (JSON):</strong>
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
            {typeof output === 'object' ? JSON.stringify(output, null, 2) : String(output)}
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

const meta: Meta<typeof ArrayTransformerDemo> = {
  title: '📋 Array Transformers',
  component: ArrayTransformerDemo,
  parameters: {
    docs: {
      description: {
        component: `
# Array Transformers

Comprehensive array manipulation utilities for data processing, filtering, sorting, and aggregation. Built on Lodash for consistent, performant operations.

## Basic Usage

\`\`\`typescript
import { mapItems, filterItems, sortItems, groupBy } from 'data-transform-kit';

const users = [{ name: 'john', age: 25 }, { name: 'jane', age: 30 }];
const capitalizedNames = mapItems(user => ({ ...user, name: capitalize(user.name) }))(users);
const adults = filterItems(user => user.age >= 18)(users);
const sorted = sortItems(user => user.age)(users);
\`\`\`

## Data Processing Pipelines

\`\`\`typescript
// E-commerce product processing
const processProducts = (products) => {
  let processed = products;
  processed = filterItems(product => product.inStock)(processed);
  processed = sortItems(product => product.price, true)(processed);
  processed = mapItems(product => ({ 
    ...product, 
    formattedPrice: formatCurrency(2)(product.price) 
  }))(processed);
  return processed;
};
\`\`\`

## Data Aggregation

\`\`\`typescript
// Group sales by category
const salesByCategory = groupBy(sale => sale.category)(salesData);

// Calculate totals
const totalRevenue = reduceItems(
  (total, sale) => total + sale.amount,
  0
)(salesData);

// Find top performer
const topSalesperson = findItem(person => person.sales === maxSales)(salesTeam);
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArrayTransformerDemo>;

const sampleUsers = [
  { id: 1, name: 'john doe', age: 25, department: 'engineering', salary: 75000 },
  { id: 2, name: 'jane smith', age: 30, department: 'marketing', salary: 85000 },
  { id: 3, name: 'bob johnson', age: 35, department: 'engineering', salary: 95000 },
  { id: 4, name: 'alice brown', age: 28, department: 'design', salary: 70000 },
  { id: 5, name: 'charlie wilson', age: 32, department: 'marketing', salary: 80000 }
];

export const MapItems: Story = {
  args: {
    transformer: mapItems((user: any) => ({ 
      ...user, 
      name: capitalize(user.name),
      formattedSalary: `$${user.salary.toLocaleString()}`
    })),
    defaultInput: sampleUsers,
    description: 'Transform each item in an array using a mapping function, perfect for data formatting and enrichment.',
    codeExample: `import { mapItems } from 'data-transform-kit';
import { capitalize } from 'data-transform-kit';

const formatUsers = mapItems(user => ({
  ...user,
  name: capitalize(user.name),
  formattedSalary: \`$\${user.salary.toLocaleString()}\`
}));

const formattedUsers = formatUsers(users);

// Price formatting
const formatPrices = mapItems(product => ({
  ...product,
  price: formatCurrency(2)(product.price),
  discount: formatPercentage(1)(product.discount)
}));

// API response transformation
const normalizeApiData = mapItems(item => ({
  id: item.user_id,
  name: item.full_name,
  email: item.email_address
}));`,
  },
};

export const FilterItems: Story = {
  args: {
    transformer: filterItems((user: any) => user.age >= 30),
    defaultInput: sampleUsers,
    description: 'Filter array items based on a predicate function, useful for data querying and validation.',
    codeExample: `import { filterItems } from 'data-transform-kit';

const getAdults = filterItems(user => user.age >= 18);
const adults = getAdults(users);

const getHighEarners = filterItems(user => user.salary > 80000);
const topEarners = getHighEarners(users);

// Complex filtering
const getEngineeringLeads = filterItems(user => 
  user.department === 'engineering' && 
  user.experience > 5 && 
  user.isLead
);

// E-commerce filtering
const getAvailableProducts = filterItems(product => 
  product.inStock && 
  product.price > 0 && 
  !product.discontinued
);

// Form validation
const getValidEntries = filterItems(entry => 
  entry.email && 
  entry.name && 
  entry.agreedToTerms
);`,
  },
};

export const SortItems: Story = {
  args: {
    transformer: (items: any[]) => sortItems((user: any) => user.salary, false)(items),
    defaultInput: sampleUsers,
    description: 'Sort array items by a specified property or computed value, with ascending/descending control.',
    codeExample: `import { sortItems } from 'data-transform-kit';

// Sort by salary (descending)
const sortBySalaryDesc = sortItems(user => user.salary, false);
const highestPaid = sortBySalaryDesc(users);

// Sort by age (ascending)
const sortByAge = sortItems(user => user.age, true);
const youngestFirst = sortByAge(users);

// Sort by name alphabetically
const sortByName = sortItems(user => user.name.toLowerCase());
const alphabetical = sortByName(users);

// Sort by multiple criteria (using computed value)
const sortByDepartmentThenSalary = sortItems(user => 
  \`\${user.department}-\${String(user.salary).padStart(10, '0')}\`
);

// E-commerce sorting
const sortByPopularity = sortItems(product => 
  product.views * 0.3 + product.purchases * 0.7, false
);`,
  },
};

export const GroupBy: Story = {
  args: {
    transformer: groupBy((user: any) => user.department),
    defaultInput: sampleUsers,
    description: 'Group array items by a specified key or computed value, creating organized data structures.',
    codeExample: `import { groupBy } from 'data-transform-kit';

const groupByDepartment = groupBy(user => user.department);
const departmentGroups = groupByDepartment(users);
// { engineering: [...], marketing: [...], design: [...] }

// Group by age range
const groupByAgeRange = groupBy(user => {
  if (user.age < 25) return 'young';
  if (user.age < 35) return 'middle';
  return 'senior';
});

// Group by salary tier
const groupBySalaryTier = groupBy(user => {
  if (user.salary < 70000) return 'entry';
  if (user.salary < 90000) return 'mid';
  return 'senior';
});

// E-commerce grouping
const groupByCategory = groupBy(product => product.category);
const productsByCategory = groupByCategory(products);

// Analytics grouping
const groupByMonth = groupBy(sale => 
  sale.date.toISOString().slice(0, 7) // 'YYYY-MM'
);`,
  },
};

export const UniqueBy: Story = {
  args: {
    transformer: uniqueBy((user: any) => user.department),
    defaultInput: sampleUsers,
    description: 'Remove duplicate items from an array based on a specified key or computed value.',
    codeExample: `import { uniqueBy } from 'data-transform-kit';

const uniqueByDepartment = uniqueBy(user => user.department);
const onePerDepartment = uniqueByDepartment(users);

// Remove duplicate emails
const uniqueByEmail = uniqueBy(user => user.email.toLowerCase());
const noDuplicateEmails = uniqueByEmail(users);

// Unique products by name (case-insensitive)
const uniqueByName = uniqueBy(product => product.name.toLowerCase());
const uniqueProducts = uniqueByName(products);

// Keep latest entry per user
const keepLatestUser = uniqueBy(user => user.id);

// E-commerce: unique items by SKU
const uniqueBySku = uniqueBy(item => item.sku);
const uniqueInventory = uniqueBySku(inventory);

// Analytics: unique visitors by session
const uniqueBySession = uniqueBy(visit => visit.sessionId);`,
  },
};

export const FindItem: Story = {
  args: {
    transformer: findItem((user: any) => user.salary > 90000),
    defaultInput: sampleUsers,
    description: 'Find the first item in an array that matches a predicate function.',
    codeExample: `import { findItem } from 'data-transform-kit';

const findHighEarner = findItem(user => user.salary > 90000);
const topEarner = findHighEarner(users);

// Find by ID
const findUserById = (id) => findItem(user => user.id === id);
const specificUser = findUserById(3)(users);

// Find admin user
const findAdmin = findItem(user => user.role === 'admin');
const adminUser = findAdmin(users);

// E-commerce: find featured product
const findFeaturedProduct = findItem(product => 
  product.featured && product.inStock
);

// Find incomplete task
const findIncompleteTask = findItem(task => 
  !task.completed && task.priority === 'high'
);

// Find available appointment slot
const findAvailableSlot = findItem(slot => 
  !slot.booked && slot.date >= new Date()
);`,
  },
};

export const ReduceItems: Story = {
  args: {
    transformer: (items: any[]) => reduceItems(
      (total: number, user: any) => total + user.salary,
      0
    )(items),
    defaultInput: sampleUsers,
    description: 'Reduce an array to a single value using an accumulator function, perfect for calculations and aggregations.',
    codeExample: `import { reduceItems } from 'data-transform-kit';

// Calculate total salary
const calculateTotalSalary = reduceItems(
  (total, user) => total + user.salary,
  0
);
const totalPayroll = calculateTotalSalary(users);

// Calculate average age
const calculateAverageAge = (users) => {
  const total = reduceItems((sum, user) => sum + user.age, 0)(users);
  return total / users.length;
};

// Build summary object
const buildSummary = reduceItems(
  (summary, user) => ({
    totalUsers: summary.totalUsers + 1,
    totalSalary: summary.totalSalary + user.salary,
    departments: {
      ...summary.departments,
      [user.department]: (summary.departments[user.department] || 0) + 1
    }
  }),
  { totalUsers: 0, totalSalary: 0, departments: {} }
);

// E-commerce: calculate cart total
const calculateCartTotal = reduceItems(
  (total, item) => total + (item.price * item.quantity),
  0
);

// Analytics: aggregate metrics
const aggregateMetrics = reduceItems(
  (metrics, event) => ({
    ...metrics,
    [event.type]: (metrics[event.type] || 0) + 1
  }),
  {}
);`,
  },
};
