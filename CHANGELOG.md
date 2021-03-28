# Changelog

## [v3.6.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.5.1...v3.6.0)

#### Features

- feat: added keyboard handling ([`#334`](https://github.com/gorhom/react-native-bottom-sheet/pull/334)).

## [v3.5.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.5.0...v3.5.1) - 2021-03-27

#### Fixes

- fix: crash when last snap point get removed ([31311f9](https://github.com/gorhom/react-native-bottom-sheet/commit/31311f920edf4b69ddecef20ece8d7943826e68b)).

## [v3.5.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.4.1...v3.5.0) - 2021-03-27

#### Features

- feat: support new prop for BottomSheetBackdrop, "pressBehavior" ([`#361`](https://github.com/gorhom/react-native-bottom-sheet/pull/361)).

#### Improvements

- chore: updated example theming ([`#369`](https://github.com/gorhom/react-native-bottom-sheet/pull/369)).

#### Fixes

- fix: animateToPoint callback dependencies ([468f920](https://github.com/gorhom/react-native-bottom-sheet/commit/468f9204d30fc327e5e6a3e1c43976a0afe13e51)).

## [v3.4.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.4.0...v3.4.1) - 2021-03-15

#### Improvements

- chore: updated react-native to 64 and enable builds on M1 chip ([`#345`](https://github.com/gorhom/react-native-bottom-sheet/pull/345)).

#### Fixes

- fix: improve modal dismissing ([`#346`](https://github.com/gorhom/react-native-bottom-sheet/pull/346)).

## [v3.4.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.3.3...v3.4.0) - 2021-03-07

#### Features

- feat: allow modify animation configs ([`#333`](https://github.com/gorhom/react-native-bottom-sheet/pull/333)).

## [v3.3.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.3.2...v3.3.3) - 2021-03-04

#### Improvements

- chore: updated reanimated to v2 stable ([35d172c](https://github.com/gorhom/react-native-bottom-sheet/commit/35d172c10bf82f9038ddacf500b67d52caf19dfe)).
- chore: updated map example ([8bb7ca9](https://github.com/gorhom/react-native-bottom-sheet/commit/8bb7ca9592e92b14fcb523b9d0cb74b3725b9c70)).

#### Fixes

- fix: bottom sheet container layout measuring ([1c348bf](https://github.com/gorhom/react-native-bottom-sheet/commit/1c348bf68fe7a72c5d6c0cc9e73d6541d9f3a869)).

## [v3.3.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.3.1...v3.3.2) - 2021-03-04

#### Improvements

- chore: update dependencies ([e204d97](https://github.com/gorhom/react-native-bottom-sheet/commit/e204d97fd64416600c3bdb56774ed8cc2118a2fa)).
- chore: export bottom sheet props type ([849e9f4](https://github.com/gorhom/react-native-bottom-sheet/commit/849e9f45ea4cdf3215477bc938d33f4c8f773b65)).
- refactor: added display name for components ([36a76f6](https://github.com/gorhom/react-native-bottom-sheet/commit/36a76f6473248c6e68ba69e7d9d125a519542132)).

#### Fixes

- fix: unmounting modals with navigation ([`#315`](https://github.com/gorhom/react-native-bottom-sheet/pull/315)).

## [v3.3.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.3.0...v3.3.1) - 2021-02-10

#### Improvements

- chore: added reanimated rc3 patch ([aea1bdf](https://github.com/gorhom/react-native-bottom-sheet/commit/aea1bdf348019f5579db2f47404726bf52ffbedd)).

#### Fixes

- fix: stabilise animated callback node variables ([`#256`](https://github.com/gorhom/react-native-bottom-sheet/pull/256)).

## [v3.3.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.2.1...v3.3.0) - 2021-02-08

#### Features

- feat: updated reanimated to rc3 ([`#268`](https://github.com/gorhom/react-native-bottom-sheet/pull/268)).

#### Fixes

- fix: prevent crash when resizing container height on Android ([`#253`](https://github.com/gorhom/react-native-bottom-sheet/pull/253)).
- fix: prevent default backdrop from blocking ui behind ([`#246`](https://github.com/gorhom/react-native-bottom-sheet/pull/246)).

## [v3.2.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.2.0...v3.2.1) - 2021-01-21

#### Fixes

- fix: fixed sheet visibility when handle provided null ([`#223`](https://github.com/gorhom/react-native-bottom-sheet/pull/223)).
- fix: allow backdrop style prop to override internal style ([`#211`](https://github.com/gorhom/react-native-bottom-sheet/pull/211)).

## [v3.2.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.1.1...v3.2.0) - 2021-01-16

#### Features

- feat: added style prop ([`#189`](https://github.com/gorhom/react-native-bottom-sheet/pull/189)).

#### Improvements

- chore: updated reanimated to rc2 ([`#200`](https://github.com/gorhom/react-native-bottom-sheet/pull/200)).
- chore: added no console eslint rule ([7d03829](https://github.com/gorhom/react-native-bottom-sheet/commit/7d03829574c88d5c8bdb2d5424fb5ab4a55e78c4)).

#### Fixes

- fix: removed rounding on evaluating position ([`#201`](https://github.com/gorhom/react-native-bottom-sheet/pull/201)).

## [v3.1.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.1.0...v3.1.1) - 2021-01-12

#### Fixes

- fix: fixed over-drag implementation ([`#186`](https://github.com/gorhom/react-native-bottom-sheet/pull/186)).

## [v3.1.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.0.2-alpha.3...v3.1.0) - 2021-01-09

#### Improvements

- chore: updated useInteractivePanGestureHandler ([`#174`](https://github.com/gorhom/react-native-bottom-sheet/pull/174)).

#### Fixes

- fix: exp easing flickers on android ([`#175`](https://github.com/gorhom/react-native-bottom-sheet/pull/175)).
- fix: removed rounding up from useNormalizedSnapPoints hook. ([`#169`](https://github.com/gorhom/react-native-bottom-sheet/pull/169)).

## [v3.0.2-alpha.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.0.2-alpha.2...v3.0.2-alpha.3) - 2021-01-07

#### Improvements

- refactor: remove getNode from scrollables ([`#166`](https://github.com/gorhom/react-native-bottom-sheet/pull/166)).
- refactor: handle & background layers ([`#165`](https://github.com/gorhom/react-native-bottom-sheet/pull/165)).
- refactor: removed ContentWrapper from BottomSheet ([`#156`](https://github.com/gorhom/react-native-bottom-sheet/pull/156)).

#### Fixes

- fix: fixed shouldMeasureHandleHeight evaluation ([`#157`](https://github.com/gorhom/react-native-bottom-sheet/pull/157)).

## [v3.0.2-alpha.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.0.2-alpha.1...v3.0.2-alpha.2) - 2021-01-06

#### Improvements

- chore: changed the default easing function to cubic ([`#151`](https://github.com/gorhom/react-native-bottom-sheet/pull/151)).

#### Fixes

- fix: apply additional panGH props to handle's gesture handler ([`#152`](https://github.com/gorhom/react-native-bottom-sheet/pull/152)).
- fix: fixed animated reaction for animated callback nodes ([`#150`](https://github.com/gorhom/react-native-bottom-sheet/pull/150)).

## [v3.0.2-alpha.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.0.2-alpha.0...v3.0.2-alpha.1) - 2021-01-05

#### Features

- feat: added more gesture handler props ([`#148`](https://github.com/gorhom/react-native-bottom-sheet/pull/148)).
- feat: added a prop to control flashing scrollable on expand ([`#146`](https://github.com/gorhom/react-native-bottom-sheet/pull/146)).

#### Improvements

- refactor: updated overScrollMode to be come overridable ([`#145`](https://github.com/gorhom/react-native-bottom-sheet/pull/145)).

## [v3.0.2-alpha.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.0.1...v3.0.2-alpha.0) - 2021-01-03

#### Features

- feat: add third party gestures integration ([`#143`](https://github.com/gorhom/react-native-bottom-sheet/pull/143)).
- feat: added stack behavior to bottom sheet modal ([`#140`](https://github.com/gorhom/react-native-bottom-sheet/pull/140)).
- feat: added over drag support ([`#139`](https://github.com/gorhom/react-native-bottom-sheet/pull/139)).
- feat: added over scroll and bouncing support ([`#137`](https://github.com/gorhom/react-native-bottom-sheet/pull/137)).

#### Improvements

- chore: enable postinstall on example to patch react-native-tab-view ([e4db114](https://github.com/gorhom/react-native-bottom-sheet/commit/e4db114958b21b8b3d5d2965680b7aba34e9c099)).

#### Fixes

- fix: prevent scrollable glitches ([`#142`](https://github.com/gorhom/react-native-bottom-sheet/pull/142)).
- fix: remove jumping on Android while starting scrolling ([`#141`](https://github.com/gorhom/react-native-bottom-sheet/pull/141)).
- fix: fixed interaction glitch ([`#135`](https://github.com/gorhom/react-native-bottom-sheet/pull/135)).

## [v3.0.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.0.0...v3.0.1) - 2020-12-23

#### Improvements

- chore: updated map exmaple ([d26ab34](https://github.com/gorhom/react-native-bottom-sheet/commit/d26ab34235a626b367112e142597ecb456de2777)).
- chore: fixed map example on android ([4bbfff7](https://github.com/gorhom/react-native-bottom-sheet/commit/4bbfff7f42882aad9b7552b8007690a0305a8e9e)).
- chore: updated auto-changelog configs ([200b8f3](https://github.com/gorhom/react-native-bottom-sheet/commit/200b8f3a507b2169a9344806ef851a33d596a5ad)).
- chore: updated reanimated dependency ([769f9e6](https://github.com/gorhom/react-native-bottom-sheet/commit/769f9e6df61598dbac8bf538c62397f046cc5c74)).

#### Fixes

- fix: stablise `animateToPoint` worklet callback ([4e15615](https://github.com/gorhom/react-native-bottom-sheet/commit/4e1561584b27c524c39a3b8f0bd3139a2afcf58e)).

#### Documentations

- docs: updated readme file ([c8f8a7e](https://github.com/gorhom/react-native-bottom-sheet/commit/c8f8a7e0455fcf54b979d92e283911ea5ddcff3e)).

## [v3.0.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.0.0-alpha.0...v3.0.0) - 2020-12-21

#### Features

- feat: added onAnimate callback ([`#127`](https://github.com/gorhom/react-native-bottom-sheet/pull/127)).
- feat: added bottom sheet modal ([`#125`](https://github.com/gorhom/react-native-bottom-sheet/pull/125)).
- feat: add backdrop handling ([`#124`](https://github.com/gorhom/react-native-bottom-sheet/pull/124)).
- feat: allow control panning gestures ([`#123`](https://github.com/gorhom/react-native-bottom-sheet/pull/123)).
- feat: support dynamic snap points ([`#122`](https://github.com/gorhom/react-native-bottom-sheet/pull/122)).
- feat: added animateOnMount prop ([`#121`](https://github.com/gorhom/react-native-bottom-sheet/pull/121)).

#### Improvements

- chore: updated auto-changelog config ([`#128`](https://github.com/gorhom/react-native-bottom-sheet/pull/128)).
- chore: updated dependencies ([dcd1250](https://github.com/gorhom/react-native-bottom-sheet/commit/dcd12500eafbd267c8a11b474a0b87393e24fad8)).

#### Fixes

- fix: updated default backdrop handling ([`#126`](https://github.com/gorhom/react-native-bottom-sheet/pull/126)).

#### Documentations

- docs: deleted old documentaion files ([1ff89c9](https://github.com/gorhom/react-native-bottom-sheet/commit/1ff89c967048860cbc841615033504f28f4c54e2)).
- docs: updated root readme file ([d15bb61](https://github.com/gorhom/react-native-bottom-sheet/commit/d15bb6134f3c8c048b4af2fe63ea56606e5b3762)).
- docs: updated readme file ([befae85](https://github.com/gorhom/react-native-bottom-sheet/commit/befae85647b1f7ad4a2bbbf046b8d0598f1c75c0)).
- docs: updated readme file ([5d42f33](https://github.com/gorhom/react-native-bottom-sheet/commit/5d42f3356146beac6410941c8fb9eb8dba736a14)).

## [v3.0.0-alpha.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v2.3.0...v3.0.0-alpha.0) - 2020-11-27

#### Improvements

- chore: install and configure lint-staged ([`#80`](https://github.com/gorhom/react-native-bottom-sheet/pull/80)).
- chore: updated reanimated to v2 alpha9 ([`#69`](https://github.com/gorhom/react-native-bottom-sheet/pull/69)).
- chore: added close state into animated position ([`#39`](https://github.com/gorhom/react-native-bottom-sheet/pull/39)).
- refactor: rewrite code base to use reanimated v2 ([6f36e9c](https://github.com/gorhom/react-native-bottom-sheet/commit/6f36e9ceb117d2582ab6158399a1e83277adbdd4)).
- chore: updated react-native to 63.2 ([0f09886](https://github.com/gorhom/react-native-bottom-sheet/commit/0f0988657fab75cb05cb69485e2357b433c47488)).
- chore: updated reanimated to 2 alpha 6 ([a4b385c](https://github.com/gorhom/react-native-bottom-sheet/commit/a4b385c38269a1c7b5eda37fa2a73d197aedca48)).
- chore: integrate Reanimated v2 in example project ([ab83595](https://github.com/gorhom/react-native-bottom-sheet/commit/ab835953aa0198d04aa35e2ca5880451a6b6d9f7)).
- chore: updated examples ([fa6fbda](https://github.com/gorhom/react-native-bottom-sheet/commit/fa6fbda374b2499145122ab65f29e8cd1a6d4805)).
- chore: updated dependencies ([4af6851](https://github.com/gorhom/react-native-bottom-sheet/commit/4af6851c3dd703629818e93446598a8278055021)).
- chore: comment out flipper ([33392a3](https://github.com/gorhom/react-native-bottom-sheet/commit/33392a35c2fca9e2e32b2f0c12bbc9cdc783191d)).
- chore: updated reanimated to v2.rc0 ([f44c6eb](https://github.com/gorhom/react-native-bottom-sheet/commit/f44c6ebd8d5271fdeb15f3640c773cf08019e95c)).
- chore: updated pref component ([300a8b0](https://github.com/gorhom/react-native-bottom-sheet/commit/300a8b0c331c0a21ca39a9aabcc6306b496984e2)).
- chore: updated redash ([c71c2d2](https://github.com/gorhom/react-native-bottom-sheet/commit/c71c2d225ea33930423089a8baac359cae70856d)).
- chore: added renimated babel plugin ([5a594ad](https://github.com/gorhom/react-native-bottom-sheet/commit/5a594ad54624b0bdb48f4d7c5f235d99a29b091f)).
- refactor: update childern type & fix animation state import ([7dc12a6](https://github.com/gorhom/react-native-bottom-sheet/commit/7dc12a6bc796ad46887e61c87f73c71f389bc569)).
- chore: remove unused debugs logs on example ([4de6c8d](https://github.com/gorhom/react-native-bottom-sheet/commit/4de6c8d892461bf7fbe35853a30ffb1170eccd96)).
- chore: re-enabled flipper for android ([16fbb5c](https://github.com/gorhom/react-native-bottom-sheet/commit/16fbb5c8514a55492879515f87f53af930c54fa7)).

#### Fixes

- fix: return flipper back to make example working ([`#70`](https://github.com/gorhom/react-native-bottom-sheet/pull/70)).
- fix: fixed native projects to allow release builds ([516db83](https://github.com/gorhom/react-native-bottom-sheet/commit/516db837ab7ee3626905785d1210f8c23e42d4ce)).

#### Documentations

- docs: updated documents ([9b1e927](https://github.com/gorhom/react-native-bottom-sheet/commit/9b1e927bc32979cf305ebb903656869507b9d0dd)).
