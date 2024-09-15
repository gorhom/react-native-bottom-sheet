---
id: bottomsheetbackdrop
title: BottomSheetBackdrop
sidebar_label: Backdrop
description: a pre-built BottomSheet backdrop implementation with configurable props.
image: /img/bottom-sheet-preview.gif
slug: /components/bottomsheetbackdrop
---

A pre-built BottomSheet backdrop implementation with configurable props.

## Props

Inherits `ViewProps` from `react-native`.

### animatedIndex

Current sheet position index.

| type                          | default | required |
| ----------------------------- | ------- | -------- |
| Animated.SharedValue\<number> | 0       | YES      |

### animatedPosition

Current sheet position.

| type                          | default | required |
| ----------------------------- | ------- | -------- |
| Animated.SharedValue<number/> | 0       | YES      |

### opacity

Backdrop opacity.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0.5     | NO       |

### appearsOnIndex

Snap point index when backdrop will appears on.

| type   | default | required |
| ------ | ------- | -------- |
| number | 1       | NO       |

### disappearsOnIndex

Snap point index when backdrop will disappears on.

| type   | default | required |
| ------ | ------- | -------- |
| number | 0       | NO       |

### enableTouchThrough

Enable touch through backdrop component.

| type    | default | required |
| ------- | ------- | -------- |
| boolean | false   | NO       |

### pressBehavior

What should happen when user press backdrop?

- `none`: do nothing, and `onPress` prop will be ignored.
- `close`: close the sheet.
- `collapse`: collapse the sheet.
- `N`: snap point index.

| type                              | default | required |
| --------------------------------- | ------- | -------- |
| `BackdropPressBehavior` \| number | 'close' | NO       |

### onPress

Pressing the backdrop will call the `onPress` function, it will be called before the action defined by `pressBehavior` is executed

| type     | default   | required |
| -------- | --------- | -------- |
| function | undefined | NO       |

## Example

```tsx
import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

const App = () => {
	// ref
	const bottomSheetRef = useRef<BottomSheet>(null);

	// variables
	const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

	// callbacks
	const handleSheetChanges = useCallback((index: number) => {
		console.log("handleSheetChanges", index);
	}, []);

	// renders
	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={1}
				appearsOnIndex={2}
			/>
		),
		[]
	);
	return (
		<View style={styles.container}>
			<BottomSheet
				ref={bottomSheetRef}
				index={1}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				onChange={handleSheetChanges}
			>
				<View style={styles.contentContainer}>
					<Text>Awesome 🎉</Text>
				</View>
			</BottomSheet>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: "grey",
	},
	contentContainer: {
		flex: 1,
		alignItems: "center",
	},
});

export default App;
```
