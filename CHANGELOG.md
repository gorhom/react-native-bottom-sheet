

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
