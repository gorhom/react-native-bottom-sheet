---
id: accessibility
title: Accessibility
slug: /guides/accessibility
---

## Sheet Controls

The default handle exposes the adjustable role, increment and decrement
actions, and a numeric position value. Adjusting moves between the current
resolved snap points, including dynamically sized points, without dragging.
On Android, the switch-access up arrow expands to the next snap point and the
down arrow collapses to the previous one. React Native maps these native scroll
actions to `decrement` and `increment`, respectively. On iOS, increment expands
and decrement collapses. Collapsing from the smallest snap point closes the
sheet when `enablePanDownToClose` is enabled; otherwise it stops there.
Expanding stops at the largest snap point. Native numeric values describe the
sheet's position, increasing as it expands.

Sheet content is not grouped into a single accessibility element by default.
Give individual buttons, inputs, and headings appropriate roles and labels.
Setting `accessible={true}` on the sheet opts back into grouping its content.

Provide visible, labeled expand, collapse, and close buttons inside the sheet
for switch users. Do not rely exclusively on a drag gesture or on adjustable
actions being exposed by every assistive tool. Use touch targets of at least
48 by 48 density-independent units.

The backdrop supports native accessibility activation and follows its
`pressBehavior`. Hidden backdrops are excluded from accessibility navigation.
The iOS accessibility escape gesture closes sheets when
`enablePanDownToClose` is enabled. Set `onAccessibilityEscape` to override this
behavior, including when a confirmation step is required.

## List Scrolling

When VoiceOver or TalkBack is enabled, integrated bottom-sheet scrollables allow
native scrolling even before the sheet reaches its largest snap point. This
lets the platform bring off-screen focused items into view without the sheet
resetting their scroll offset. Downward list scrolling also expands an open,
collapsed sheet to its largest snap point, unless the sheet is already animating
or its handle is being dragged. Moving focus among visible items does not itself
expand the sheet, and scrolling backward does not automatically collapse it.

Left and right screen-reader swipes still navigate between accessible elements;
they are not remapped to scroll gestures. Native focus-reveal scrolling and
virtualized-list navigation must be verified on devices. Applications using
custom scroll event handlers must preserve equivalent behavior themselves.

## Modal Focus

Only the top visible modal is exposed to accessibility navigation. The modal
provider hides its application children while a modal is visible; portal content
is rendered separately so the active modal is not hidden with the application.
Place the provider around the application content that should be isolated.
Content outside that provider must be managed by the application.

Use explicit native refs for the initial focus target and the opener:

```tsx
const modalRef = useRef<BottomSheetModal>(null);
const openerRef = useRef<View>(null);
const closeRef = useRef<View>(null);

return (
  <>
    <Pressable
      ref={openerRef}
      accessibilityRole="button"
      onPress={() => modalRef.current?.present()}
    >
      <Text>Open options</Text>
    </Pressable>
    <BottomSheetModal
      ref={modalRef}
      initialAccessibilityFocusRef={closeRef}
      restoreAccessibilityFocusRef={openerRef}
    >
      <BottomSheetView>
        <Pressable
          ref={closeRef}
          accessibilityRole="button"
          onPress={() => modalRef.current?.dismiss()}
        >
          <Text>Close options</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  </>
);
```

The target must be accessible and mounted when presentation completes. Without
an initial ref, the default handle receives focus. For `handleComponent={null}`,
asynchronously mounted content, or a custom handle that does not forward the
focus ref, supply your own initial target. These focus refs manage native
accessibility focus, not keyboard focus or web focus.

## Custom Handles And Localization

Forward the accessibility props to `BottomSheetHandle` or to an accessible
native view. Override the label and hint with localized strings. Numeric
`accessibilityValue` avoids hard-coded position announcements; override it with
localized `text` when a more descriptive value is needed.

```tsx
const renderHandle = (props: BottomSheetHandleProps) => (
  <BottomSheetHandle
    {...props}
    accessibilityLabel={t('sheet.handle')}
    accessibilityHint={t('sheet.adjustHint')}
  />
);
```

When using a native view directly, attach `props.accessibilityFocusRef` as its
`ref` in addition to forwarding the action handler and value. Localize backdrop
labels and hints through its existing accessibility props too.

## Native Verification

Run the modal Simple example with each of VoiceOver, TalkBack, iOS Switch
Control, and Android Switch Access. Record device and OS versions in the PR.

- Open the modal and verify focus moves inside after presentation.
- Navigate to every content control and input independently.
- Adjust the handle across all snap points and verify both bounds.
- Repeat with one snap point and with dynamic sizing enabled.
- Activate the backdrop and verify close, collapse, numeric, and none behaviors.
- Confirm an invisible backdrop is not reachable.
- Use the in-sheet expand, collapse, and close buttons with switch scanning.
- Verify app content and lower stacked modals are not reachable while covered.
- Test push, switch, and replace stacks, plus dismiss-all and reopening.
- Close the last modal and verify focus returns to the opener.
- Test iOS accessibility escape with dismissal enabled and disabled.
- Repeat with Reduce Motion enabled and with a custom or absent handle.

Verify screen-reader announcements, switch scanning, native focus timing, and
portal layout on physical devices before submitting the PR.