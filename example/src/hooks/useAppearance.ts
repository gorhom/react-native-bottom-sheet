import { useContext } from 'react';
import { AppearanceContext } from '../contexts';

export const useAppearance = () => {
  return useContext(AppearanceContext);
};
