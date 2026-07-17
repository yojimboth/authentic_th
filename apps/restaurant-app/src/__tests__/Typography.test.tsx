import { render, screen } from '@testing-library/react-native';
import { Typography } from '../components/common/Typography';

describe('Typography', () => {
  it('renders children', () => {
    render(<Typography variant="body">Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  it('renders h1 variant', () => {
    render(<Typography variant="h1">Title</Typography>);
    expect(screen.getByText('Title')).toBeTruthy();
  });

  it('renders h2 variant', () => {
    render(<Typography variant="h2">Subtitle</Typography>);
    expect(screen.getByText('Subtitle')).toBeTruthy();
  });

  it('renders h3 variant', () => {
    render(<Typography variant="h3">Heading 3</Typography>);
    expect(screen.getByText('Heading 3')).toBeTruthy();
  });

  it('renders caption variant', () => {
    render(<Typography variant="caption">Small text</Typography>);
    expect(screen.getByText('Small text')).toBeTruthy();
  });
});