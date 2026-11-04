import type { AccessibilityProps } from 'react-native';
import {
  DEFAULT_ACCESSIBILITY_HINT,
  DEFAULT_ACCESSIBILITY_LABEL,
  DEFAULT_ACCESSIBILITY_ROLE,
  DEFAULT_ACCESSIBLE,
} from '../../components/bottomSheetBackdrop/constants';
import type { BottomSheetDefaultBackdropProps } from '../../components/bottomSheetBackdrop/types';

type UseBottomSheetBackdropAccessibilityParams = Pick<
  BottomSheetDefaultBackdropProps,
  | 'accessible'
  | 'accessibilityRole'
  | 'accessibilityLabel'
  | 'accessibilityHint'
  | 'accessibilityActions'
  | 'onAccessibilityTap'
  | 'onAccessibilityAction'
  | 'pressBehavior'
  | 'onPress'
> & {
  isHidden: boolean;
  handleOnPress: () => void;
};

export function useBottomSheetBackdropAccessibility({
  accessible = DEFAULT_ACCESSIBLE,
  accessibilityRole = DEFAULT_ACCESSIBILITY_ROLE,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
  accessibilityHint,
  accessibilityActions,
  onAccessibilityTap,
  onAccessibilityAction,
  pressBehavior,
  onPress,
  isHidden,
  handleOnPress,
}: UseBottomSheetBackdropAccessibilityParams): AccessibilityProps {
  return {
    accessible:
      !isHidden &&
      (pressBehavior !== 'none' || Boolean(onPress)) &&
      (accessible ?? false),
    accessibilityElementsHidden: isHidden,
    importantForAccessibility: isHidden ? 'no-hide-descendants' : 'auto',
    onAccessibilityTap: () => {
      if (!isHidden) {
        if (onAccessibilityTap) {
          onAccessibilityTap();
        } else {
          handleOnPress();
        }
      }
    },
    accessibilityActions: accessibilityActions ?? [{ name: 'activate' }],
    onAccessibilityAction: event => {
      if (onAccessibilityAction) {
        onAccessibilityAction(event);
      } else if (event.nativeEvent.actionName === 'activate' && !isHidden) {
        handleOnPress();
      }
    },
    accessibilityRole: accessibilityRole ?? undefined,
    accessibilityLabel: accessibilityLabel ?? undefined,
    accessibilityHint:
      accessibilityHint !== undefined
        ? (accessibilityHint ?? undefined)
        : pressBehavior === 'close'
          ? DEFAULT_ACCESSIBILITY_HINT
          : pressBehavior === 'collapse'
            ? 'Collapses the bottom sheet'
            : typeof pressBehavior === 'number'
              ? 'Moves the bottom sheet'
              : undefined,
  };
}
