import { FunctionComponent } from 'react';
import { useTheme } from 'next-themes';

export const ThemeToggle: FunctionComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      name="themeToggle"
      id="themeToggle"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="system">System</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
};
