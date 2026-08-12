import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RichText } from './RichText';

describe('RichText', () => {
  it('renders **bold** segments inside a <b>', () => {
    render(<RichText text="hello **world** end" />);
    const b = screen.getByText('world');
    expect(b.tagName).toBe('B');
  });

  it('renders __em__ segments inside an <em>', () => {
    render(<RichText text="a __highlighted__ b" />);
    const em = screen.getByText('highlighted');
    expect(em.tagName).toBe('EM');
  });

  it('renders plain text with no markers as-is', () => {
    render(<RichText text="plain sentence" />);
    expect(screen.getByText('plain sentence')).toBeTruthy();
  });
});
