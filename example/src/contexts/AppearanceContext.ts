import { createContext } from 'react';

interface AppearanceContextType {
  appearance: 'dark' | 'light';
}

export const AppearanceContext = createContext<AppearanceContextType>({
  appearance: 'light',
});
