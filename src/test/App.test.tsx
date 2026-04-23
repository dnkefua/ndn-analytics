import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
  });
});
