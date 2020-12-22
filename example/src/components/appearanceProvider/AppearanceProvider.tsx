import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
// @ts-ignore
import { Appearance } from 'react-native';
import { AppearanceContext } from '../../contexts';

interface AppearanceProviderProps {
  children?: ReactNode;
}

const _colorScheme = Appearance.getColorScheme();

const AppearanceProvider = ({ children }: AppearanceProviderProps) => {
  // state
  const [appearance, setAppearance] = useState(_colorScheme);

  // variables
  const contextValue = useMemo(() => ({ appearance }), [appearance]);

  // callback
  const handleAppearanceChange = useCallback(({ colorScheme }) => {
    setAppearance(colorScheme);
  }, []);

  // effects
  useEffect(() => {
    Appearance.addChangeListener(handleAppearanceChange);

    return () => {
      Appearance.removeChangeListener(handleAppearanceChange);
    };
  }, [handleAppearanceChange]);
  return (
    <AppearanceContext.Provider value={contextValue}>
      {children}
    </AppearanceContext.Provider>
  );
};

export default AppearanceProvider;
