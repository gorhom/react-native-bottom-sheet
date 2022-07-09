# Changelog

## [v4.4.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.4.0...v4.4.1)

## [v4.4.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.3.2...v4.4.0) - 2022-07-09

#### Features

- feat: allow scrollable events ([`#1019`](https://github.com/gorhom/react-native-bottom-sheet/pull/1019)).

#### Improvements

- chore: updated git actions ([bd0a9de](https://github.com/gorhom/react-native-bottom-sheet/commit/bd0a9de4af48b7babbf524a1b6fc1e799441b207)).
- chore: export internal hooks ([603ac94](https://github.com/gorhom/react-native-bottom-sheet/commit/603ac9420a6958a9dfc54975576ed19f306a89e7)).

## [v4.3.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.3.1...v4.3.2) - 2022-06-13

## [v4.3.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.3.0...v4.3.1) - 2022-05-24

#### Improvements

- chore: added Expo example  ([`#958`](https://github.com/gorhom/react-native-bottom-sheet/pull/958)).
- refactor: allow passing style to the container ([5e1ed9d](https://github.com/gorhom/react-native-bottom-sheet/commit/5e1ed9da98913d47b27912f49cf7e12b2393176e)).
- chore: fixed dynamic snap point example text color ([321de77](https://github.com/gorhom/react-native-bottom-sheet/commit/321de777cb848c85a85ac6107ddc26bef1845566)).

#### Fixes

- fix: removed flex style from draggable view ([29152fb](https://github.com/gorhom/react-native-bottom-sheet/commit/29152fb65672a07ff91249a882f0fc0f3d9b796c)).
- fix: added a fixed position for the container on web ([ce5115a](https://github.com/gorhom/react-native-bottom-sheet/commit/ce5115a2abd2ddc7140eb3037274b2c5bb3ff10a)).

## [v4.3.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.2.2...v4.3.0) - 2022-05-14

#### Features

- feat: added data to present modal api ([`#942`](https://github.com/gorhom/react-native-bottom-sheet/pull/942)).

#### Improvements

- refactor: expose animateOnMount for modals ([`#943`](https://github.com/gorhom/react-native-bottom-sheet/pull/943)).
- refactor: added jest mock file ([`#941`](https://github.com/gorhom/react-native-bottom-sheet/pull/941)).

## [v4.2.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.2.1...v4.2.2) - 2022-05-02

#### Fixes

- fix: allowed keyboard height to be recalculated when it changes ([`#931`](https://github.com/gorhom/react-native-bottom-sheet/pull/931)).

## [v4.2.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.2.0...v4.2.1) - 2022-04-24

#### Fixes

- fix: updated footer container export name ([a887141](https://github.com/gorhom/react-native-bottom-sheet/commit/a88714153a780395337b84efe00e3d410702c1d9)).

## [v4.2.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.6...v4.2.0) - 2022-04-24

#### Features

- feat: allow unsafe usage for useBottomSheetInternal & useBottomSheetModalInternal (#740)(by @jembach)

* feat: add useBottomSheetInternal_unsafe & useBottomSheetModalInternal_unsafe to access context

* chore: export hooks useBottomSheetInternal_unsafe and useBottomSheetModalInternal_unsafe

* refactor: combined unsafe hooks with default hooks using an argument

* chore(useBottomSheetInternal): use function overloading instead of interface

* chore(useBottomSheetModalInternal): use function overloading instead of interface

* chore: fixed spacing

Co-authored-by: gorhom &lt;gorhom.dev@gmail.com&gt; ([1bf6139](https://github.com/gorhom/react-native-bottom-sheet/commit/1bf613997cb7a7c8d1fd14f8253701e511a145c7)).

#### Improvements

- chore: fixed types import from reanimated ([831df9c](https://github.com/gorhom/react-native-bottom-sheet/commit/831df9c9e8f25ead974251efcdc384fa1ca00c2e)).
- chore: fixed types import ([95cb80d](https://github.com/gorhom/react-native-bottom-sheet/commit/95cb80d3331efb12a1b22b904ebdc0155ebcd833)).
- chore: exported useBottomSheetModalInternal hook ([31eb738](https://github.com/gorhom/react-native-bottom-sheet/commit/31eb73859b46ca325d8960baff9a9ddccb1b89fe)).

## [v4.1.6](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.5...v4.1.6) - 2022-04-23

#### Improvements

- chore: updated react native to 0.68 ([b4614bd](https://github.com/gorhom/react-native-bottom-sheet/commit/b4614bdd70a82dc31d9ef148a47533682b67a802)).
- chore: updated reanimated to 2.8 ([c1e6847](https://github.com/gorhom/react-native-bottom-sheet/commit/c1e6847048c43fb2b678bedfd94ae57502df9765)).
- chore: added native screens example ([1cf46c0](https://github.com/gorhom/react-native-bottom-sheet/commit/1cf46c08c5561c0320c57e1006b24b70c690a34f)).
- chore: updated react native portal library ([955b774](https://github.com/gorhom/react-native-bottom-sheet/commit/955b7748932ba5ea81d2406c0acf7b612fecbf0e)).
- chore: updated portal to 1.0.12 ([0010008](https://github.com/gorhom/react-native-bottom-sheet/commit/0010008906154f9a545f89d5826ea7af48336610)).
- chore: replaced blacklist with exclusionList (#649)(by @aleppos) ([e3881b3](https://github.com/gorhom/react-native-bottom-sheet/commit/e3881b3149c522102b93c5d2ed2a23003ece4ca2)).
- chore: export BottomSheetFooterContainer component ([4f63b0d](https://github.com/gorhom/react-native-bottom-sheet/commit/4f63b0d0609160790b420d88478859b91fb8424d)).

#### Fixes

- fix: always update container height to avoid races. (#919)(by @elan)

Updating a shared values is an asynchronous operation, so if two layouts happen in quick succession, we can miss an update. ([3245b23](https://github.com/gorhom/react-native-bottom-sheet/commit/3245b23653a38da2057f28d02f6d2bf1168864d0)).
- fix: always update handle height to avoid races.(related #919) ([dbf8945](https://github.com/gorhom/react-native-bottom-sheet/commit/dbf894591db8c72c4a0a4a5f1c2986f07ed4b1fb)).

#### Documentations

- docs: updated the readme file ([d951b17](https://github.com/gorhom/react-native-bottom-sheet/commit/d951b17957eb5d2f7f1b40a628ba6d5edd4b5a99)).

## [v4.1.5](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.4...v4.1.5) - 2021-12-05

#### Fixes

- fix: resume animation on interruption ([`#769`](https://github.com/gorhom/react-native-bottom-sheet/pull/769)).

## [v4.1.4](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.3...v4.1.4) - 2021-11-21

#### Improvements

- chore: updated example dependencies ([9176e35](https://github.com/gorhom/react-native-bottom-sheet/commit/9176e35dec148a8d3eff8b472ccb495b4992d8e1)).
- refactor: updated modal ref calls to use optional chaining (#725)(by @jcgertig)

* Use optional chaining to make sure that the ref exisist

* Make sure ref exists with optional chaining ([9ace1c6](https://github.com/gorhom/react-native-bottom-sheet/commit/9ace1c69f1153af8b598724f184672e3f6a807a5)).

#### Fixes

- fix: prevent hiding bottom sheet container on platforms other than Android (#719) ([3da1a2e](https://github.com/gorhom/react-native-bottom-sheet/commit/3da1a2e6f33fb886e53606d4bbcd06938d839008)).

#### Documentations

- docs: updated readme ([d951a19](https://github.com/gorhom/react-native-bottom-sheet/commit/d951a1976f5fd2e7a38bedbabb452a103b9644ea)).

## [v4.1.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.2...v4.1.3) - 2021-10-18

#### Improvements

- chore: updated @gorhom/portal dependency ([e777487](https://github.com/gorhom/react-native-bottom-sheet/commit/e77748712772f2da66ea27ddd655fc5b7d75ab02)).
- refactor: updated modal ref calls to use optional chaining (#699)(by @jcgertig) ([ea19e3f](https://github.com/gorhom/react-native-bottom-sheet/commit/ea19e3fa17953854c769ef6d2033d14bcd5a747e)).
- chore: updated sponsor link ([2b624cc](https://github.com/gorhom/react-native-bottom-sheet/commit/2b624ccfb8d5cb6c03337052e86d4d0d8ab960fa)).
- chore: updated contact list scroll indicator style to black ([9cc8b17](https://github.com/gorhom/react-native-bottom-sheet/commit/9cc8b172298fa38c2a5597d3ed77361fd496db25)).

#### Fixes

- fix: prevent unstable mounting for modals (#697) ([657505a](https://github.com/gorhom/react-native-bottom-sheet/commit/657505a65b01a1ccd7e2027b12fe1953967aa875)).

#### Documentations

- docs: updated logo ([7c176e0](https://github.com/gorhom/react-native-bottom-sheet/commit/7c176e08eca0be638b283712c643f0ef281134ae)).

## [v4.1.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.1...v4.1.2) - 2021-10-12

#### Fixes

- fix: hide the bottom sheet on closed ([`#690`](https://github.com/gorhom/react-native-bottom-sheet/pull/690)).

## [v4.1.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.0...v4.1.1) - 2021-10-03

#### Improvements

- refactor: allow to render component inside default backdrop ([`#662`](https://github.com/gorhom/react-native-bottom-sheet/pull/662)).
- refactor: calling dismiss without a key will remove the current modal if any (#676)(by @Shywim) ([fd4bb8d](https://github.com/gorhom/react-native-bottom-sheet/commit/fd4bb8df8b4dae879326438697a85c0c9d2ddb24)).

## [v4.1.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.3...v4.1.0) - 2021-09-26

#### Features

- feat: added handling for keyboard height change (#656)(by @Ferossgp)

* React on keyboard height change

* Handle null previous state android ([3c5fc57](https://github.com/gorhom/react-native-bottom-sheet/commit/3c5fc571e6442bd56712e9f4dbba89bbcd93dda1)).

#### Improvements

- chore: updated @gorhom/portal dependency ([366e46b](https://github.com/gorhom/react-native-bottom-sheet/commit/366e46bc44eb63f8e6bf99d225612c9659b4a72a)).

#### Fixes

- fix: updated initial position to screen height ([`#657`](https://github.com/gorhom/react-native-bottom-sheet/pull/657)).
- fix: remove 'removeListener' as it is now deprecated (#635)(by @brianathere) ([f03b05b](https://github.com/gorhom/react-native-bottom-sheet/commit/f03b05bbc39bf62f7d97422e717f2998f2e1fada)).
- fix: revert changes on BottomSheetModal that blocked stack behavour ([15225ae](https://github.com/gorhom/react-native-bottom-sheet/commit/15225aef40fb5cb789fb077505edb5d710ab9e91)).
- fix: updated asigning velocity in animate worklet (#650) ([38b635e](https://github.com/gorhom/react-native-bottom-sheet/commit/38b635ec03d749cc0b7258ae2972ece722e0bb4a)).

#### Documentations

- docs: fix overDragResistanceFactor description ([`#633`](https://github.com/gorhom/react-native-bottom-sheet/pull/633)).

## [v4.0.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.2...v4.0.3) - 2021-09-02

#### Fixes

- fix: allow content to be accessible #619 ([f1baf0e](https://github.com/gorhom/react-native-bottom-sheet/commit/f1baf0e4748fd84110d905f82404a86fd697c936)).

## [v4.0.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.1...v4.0.2) - 2021-08-31

#### Fixes

- fix: updated types for styles ([`#616`](https://github.com/gorhom/react-native-bottom-sheet/pull/616)).

## [v4.0.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0...v4.0.1) - 2021-08-30

#### Fixes

- fix: pass correct params to animateToPosition ([`#610`](https://github.com/gorhom/react-native-bottom-sheet/pull/610)).

#### Documentations

- docs: add kickbk as a contributor for bug, test ([`#612`](https://github.com/gorhom/react-native-bottom-sheet/pull/612)).
- docs: add vonovak as a contributor for code ([`#611`](https://github.com/gorhom/react-native-bottom-sheet/pull/611)).

## [v4.0.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.30...v4.0.0) - 2021-08-30

#### Improvements

- chore: updated close method type ([ca3a11a](https://github.com/gorhom/react-native-bottom-sheet/commit/ca3a11a3f56f3ba3bcd865ce1006490f3819f054)).

#### Documentations

- docs: added auto-deployment for documentation website ([3b14281](https://github.com/gorhom/react-native-bottom-sheet/commit/3b1428199f49339d5aa8a607cd0f496907fcb2e5)).
- docs: updated readme file ([84fdcf6](https://github.com/gorhom/react-native-bottom-sheet/commit/84fdcf6db98a5c58ee0b8cfa821bd8031c710df0)).

## [v4.0.0-alpha.30](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.29...v4.0.0-alpha.30) - 2021-08-22

#### Improvements

- refactor: added forceClose and remove force param from close method ([3dd5796](https://github.com/gorhom/react-native-bottom-sheet/commit/3dd5796eb722e4e579de7b2439d224a5e0238b55)).
- refactor: clean up animation configs variables #572 ([8e002e1](https://github.com/gorhom/react-native-bottom-sheet/commit/8e002e1c20c019951bbf444fceacefc0cf0e86c2)).
- chore: delete debug view from builds ([7ead04e](https://github.com/gorhom/react-native-bottom-sheet/commit/7ead04edc1a77cf820adcdadecc912b7791ab14c)).

#### Fixes

- fix: prevent the sheet from snapping while layout being calculated ([445a964](https://github.com/gorhom/react-native-bottom-sheet/commit/445a9645366af04931f4464d1befb1bc8e1dbbed)).

## [v4.0.0-alpha.29](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.28...v4.0.0-alpha.29) - 2021-08-18

#### Features

- feat: added backgroundStyle, handleStyle & handleIndicatorStyle to bottom sheet ([2211765](https://github.com/gorhom/react-native-bottom-sheet/commit/221176546fd59ed0c9d79fe7f0350eda24dd8550)).

#### Fixes

- fix: prevent keyboard change to snap sheet while user is interacting ([dd632b0](https://github.com/gorhom/react-native-bottom-sheet/commit/dd632b04651d37ab6a8a2aba2be13d9633e677e4)).

## [v4.0.0-alpha.28](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.27...v4.0.0-alpha.28) - 2021-08-17

#### Improvements

- chore: updated github workflow and templates ([db68fac](https://github.com/gorhom/react-native-bottom-sheet/commit/db68fac9eb4ac117e7c89dd74352391a77f0a3ec)).
- chore: updated auto-close action version ([991d214](https://github.com/gorhom/react-native-bottom-sheet/commit/991d2141a4f026068737abc098f9b0d2b6968a5f)).

#### Fixes

- fix: provide dynamic initial snap points while layout is calculating  ([`#584`](https://github.com/gorhom/react-native-bottom-sheet/pull/584)).
- fix: prevent snap points lower than 0 ([95ea72a](https://github.com/gorhom/react-native-bottom-sheet/commit/95ea72a459f96d40ad583c5579cc72f0e128e5dd)).

## [v4.0.0-alpha.27](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.26...v4.0.0-alpha.27) - 2021-08-15

#### Improvements

- refactor: rename Touchables.android to Touchables, to allow web usage ([a95e34f](https://github.com/gorhom/react-native-bottom-sheet/commit/a95e34fc2d0af0aaecf514ebbd0e8dee9df55fb0)).

## [v4.0.0-alpha.26](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.25...v4.0.0-alpha.26) - 2021-08-15

#### Features

- feat: added onClose callback to BottomSheet ([ee64545](https://github.com/gorhom/react-native-bottom-sheet/commit/ee64545ce0e7609fb383f1473773c8481a0bc7aa)).

#### Improvements

- chore: updated package dependencies ([e11dc84](https://github.com/gorhom/react-native-bottom-sheet/commit/e11dc844a7cdcba694a01d4cbeb37f1709e23dea)).
- refactor: updated footer api ([2cf7289](https://github.com/gorhom/react-native-bottom-sheet/commit/2cf72890abd92b7e9be25d7013744fe503107a1a)).
- chore: renamed the branch to master ([a0bb98a](https://github.com/gorhom/react-native-bottom-sheet/commit/a0bb98a77686687e643514d131b74f421b5d4aee)).

#### Fixes

- fix: updated animated closed position value on detached ([833879f](https://github.com/gorhom/react-native-bottom-sheet/commit/833879f3f703b80fb5bc591a823d86f3c56cc7ee)).

#### Documentations

- docs: added code of conduct file ([18a32e5](https://github.com/gorhom/react-native-bottom-sheet/commit/18a32e5979d22a693734d1af7fef6cc9887cea67)).

## [v4.0.0-alpha.25](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.24...v4.0.0-alpha.25) - 2021-08-06

#### Fixes

- fix: fixed the multiline issue on BottomSheetTextInput #411 ([e21d676](https://github.com/gorhom/react-native-bottom-sheet/commit/e21d6762a929c6eaaf64e95d8af2934cc8b3a703)).

## [v4.0.0-alpha.24](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.23...v4.0.0-alpha.24) - 2021-08-05

#### Fixes

- fix: prevent animatedIndex from flickering caused by content resizing ([7fef5d0](https://github.com/gorhom/react-native-bottom-sheet/commit/7fef5d03c0edef5945dc0bd825ce9081b90e7402)).

## [v4.0.0-alpha.23](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.22...v4.0.0-alpha.23) - 2021-08-05

#### Features

- feat: allow custom pan gesture and scroll handler customisation  (#525) (by @vonovak)

* feat: allow custom gesture handling

* chore: self-review

* chore: remove usememos

* feat: add scrollEventListenersHook param

* refactor: rename props for hooks

* chore: rebase on alpha21

* refactor: rename hooks (review points 4, 5)

* refactor: introduce useHandleSettingScrollable (review point 6)

* fix: do not get stuck in transition

* refactor: added gesture handler internal context

* refactor: renamed example to CustomGestureHandling

* refactor: updated new props types

* refactor: allow to override scrollable state

* fix: scrolling momentum not right when scrolling from top

* Revert "fix: scrolling momentum not right when scrolling from top"

This reverts commit c23910c70fa8beb395dd6c7c15487bf0950bdea1.

* chore: extract duplicated segment into const

* feat: allow overriding animatedProps

* refactor: make ref handling more explicit

* refactor: make scrollEventThrottle prop non-overridable

* chore: updated custom gesture example

* fix: updated animateToPosition params order

* chore: updated new props description

Co-authored-by: Mo Gorhom &lt;gorhom@me.com&gt; ([4c32da7](https://github.com/gorhom/react-native-bottom-sheet/commit/4c32da7c0bb7e902883f009f10909286ad65042c)).

#### Improvements

- chore: remove unnecessary useMemos ([`#515`](https://github.com/gorhom/react-native-bottom-sheet/pull/515)).
- chore: removed enableFlashScrollableIndicatorOnExpand prop ([e447da4](https://github.com/gorhom/react-native-bottom-sheet/commit/e447da49a79f09456603cf57b5839c42f390f9b5)).
- refactor: updated animateOnMount default value to true ([6293fe4](https://github.com/gorhom/react-native-bottom-sheet/commit/6293fe452f54c3f5d2ac332642b4c369bc768c92)).

#### Fixes

- fix: allow user to override showsVerticalScrollIndicator value on scrollables ([11cdc34](https://github.com/gorhom/react-native-bottom-sheet/commit/11cdc344e029200435280389b291441c1c363e97)).

## [v4.0.0-alpha.22](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.21...v4.0.0-alpha.22) - 2021-07-20

#### Improvements

- refactor: allow closing animation to be interrupted ([937f9ee](https://github.com/gorhom/react-native-bottom-sheet/commit/937f9ee91c485759c492b9dec532914ffa40375b)).

## [v4.0.0-alpha.21](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.20...v4.0.0-alpha.21) - 2021-07-18

#### Features

- feat: react to index prop changes ([55af54b](https://github.com/gorhom/react-native-bottom-sheet/commit/55af54bd772ff312f91891d7c88f33afa02f1efe)).

#### Fixes

- fix: updated detached bottom sheet handling ([603f492](https://github.com/gorhom/react-native-bottom-sheet/commit/603f49294e572716d7eaf517a2adde01681c56c6)).

## [v4.0.0-alpha.20](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.19...v4.0.0-alpha.20) - 2021-07-13

#### Improvements

- refactor: removed none from keyboard behavior and set interactive as default ([26d3b71](https://github.com/gorhom/react-native-bottom-sheet/commit/26d3b7187cb309ce77dd55c32d44a63316776515)).

#### Fixes

- fix: prevent stuck state when animation is interrupted ([01e1e87](https://github.com/gorhom/react-native-bottom-sheet/commit/01e1e8716477aa904bedbda2aa08642f8a0c3c9c)).

## [v4.0.0-alpha.19](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.18...v4.0.0-alpha.19) - 2021-07-04

#### Fixes

- fix: stablise animated index when reacting to keyboard status ([26132c1](https://github.com/gorhom/react-native-bottom-sheet/commit/26132c14871af82eda7adf63ea98ab7a9f7d95e3)).

## [v4.0.0-alpha.18](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.17...v4.0.0-alpha.18) - 2021-07-01

#### Fixes

- fix: fixed handling dynamic snap point on mount snapping ([35b2fcb](https://github.com/gorhom/react-native-bottom-sheet/commit/35b2fcb7d4eb1a2b953280a56396459b43b8767e)).

## [v4.0.0-alpha.17](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.16...v4.0.0-alpha.17) - 2021-06-29

#### Fixes

- fix: updated android keyboard handling ([f53306d](https://github.com/gorhom/react-native-bottom-sheet/commit/f53306d8d214d7dc605eb5ecb343f08f011c3ae2)).

## [v4.0.0-alpha.16](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.15...v4.0.0-alpha.16) - 2021-06-27

#### Features

- feat: allow view scrollble to over-drag sheet ([2c2ca4e](https://github.com/gorhom/react-native-bottom-sheet/commit/2c2ca4ec17587689c2e38fcb0aad87a172251b55)).

#### Fixes

- fix: updated keyboard handling for Android ([2d74ab0](https://github.com/gorhom/react-native-bottom-sheet/commit/2d74ab069357f0ba430ff9f059dad0c6305eef48)).

## [v4.0.0-alpha.15](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.14...v4.0.0-alpha.15) - 2021-06-26

## [v4.0.0-alpha.14](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.13...v4.0.0-alpha.14) - 2021-06-26

#### Fixes

- fix: refactored snap points reaction to handle keyboard state ([`#497`](https://github.com/gorhom/react-native-bottom-sheet/pull/497)).

## [v4.0.0-alpha.13](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.12...v4.0.0-alpha.13) - 2021-06-15

#### Fixes

- fix: prevent animation to same position ([9636f84](https://github.com/gorhom/react-native-bottom-sheet/commit/9636f847d53ff99d801753254876722050cc3e13)).

## [v4.0.0-alpha.12](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.11...v4.0.0-alpha.12) - 2021-06-12

#### Features

- feat: added detached bottom sheet  ([`#487`](https://github.com/gorhom/react-native-bottom-sheet/pull/487)).

#### Improvements

- chore: updated portal dependency ([70d72ec](https://github.com/gorhom/react-native-bottom-sheet/commit/70d72ecff5c78c397dbfc47bbff94b52237efab8)).

#### Documentations

- docs: updated detached prop description ([9d4779b](https://github.com/gorhom/react-native-bottom-sheet/commit/9d4779b57f60bba7f895f7609e759e0eb0b2640a)).

## [v4.0.0-alpha.11](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.10...v4.0.0-alpha.11) - 2021-06-06

## [v4.0.0-alpha.10](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.9...v4.0.0-alpha.10) - 2021-06-06

#### Features

- feat: added pull to refresh implementaion ([016a01f](https://github.com/gorhom/react-native-bottom-sheet/commit/016a01f3705c83c9903a3e28c875e7b90424a128)).
- feat: introduced more stable handling for dynamic snap points ([3edb2d1](https://github.com/gorhom/react-native-bottom-sheet/commit/3edb2d1f9a9a8b1ba2e04803cd12306e4353199b)).

#### Fixes

- fix: dismiss keyboard when sheet position change on Android ([8f34990](https://github.com/gorhom/react-native-bottom-sheet/commit/8f34990436f8cc8c1ec1c545488d77db5845166c)).

## [v4.0.0-alpha.9](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.8...v4.0.0-alpha.9) - 2021-06-03

#### Features

- feat: added keyboard input mode for android ([069c4b6](https://github.com/gorhom/react-native-bottom-sheet/commit/069c4b6742630dc5fa7d4763a5c4dc6bfec439cc)).

#### Improvements

- chore: export useBottomSheetInternal, added animatedPosition and animatedIndex to useBottomSheet ([fb3df59](https://github.com/gorhom/react-native-bottom-sheet/commit/fb3df595c0bf5bcc63ca29e8e2609929de63e595)).

## [v4.0.0-alpha.8](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.7...v4.0.0-alpha.8) - 2021-06-02

#### Improvements

- chore: minor refactor ([`#473`](https://github.com/gorhom/react-native-bottom-sheet/pull/473)).
- chore: minor simplifications ([`#467`](https://github.com/gorhom/react-native-bottom-sheet/pull/467)).

#### Fixes

- fix: updated typings for sectionlist to mirror rn core types ([`#475`](https://github.com/gorhom/react-native-bottom-sheet/pull/475)).
- fix: prevent animated content height value from getting below zero ([d9b417f](https://github.com/gorhom/react-native-bottom-sheet/commit/d9b417f703ceb69a959b0ce59600e53d75560d1e)).
- fix: updated BottomSheetContainer measuring on android ([d0e5227](https://github.com/gorhom/react-native-bottom-sheet/commit/d0e52270076617242010b08f73fe09ab8ede69d1)).

## [v4.0.0-alpha.7](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.6...v4.0.0-alpha.7) - 2021-05-30

#### Features

- feat: allow handle to drag sheet without effecting the scrollable ([580b763](https://github.com/gorhom/react-native-bottom-sheet/commit/580b7632e656403b0797c4e969a35d30f0ec5cb3)).

## [v4.0.0-alpha.6](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.5...v4.0.0-alpha.6) - 2021-05-28

#### Fixes

- fix: scrollble container style crash ([a4b9b93](https://github.com/gorhom/react-native-bottom-sheet/commit/a4b9b933268a670fbf6dd1198de61d899abde738)).

## [v4.0.0-alpha.5](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.4...v4.0.0-alpha.5) - 2021-05-27

#### Features

- feat: added pre-integrated VirtualizedList component ([2d4d69d](https://github.com/gorhom/react-native-bottom-sheet/commit/2d4d69d8881a3cbe452f5e46157e2b9702528206)).

#### Fixes

- fix: updated keyboard height in container calculation ([2599f6c](https://github.com/gorhom/react-native-bottom-sheet/commit/2599f6cf46af0f95812e34670de5a7cae5d44fd9)).
- fix: re-snap to current position when snap points get updated ([bb8e202](https://github.com/gorhom/react-native-bottom-sheet/commit/bb8e202af05dc6beeb108cfa1680401374ac58ad)).
- fix: handle initial closed sheet ([4bc40d9](https://github.com/gorhom/react-native-bottom-sheet/commit/4bc40d93da05dcff664ce939a9944416b9e91359)).

## [v4.0.0-alpha.4](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.3...v4.0.0-alpha.4) - 2021-05-25

#### Features

- feat: added footer component ([`#457`](https://github.com/gorhom/react-native-bottom-sheet/pull/457)).

## [v4.0.0-alpha.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.2...v4.0.0-alpha.3) - 2021-05-23

#### Improvements

- refactor: removed deprecated props ([`#452`](https://github.com/gorhom/react-native-bottom-sheet/pull/452)).

#### Fixes

- fix: on mount flicker on fixed sheet ([48c4988](https://github.com/gorhom/react-native-bottom-sheet/commit/48c49888b95dc88abf320d4d7590f43806e0bd59)).
- fix: prevented animatedSnapPoints reaction from running randomly ([bf4e461](https://github.com/gorhom/react-native-bottom-sheet/commit/bf4e461e2cb9b5cb90a7de105637fc43d3947525)).

## [v4.0.0-alpha.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.1...v4.0.0-alpha.2) - 2021-05-23

#### Improvements

- refactor: updated handling animated heights ([`#451`](https://github.com/gorhom/react-native-bottom-sheet/pull/451)).

## [v4.0.0-alpha.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.0...v4.0.0-alpha.1) - 2021-05-16

#### Features

- feat: added snap to position ([`#443`](https://github.com/gorhom/react-native-bottom-sheet/pull/443)).

## [v4.0.0-alpha.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.6.6...v4.0.0-alpha.0) - 2021-05-16

#### Features

- feat: added enable pan down to close ([`#437`](https://github.com/gorhom/react-native-bottom-sheet/pull/437)).

#### Improvements

- refactor: create one generic scrollable component ([`#442`](https://github.com/gorhom/react-native-bottom-sheet/pull/442)).
- refactor: converted all internal state/memoized variables to reanimated shared values. ([`#430`](https://github.com/gorhom/react-native-bottom-sheet/pull/430)).
- chore: updated dependencies ([7d2a947](https://github.com/gorhom/react-native-bottom-sheet/commit/7d2a9473a95c3e245e90932715406b62e81e6a63)).
- chore: patch react-native-gesture-handler for android ([26a0d64](https://github.com/gorhom/react-native-bottom-sheet/commit/26a0d64a062a441b2f96b3f04c48a039cee6684a)).

#### Fixes

- fix: sheet positioning on modals ([ee573e9](https://github.com/gorhom/react-native-bottom-sheet/commit/ee573e9463836301d9736c3e5d86b2b363f9fb14)).
- fix: prevent animatedPosition from becoming undefined ([400d7b9](https://github.com/gorhom/react-native-bottom-sheet/commit/400d7b93caa0a46f678db2978e7e5f95cc87ee99)).
