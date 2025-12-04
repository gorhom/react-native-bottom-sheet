# Changelog

## [5.2.8](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.2.7...v5.2.8) (2025-12-04)

### 🐛 Bug Fixes

* **mock:** replace JSX syntax with `createElement` ([#2302](https://github.com/gorhom/react-native-bottom-sheet/issues/2302))(by [@huextrat](https://github.com/huextrat)) ([fdeff8f](https://github.com/gorhom/react-native-bottom-sheet/commit/fdeff8f289186672a14013e404d143922a9be232))
* removed deprecated Easing constant ([#2486](https://github.com/gorhom/react-native-bottom-sheet/issues/2486))(by [@joshua-zbni](https://github.com/joshua-zbni)) ([164d982](https://github.com/gorhom/react-native-bottom-sheet/commit/164d9828b40aeb18f52925731e9602db40c699a5))

### 🧹 Maintenance Chores

* updated example deps ([f3aa263](https://github.com/gorhom/react-native-bottom-sheet/commit/f3aa26310ea6ebc353031c17884e0f4b3a6a3f4d))

## [5.2.7](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.2.6...v5.2.7) (2025-11-26)

### 🐛 Bug Fixes

* fixed function undefined error in useBoundingClientRect ([#2561](https://github.com/gorhom/react-native-bottom-sheet/issues/2561))(by [@tylerdgenius](https://github.com/tylerdgenius), [@fab-nikhil](https://github.com/fab-nikhil), [@pinpong](https://github.com/pinpong)) ([3a99ee4](https://github.com/gorhom/react-native-bottom-sheet/commit/3a99ee4a2bc69ed280f045951edf4cfcf6bc6581))

### 🧹 Maintenance Chores

* updated ts tags for getBoundingClientRect ([6b22037](https://github.com/gorhom/react-native-bottom-sheet/commit/6b220371a4b591ac694cf1a8e16173f28ccdbba5))

## [5.2.6](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.2.5...v5.2.6) (2025-09-05)

### 🐛 Bug Fixes

* **#2452:** prevented the bottom sheet from snapping to -1 when resizing the detent while keyboard is open([#2327](https://github.com/gorhom/react-native-bottom-sheet/issues/2327))(by [@pakerwreah](https://github.com/pakerwreah)) ([c68edac](https://github.com/gorhom/react-native-bottom-sheet/commit/c68edacf50b76ca08ac599a8485a533c710c6289)), closes [#2452](https://github.com/gorhom/react-native-bottom-sheet/issues/2452)
* prevent the bottom sheet from closing when over dragging while keyboard is open ([cce1f7e](https://github.com/gorhom/react-native-bottom-sheet/commit/cce1f7e0cc1b0d3c2a0014ba17624f8671816e15))

## [5.2.5](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.2.4...v5.2.5) (2025-09-04)

### 🐛 Bug Fixes

* **#2449:** adjust next index to current index when animating to a temporary position ([20de151](https://github.com/gorhom/react-native-bottom-sheet/commit/20de1513f571e079d243da9f3bbf3688f10acf7b)), closes [#2449](https://github.com/gorhom/react-native-bottom-sheet/issues/2449)
* **#2449:** adjust next index to the highest detent index when animating by keyboard ([f8cd4fe](https://github.com/gorhom/react-native-bottom-sheet/commit/f8cd4fe37c1b05abd4153f586d61658a3d7954b8)), closes [#2449](https://github.com/gorhom/react-native-bottom-sheet/issues/2449)
* conditionally apply web-only cursor style to avoid TypeScript error ([#2420](https://github.com/gorhom/react-native-bottom-sheet/issues/2420))(by [@kirstilynn](https://github.com/kirstilynn)) ([e5c077b](https://github.com/gorhom/react-native-bottom-sheet/commit/e5c077b9cc630d256ca8d9a895a35b1989394d7a))

### 🧹 Maintenance Chores

* updated the example deps ([c9e0473](https://github.com/gorhom/react-native-bottom-sheet/commit/c9e0473f097d61d467449b68af1170e58267136a))

## [5.2.4](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.2.3...v5.2.4) (2025-08-28)

### 🐛 Bug Fixes

* **#2430:** fixed flickering issue with animation by keyboard ([334e94c](https://github.com/gorhom/react-native-bottom-sheet/commit/334e94c5ffd700261201c07bd153711d38b09ef6))
* **#2430:** fixed the force closing when switching between two text inputs ([086baed](https://github.com/gorhom/react-native-bottom-sheet/commit/086baeda48be71b9b8d020e1b680573a92218b18))
* **#2431:** added handling for evaluating position for detent change while animating ([090afa6](https://github.com/gorhom/react-native-bottom-sheet/commit/090afa64338e27882ae4c32b090e9ce72a2ba38a)), closes [#2431](https://github.com/gorhom/react-native-bottom-sheet/issues/2431)
* memoized the scrollable creator hook ([e51e523](https://github.com/gorhom/react-native-bottom-sheet/commit/e51e52382ee561a2db6022af36ab5181e07c8042))

### 🧹 Maintenance Chores

* updated biome dep ([eb03ab0](https://github.com/gorhom/react-native-bottom-sheet/commit/eb03ab074dc17df9c3ff404f645db3bfbc0c6aab))

## [5.2.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.2.2...v5.2.3) (2025-08-18)

## [5.2.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.2.1...v5.2.2) (2025-08-18)

### 🐛 Bug Fixes

* **#2364:** fixed layouting issue when dynamic sizing enabled and handle is not provided ([d3275b1](https://github.com/gorhom/react-native-bottom-sheet/commit/d3275b1e97ab7ed975cc28ddcfaa2ffb25624c98))

## [5.2.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.2.0...v5.2.1) (2025-08-18)

### 🐛 Bug Fixes

* **#2418:** updated nullability check for highestDetentPosition ([b51ea61](https://github.com/gorhom/react-native-bottom-sheet/commit/b51ea619a2c36d5a2514ad00a43928e206db0512)), closes [#2418](https://github.com/gorhom/react-native-bottom-sheet/issues/2418)

## [5.2.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.8...v5.2.0) (2025-08-17)

### 🚀 New Features

* added a scrollable creator hook to allow integrate with third party list libraries ([d6250e2](https://github.com/gorhom/react-native-bottom-sheet/commit/d6250e20b19801c5ea50af3e369904ebb90eb7b9))

### 🐛 Bug Fixes

* **#2356:** added missing dependencies to callback hooks ([#2382](https://github.com/gorhom/react-native-bottom-sheet/issues/2382)) ([dfaec13](https://github.com/gorhom/react-native-bottom-sheet/commit/dfaec131efde3126f6ff11e2fd409fd94864ef8c)), closes [#2356](https://github.com/gorhom/react-native-bottom-sheet/issues/2356) [#2356](https://github.com/gorhom/react-native-bottom-sheet/issues/2356)

### 🧹 Maintenance Chores

* updated animated layout hook default return ([99efdd7](https://github.com/gorhom/react-native-bottom-sheet/commit/99efdd77c49db49039afabb14a8d34cd68764afc))
* updated example deps ([248ddd9](https://github.com/gorhom/react-native-bottom-sheet/commit/248ddd97a098627773114d1784c3abb0c5bd028e))
* updated examples ([eb95f3a](https://github.com/gorhom/react-native-bottom-sheet/commit/eb95f3a65e7a7ecd6b317b9e2a28df79780215c7))
* updated types ([a123b17](https://github.com/gorhom/react-native-bottom-sheet/commit/a123b179e3fd86c54b601f9caf2f1f936a79b187))

### ♻️ Code Refactor

* added isForcedClosing to animation state ([ab97f77](https://github.com/gorhom/react-native-bottom-sheet/commit/ab97f7755683ff2553e4daaee471fc6db6adf2ee))
* optimise animation state ([63dc473](https://github.com/gorhom/react-native-bottom-sheet/commit/63dc4733c20e7d9dd4b1f8a5a80894a8395420b8))
* optimise keyboard state, and remove redundant variables ([bd6c8c6](https://github.com/gorhom/react-native-bottom-sheet/commit/bd6c8c66f5617e0c398047a3c0934ab75105b17a))
* optimise layout state ([4dfe07a](https://github.com/gorhom/react-native-bottom-sheet/commit/4dfe07a1a49e5e7a2faf339535d2dc7678f71323))
* optimise next position state ([3d6add6](https://github.com/gorhom/react-native-bottom-sheet/commit/3d6add6d8e9570165241c0c801953c72b47c2921))
* optimise scrollable state ([bacca9d](https://github.com/gorhom/react-native-bottom-sheet/commit/bacca9d024df6be1157e19a607b85ded84d69b7e))
* optimise snap points/detents state ([5de7bd3](https://github.com/gorhom/react-native-bottom-sheet/commit/5de7bd343492d7f0ac978502431a1465e2d7299c))
* removed isContentHeightFixed shared value ([e26426a](https://github.com/gorhom/react-native-bottom-sheet/commit/e26426a17e4793b7749d337fc549d118db0111f2))
* removed next position animated value ([b81a1fd](https://github.com/gorhom/react-native-bottom-sheet/commit/b81a1fd31641b4440754be70c5007add418621b7))

## [5.1.8](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.6...v5.1.8) (2025-07-27)


### Bug Fixes

* added support for reanimated v4 ([#2223](https://github.com/gorhom/react-native-bottom-sheet/issues/2223))(by [@skusnierz](https://github.com/skusnierz)) ([d96a18e](https://github.com/gorhom/react-native-bottom-sheet/commit/d96a18eb113739bb7707e2f61e17ece2afb3b174))
* migrate from `useWorkletCallback` ([#2356](https://github.com/gorhom/react-native-bottom-sheet/issues/2356))(by [@tomekzaw](https://github.com/tomekzaw)) ([3620972](https://github.com/gorhom/react-native-bottom-sheet/commit/3620972160f987b4437c06927a9ab768fbffe843))

## [5.1.7](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.6...v5.1.7) (2025-07-27)

## [5.1.6](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.5...v5.1.6) (2025-06-03)


### Bug Fixes

* **#2267:** early exit when attempting to snap to index while layout is not ready ([0715f03](https://github.com/gorhom/react-native-bottom-sheet/commit/0715f0384a187cdb1df903d693666ac4b12db807)), closes [#2267](https://github.com/gorhom/react-native-bottom-sheet/issues/2267)
* **#2278:** removed flashlist for web ([e17096f](https://github.com/gorhom/react-native-bottom-sheet/commit/e17096feade145f9e6349815398f8aaae758d554)), closes [#2278](https://github.com/gorhom/react-native-bottom-sheet/issues/2278)
* added positions to onAnimate, and prevent index to be negative with keyboard animations ([#2271](https://github.com/gorhom/react-native-bottom-sheet/issues/2271))(by [@souyahia](https://github.com/souyahia)) ([898270e](https://github.com/gorhom/react-native-bottom-sheet/commit/898270e62e0f83c8f8df671a60d6aabe749d890e))
* allow bottom sheet view to resize it self when its content resized ([5397478](https://github.com/gorhom/react-native-bottom-sheet/commit/53974786a18aceab1cc15def1b29c94ef93002e3))
* updated BottomSheetModal mock, add createBottomSheetScrollableComponent and enum mocks ([#2265](https://github.com/gorhom/react-native-bottom-sheet/issues/2265))(by [@gabimoncha](https://github.com/gabimoncha)) ([a77904a](https://github.com/gorhom/react-native-bottom-sheet/commit/a77904ac935278bec4e086700e1e93baa54282b6))

## [5.1.5](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.4...v5.1.5) (2025-05-26)


### Bug Fixes

* **#2237:** fixed node handle lookup for virtualized list on web (by [@btoo](https://github.com/btoo)) ([6442b0e](https://github.com/gorhom/react-native-bottom-sheet/commit/6442b0ea54a38d8dcb82f63aade077ead29d382b))
* **#2288:** added unique id to the root bottom sheet modal portal ([711ea7a](https://github.com/gorhom/react-native-bottom-sheet/commit/711ea7a5290ef485b9ba5c65eb45e28d6e495b43)), closes [#2288](https://github.com/gorhom/react-native-bottom-sheet/issues/2288)
* fixed initial content height calculation on web ([4db946e](https://github.com/gorhom/react-native-bottom-sheet/commit/4db946e4af331bb2d3a80002ee6051da9f3593eb))
* prevent canceling touchmove events when not cancelable ([#2244](https://github.com/gorhom/react-native-bottom-sheet/issues/2244))(by [@erickreutz](https://github.com/erickreutz)) ([14d5d1e](https://github.com/gorhom/react-native-bottom-sheet/commit/14d5d1e89f22b5101445799fd0cb836ecb7c4882))
* provide the portal host name with use portal ([67e9097](https://github.com/gorhom/react-native-bottom-sheet/commit/67e909711164aba900c2764034723c8b0e051704))

## [5.1.4](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.3...v5.1.4) (2025-05-04)


### Bug Fixes

* **#2237:** fixed recursive loop in findNodeHandle.web (by @TNAJanssen) ([3556ba8](https://github.com/gorhom/react-native-bottom-sheet/commit/3556ba8e1445a78dfc6cfc93997500d52a03368e))

## [5.1.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.2...v5.1.3) (2025-05-04)


### Bug Fixes

* **#2237:** updated findNodeHandle for web to support React 19 ([47a95f5](https://github.com/gorhom/react-native-bottom-sheet/commit/47a95f517ab5b4680d0f5a45b09464911aafd35e)), closes [#2237](https://github.com/gorhom/react-native-bottom-sheet/issues/2237)

## [5.1.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.1...v5.1.2) (2025-03-09)


### Bug Fixes

* **#2163:** restart closing animation when container height get updated ([4ed9f3c](https://github.com/gorhom/react-native-bottom-sheet/commit/4ed9f3cb542316a984893efa2025ca5384ffe89a)), closes [#2163](https://github.com/gorhom/react-native-bottom-sheet/issues/2163)
* **#2177:** set absolute fill to backdrop default style ([979ba7c](https://github.com/gorhom/react-native-bottom-sheet/commit/979ba7ce0b9d69abfaefd169ee692bf818fa4d0d)), closes [#2177](https://github.com/gorhom/react-native-bottom-sheet/issues/2177)

## [5.1.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.1.0...v5.1.1) (2025-02-09)


### Bug Fixes

* **#2043:** handle unnecessary invocation of index side effect ([#2073](https://github.com/gorhom/react-native-bottom-sheet/issues/2073))(inspired by @IslamRustamov) ([2164c02](https://github.com/gorhom/react-native-bottom-sheet/commit/2164c02e63177f9ac69acc05722c85e8d55cd931)), closes [#2043](https://github.com/gorhom/react-native-bottom-sheet/issues/2043)

# [5.1.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.0.6...v5.1.0) (2025-02-06)


### Bug Fixes

* **#2129:** fixed initial isAnimatedOnMount value ([0850cb8](https://github.com/gorhom/react-native-bottom-sheet/commit/0850cb864819f79189592cb66c2b6d179957ba61))


### Features

* added enableBlurKeyboardOnGesture prop to handle blurring keyboard on gesture ([1c31aca](https://github.com/gorhom/react-native-bottom-sheet/commit/1c31acad50a7c171548ea7f4594a4d1d563cf40f))

## [5.0.6](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.0.5...v5.0.6) (2024-11-17)


### Bug Fixes

* clipped views when keyboard is closing ([2320a81](https://github.com/gorhom/react-native-bottom-sheet/commit/2320a81f95e696e22debe5a823740f51fadae0f6))
* removed keyboard height setting from hide event ([61473b5](https://github.com/gorhom/react-native-bottom-sheet/commit/61473b56c3389e5ac9edfeb1dc4b93907e3b5d05))
* updated useStableCallback to set callback in ref without useEffect ([#2010](https://github.com/gorhom/react-native-bottom-sheet/issues/2010))(by [@pavel-krasnov](https://github.com/pavel-krasnov)) ([e898859](https://github.com/gorhom/react-native-bottom-sheet/commit/e89885936391f5ce106983d8aac814bcb422e82c))
* useStableCallback implementation ([87a73c5](https://github.com/gorhom/react-native-bottom-sheet/commit/87a73c59b83ef0b3868c12403a467ea3aebf0dd5))

## [5.0.5](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.0.4...v5.0.5) (2024-10-26)


### Bug Fixes

* **#1983:** updated shared values access as hook dependancies ([#1992](https://github.com/gorhom/react-native-bottom-sheet/issues/1992))(by [@pinpong](https://github.com/pinpong)) ([9757bd2](https://github.com/gorhom/react-native-bottom-sheet/commit/9757bd251cba67cf26489640f20fd1557b1a426e)), closes [#1983](https://github.com/gorhom/react-native-bottom-sheet/issues/1983) [#1983](https://github.com/gorhom/react-native-bottom-sheet/issues/1983)
* added BottomSheetFlashList mock ([#1988](https://github.com/gorhom/react-native-bottom-sheet/issues/1988))(by @Fadikk367) ([13c7d47](https://github.com/gorhom/react-native-bottom-sheet/commit/13c7d47beae6f2451968d30e862f0ea49b7199b6))

## [5.0.4](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.0.3...v5.0.4) (2024-10-20)


### Bug Fixes

* **#1983:** updated shared values access as hook dependancies ([ae41b2d](https://github.com/gorhom/react-native-bottom-sheet/commit/ae41b2da650d2be614d840fbdfe1d29db6d7a575)), closes [#1983](https://github.com/gorhom/react-native-bottom-sheet/issues/1983)
* **#1987:** updated provided style handling for bottom sheet view ([4c8ae25](https://github.com/gorhom/react-native-bottom-sheet/commit/4c8ae252b8ec0bb420b60f8314cc7f04ed12b519)), closes [#1987](https://github.com/gorhom/react-native-bottom-sheet/issues/1987)

## [5.0.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.0.2...v5.0.3) (2024-10-20)


### Bug Fixes

* added children type to containerComponent prop type ([#1971](https://github.com/gorhom/react-native-bottom-sheet/issues/1971))(by @Nodonisko) ([203e52f](https://github.com/gorhom/react-native-bottom-sheet/commit/203e52fa5be3e167522776f184d79511bdf35344))
* dynamic sizing with detached static views ([b72e275](https://github.com/gorhom/react-native-bottom-sheet/commit/b72e27519c36671d84973f8b0b9cd1f8a7a8b8c1))
* fixed dynamic scrollables content size with footer in place ([ace0da7](https://github.com/gorhom/react-native-bottom-sheet/commit/ace0da7475d68d4f27d386ead9f71c2eb19fbe31))
* updated reduce motion handling, to respeact user setting and allow overriding ([1ef05c7](https://github.com/gorhom/react-native-bottom-sheet/commit/1ef05c7fee821c356220452ccf61d33d29483c00))

## [5.0.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.0.1...v5.0.2) (2024-10-14)


### Bug Fixes

* **#1035,#1043:** updated default animatedNextPositionIndex to INITIAL_VALUE ([#1960](https://github.com/gorhom/react-native-bottom-sheet/issues/1960))(by [@dfalling](https://github.com/dfalling)) ([1cf3e41](https://github.com/gorhom/react-native-bottom-sheet/commit/1cf3e4167f2ffacf36c7abebb527f79048754121)), closes [#1035](https://github.com/gorhom/react-native-bottom-sheet/issues/1035) [#1043](https://github.com/gorhom/react-native-bottom-sheet/issues/1043)
* **#1968:** moved the flashlist optional import into the component body ([ab33e21](https://github.com/gorhom/react-native-bottom-sheet/commit/ab33e2132f8e6fdb4a3c36e34c0f2ff04e09f11f)), closes [#1968](https://github.com/gorhom/react-native-bottom-sheet/issues/1968)

## [5.0.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.0.0...v5.0.1) (2024-10-14)


### Bug Fixes

* removed redundant dependency ([3ffc7f7](https://github.com/gorhom/react-native-bottom-sheet/commit/3ffc7f70e8769fc1ecc39754111754b53d12bff8))

# [5.0.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.6.4...v5.0.0) (2024-10-13)

### Features

* added web support (#1150) ([`a996b4a`](https://github.com/gorhom/react-native-bottom-sheet/commit/a996b4aa68139136ec75e0921025d235471c838d))
* added flashlist as a scrollable ([9bf39ed](https://github.com/gorhom/react-native-bottom-sheet/commit/9bf39ed08d7377937b0e8b8af65791b178c06492))
* rewrite gesture apis with gesture handler 2 (#1126) ([`6a4d296`](https://github.com/gorhom/react-native-bottom-sheet/commit/6a4d2967684b01e28f23b1b35afbb4cc4dabaf1d))
* added accessibility overrides support ([#1288](https://github.com/gorhom/react-native-bottom-sheet/issues/1288))(by @Mahmoud-SK) ([6203c18](https://github.com/gorhom/react-native-bottom-sheet/commit/6203c18acc9f8dc3a31af5bf5ad80e368deceb52))
* added default dynamic sizing ([#1513](https://github.com/gorhom/react-native-bottom-sheet/issues/1513))(with @Eli-Nathan & [@ororsatti](https://github.com/ororsatti)) ([#1683](https://github.com/gorhom/react-native-bottom-sheet/issues/1683)) ([8017fb6](https://github.com/gorhom/react-native-bottom-sheet/commit/8017fb6b02088d3c66c64a8a23e0f63f22884d36))
* added a new bottom sheet stack behaviour `replace` ([#1897](https://github.com/gorhom/react-native-bottom-sheet/issues/1897))(with [@janodetzel](https://github.com/janodetzel)) ([997d794](https://github.com/gorhom/react-native-bottom-sheet/commit/997d794ccffe8739268ec50dfecca624e10f8752))

### Bug Fixes

* addressed an edge case with scrollview content sizing on initial rendering on safari ([d1226b7](https://github.com/gorhom/react-native-bottom-sheet/commit/d1226b70ac2405b4a98c8e5be6cee94ae110a35b))
* replaced deprecated reanimated Extrapolate with Extrapolation ([#1875](https://github.com/gorhom/react-native-bottom-sheet/issues/1875))(by [@cenksari](https://github.com/cenksari)) ([5af3e80](https://github.com/gorhom/react-native-bottom-sheet/commit/5af3e803b0313154f42fbadba7dae6d32719c01c))
* updated animation sequencing to respect force closing by user ([#1941](https://github.com/gorhom/react-native-bottom-sheet/issues/1941)) ([e4f3fe3](https://github.com/gorhom/react-native-bottom-sheet/commit/e4f3fe339b20a28d8573fa31f0d1b85be3ef2085))
* updated the enable content panning gesture logic ([2962a2d](https://github.com/gorhom/react-native-bottom-sheet/commit/2962a2d5326e517a48fe11d0e0d762beacca890d))
* updated the scrollable locking logic while scrolling ([#1939](https://github.com/gorhom/react-native-bottom-sheet/issues/1939)) ([d2b959c](https://github.com/gorhom/react-native-bottom-sheet/commit/d2b959c1f25f1aaeed1b30d21c43809c72490ef3))
* updated the keyboard handling for Android with keyboard input mode resize ([08db4ab](https://github.com/gorhom/react-native-bottom-sheet/commit/08db4ab4b0058955e9ee2d55f87da8fefb5390ad))
* replace getRefNativeTag with findNodeHandle ([#1823](https://github.com/gorhom/react-native-bottom-sheet/issues/1823))(by @AndreiCalazans) ([866b4ee](https://github.com/gorhom/react-native-bottom-sheet/commit/866b4ee570fc345d59053561c26af67144e8fd6f))
* **BottomSheetContainer:** cannot add new property 'value' ([#1808](https://github.com/gorhom/react-native-bottom-sheet/issues/1808))(by @MoritzCooks) ([ccd6bb5](https://github.com/gorhom/react-native-bottom-sheet/commit/ccd6bb540884f35fb9c0dcd5527ed8bac0c1be91))
* added error message when dynamic sizing enabled with a wrong children type ([8b62dca](https://github.com/gorhom/react-native-bottom-sheet/commit/8b62dca06752a3c047162a693a75173a7c701e3e))
* bottom sheet not appearing for users that have reduced motion turned on ([#1743](https://github.com/gorhom/react-native-bottom-sheet/issues/1743))(by [@fobos531](https://github.com/fobos531)) ([9b4ef4d](https://github.com/gorhom/react-native-bottom-sheet/commit/9b4ef4dabb7ce1f846ae90e2bab39fa9354ff125))
* fixed the mount animation with reduce motion enabled ([#1560](https://github.com/gorhom/react-native-bottom-sheet/issues/1560), [#1674](https://github.com/gorhom/react-native-bottom-sheet/issues/1674)) ([6efd8ae](https://github.com/gorhom/react-native-bottom-sheet/commit/6efd8aeb0e312555fa77609869eedbf46a4a04b3))
* added BottomSheetTextInput to the mock file ([#1698](https://github.com/gorhom/react-native-bottom-sheet/issues/1698))(by [@ghorbani-m](https://github.com/ghorbani-m)) ([dee95e5](https://github.com/gorhom/react-native-bottom-sheet/commit/dee95e5b161d78b0aae34d85abea3d8042417892))
* added footer height to content height when using dynamic sizing ([#1725](https://github.com/gorhom/react-native-bottom-sheet/issues/1725)) ([5009085](https://github.com/gorhom/react-native-bottom-sheet/commit/50090859f9e50932c641df5b0d6f91cc9f3b5bad))
* added missing mock of Touchables ([#1700](https://github.com/gorhom/react-native-bottom-sheet/issues/1700))(by [@jaworek](https://github.com/jaworek)) ([a6f44c0](https://github.com/gorhom/react-native-bottom-sheet/commit/a6f44c01ef8f1b9154ce2313614daf075567f641))
* added support for web without Babel/SWC ([#1741](https://github.com/gorhom/react-native-bottom-sheet/issues/1741))(by [@joshsmith](https://github.com/joshsmith)) ([d620494](https://github.com/gorhom/react-native-bottom-sheet/commit/d620494877e98f4331d8c0a1cb7d375abb06db60))
* fixed the backdrop tap gesture on web ([#1446](https://github.com/gorhom/react-native-bottom-sheet/issues/1446)) ([b0792de](https://github.com/gorhom/react-native-bottom-sheet/commit/b0792dea5ec605b449d40037cbecfd35bf0ff066))
* allowed content max height be applied for dynamic sizing ([57c196c](https://github.com/gorhom/react-native-bottom-sheet/commit/57c196cfdf2f63622fb5ea8d6d32cf21b9dd9367))
* dismiss all action for modals ([#1529](https://github.com/gorhom/react-native-bottom-sheet/issues/1529))(by [@david-gomes5](https://github.com/david-gomes5)) ([17269f1](https://github.com/gorhom/react-native-bottom-sheet/commit/17269f1f55b91f33cec24870ebe00f2510888a4b))
* fixed position x index sequencing with container resizing ([#1675](https://github.com/gorhom/react-native-bottom-sheet/issues/1675)) ([f0ec705](https://github.com/gorhom/react-native-bottom-sheet/commit/f0ec705cd74ea6e31614ab12c0b4fdc097d3820d))
* prevent updating backdrop state when unmounting ([#1657](https://github.com/gorhom/react-native-bottom-sheet/issues/1657))(by [@christophby](https://github.com/christophby)) ([d746d85](https://github.com/gorhom/react-native-bottom-sheet/commit/d746d85b92e2bdb4351ea4d3fde140e3199ac671))
* **web:** use absolute positioning for BottomSheetContainer in web ([#1597](https://github.com/gorhom/react-native-bottom-sheet/issues/1597)) ([d6e3dc9](https://github.com/gorhom/react-native-bottom-sheet/commit/d6e3dc9b327b840895c875dcf016fb5c80a62915))
* (BottomSheetTextInput): reset shouldHandleKeyboardEvents on unmount (#1495)(by @koplyarov) ([`81cd66f`](https://github.com/gorhom/react-native-bottom-sheet/commit/81cd66f9c49843e43231d1d81ec4aa518a9f1b95))
* updated containerOffset top value to default to 0 (#1420)(by @beqramo) ([`b81cb93`](https://github.com/gorhom/react-native-bottom-sheet/commit/b81cb9368b55c24703a9c000a76e89a2d253e141))
* resume close animation when container gets resized (#1374) (#1392) ([`1f69625`](https://github.com/gorhom/react-native-bottom-sheet/commit/1f69625e180fcec4d8d3dec436f8d5bb4eba476b))
* (bottom-sheet-modal): added container component prop to modal (#1309)(by @magrinj) ([`67e1e09`](https://github.com/gorhom/react-native-bottom-sheet/commit/67e1e09acbc0e96e435a0c2247fa1e0bc19f91aa))
* updated scrollables mocks with ReactNative list equivalent (#1394)(by @gkueny) ([`630f87f`](https://github.com/gorhom/react-native-bottom-sheet/commit/630f87ff6bd19c4dfc071783139c938eda3baf6c))
* crash on swipe down (#1367)(by @beqramo) ([`3ccbefc`](https://github.com/gorhom/react-native-bottom-sheet/commit/3ccbefc4d16558867d518f7e0306fbb4d1dbdbeb))
* (BottomSheetScrollView): updated scroll responders props type (#1335)(by @eps1lon) ([`e42fafc`](https://github.com/gorhom/react-native-bottom-sheet/commit/e42fafcc492d01665c296bf551a6a264eb866fc5))
* fixed keyboard dismissing issue with Reanimated v3 (#1346)(by @janicduplessis) ([`1d1a464`](https://github.com/gorhom/react-native-bottom-sheet/commit/1d1a46489bede1d3f119df2fb6f467e778461c39))
- (#1119): fixed race condition between onmount and keyboard animations ([`a1ec74d`](https://github.com/gorhom/react-native-bottom-sheet/commit/a1ec74dbbc85476bb39f3637e9a97214e0cad9a0))

#### Chores And Housekeeping

* updated expo and react native deps (#1445) ([`f6f2304`](https://github.com/gorhom/react-native-bottom-sheet/commit/f6f2304235c05f92d86ce8083caf910b9297a10a))
* updated react native and other deps (#1412) ([`549e461`](https://github.com/gorhom/react-native-bottom-sheet/commit/549e461530a91e1d7c95a5178bd2238ebf84df86))
* fixed types (#1123)(by @stropho) ([`b440964`](https://github.com/gorhom/react-native-bottom-sheet/commit/b44096451d4fed81be7f08b0edf638e4a1c42ccd))
* updated reanimated to v3 (#1324) ([`4829316`](https://github.com/gorhom/react-native-bottom-sheet/commit/4829316beeff95c9e2efa5fbfdfcf7ef37b4af60))
