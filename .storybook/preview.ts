import type { Preview } from '@storybook/react';
import './preview.css'; // Import custom CSS for TOC styling

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'Table of Contents',
        disable: false,
      },
    },
    options: {
      storySort: {
        order: [
          '📖 Documentation',
          [
            'Introduction',
            'API Data Transformer Types',
            'Array Transformers',
            'Date Transformers',
            'Number Transformers',
            'Object Transformers',
            'String Transformers',
          ],
        ],
      },
    },
  },
};

export default preview;
