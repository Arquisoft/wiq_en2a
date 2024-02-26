import { render, screen } from '@testing-library/react';
import App from './App';
import { useTranslation } from 'react-i18next';

test('renders learn react link', () => {
  const { t } = useTranslation()
  render(<App />);
  const linkElement = screen.getByText(/{t('app_name')}/i);
  expect(linkElement).toBeInTheDocument();
});
