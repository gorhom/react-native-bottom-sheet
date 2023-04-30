## Changelog

### [v5.0.0-alpha.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v5.0.0-alpha.0...v5.0.0-alpha.1) - 

#### Fixes

- (BottomSheetScrollView): updated scroll responders props type (#1335)(by @eps1lon) ([`e42fafc`](https://github.com/gorhom/react-native-bottom-sheet/commit/e42fafcc492d01665c296bf551a6a264eb866fc5))
- fixed keyboard dismissing issue with Reanimated v3 (#1346)(by @janicduplessis) ([`1d1a464`](https://github.com/gorhom/react-native-bottom-sheet/commit/1d1a46489bede1d3f119df2fb6f467e778461c39))

#### Chores And Housekeeping

- fixed types (#1123)(by @stropho) ([`b440964`](https://github.com/gorhom/react-native-bottom-sheet/commit/b44096451d4fed81be7f08b0edf638e4a1c42ccd))

### [v5.0.0-alpha.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.4.6...v5.0.0-alpha.0) -  18 March 2023 

#### New Features

- added web support (#1150) ([`a996b4a`](https://github.com/gorhom/react-native-bottom-sheet/commit/a996b4aa68139136ec75e0921025d235471c838d))
- rewrite gesture apis with gesture handler 2 (#1126) ([`6a4d296`](https://github.com/gorhom/react-native-bottom-sheet/commit/6a4d2967684b01e28f23b1b35afbb4cc4dabaf1d))

#### Fixes

- (#1119): fixed race condition between onmount and keyboard animations ([`a1ec74d`](https://github.com/gorhom/react-native-bottom-sheet/commit/a1ec74dbbc85476bb39f3637e9a97214e0cad9a0))

#### Chores And Housekeeping

- updated reanimated to v3 (#1324) ([`4829316`](https://github.com/gorhom/react-native-bottom-sheet/commit/4829316beeff95c9e2efa5fbfdfcf7ef37b4af60))

### [v4.4.6](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.4.5...v4.4.6) -  30 April 2023 

#### Fixes

- fixed keyboard dismissing issue with Reanimated v3 (#1346)(by @janicduplessis) ([`94cf11e`](https://github.com/gorhom/react-native-bottom-sheet/commit/94cf11eb43f9cc2a356da7e7967ec63baf390a74))
- (BottomSheetScrollView): updated scroll responders props type (#1335)(by @eps1lon) ([`9c5af58`](https://github.com/gorhom/react-native-bottom-sheet/commit/9c5af584516690cb5143caabb7722e0c2340cc57))
- correctly check for non-null object (#1122)(by @stropho) ([`54abf0c`](https://github.com/gorhom/react-native-bottom-sheet/commit/54abf0c0832d1451dfe11be212fc5f938ff5c5fd))

#### Chores And Housekeeping

- fixed types (#1123)(by @stropho) ([`d41eda2`](https://github.com/gorhom/react-native-bottom-sheet/commit/d41eda227e76b89432164ec8dc5cc1ebd5f638ee))

### [v4.4.5](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.4.4...v4.4.5) -  19 September 2022 

#### Refactoring and Updates

- replace findNodeHandle for getRefNativeTag (#1100)(by @AndreiCalazans) ([`1a8928f`](https://github.com/gorhom/react-native-bottom-sheet/commit/1a8928f51cd2b032a2d2d4252e2edcd76f9e32a6))
- added onPress prop to backdrop component (#1029)(by @tarikpnr) ([`1f0e93f`](https://github.com/gorhom/react-native-bottom-sheet/commit/1f0e93f51f36d82d063db39fdef05159a2ad6f01))

#### Chores And Housekeeping

- updated dependencies ([`657ca33`](https://github.com/gorhom/react-native-bottom-sheet/commit/657ca33f6982548f463e092ee186dbe651b7bdb0))
- updated changelog script and templates ([`ee6230c`](https://github.com/gorhom/react-native-bottom-sheet/commit/ee6230c7e75c03fec1887fe84bc2a0e01f0b1c62))

### [v4.4.4](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.4.3...v4.4.4) -  9 September 2022 

#### Fixes

- (web): replace setNativeProps with useState (#1076)(by @RobertSasak) ([`625049f`](https://github.com/gorhom/react-native-bottom-sheet/commit/625049f47b266819b0b8a7d96b32e12e46837b37))
- check if next and current indices are different before animating to a snap position (#1095)(by @itsramiel) ([`3b75d5d`](https://github.com/gorhom/react-native-bottom-sheet/commit/3b75d5d84e0a02933ef2b01d855d9f6036c756b2))
- don't react to snap point changes if height is 0 (#855)(by @simon-abbott) ([`29af238`](https://github.com/gorhom/react-native-bottom-sheet/commit/29af238d9eed31f0d9cad39ade8a43cf37ca2e72))

#### Chores And Housekeeping

- remove nanoid and react-native-redash to clean up some build issues (#1046) ([`8fc11fd`](https://github.com/gorhom/react-native-bottom-sheet/commit/8fc11fddc0a15f04f20cdcf17532ff17c8946971))
- updated example packages (#1064) ([`cebae97`](https://github.com/gorhom/react-native-bottom-sheet/commit/cebae97c56f0b2ff31c247b1fce5cbe8172b6554))
- updated example styling ([`1e99e8d`](https://github.com/gorhom/react-native-bottom-sheet/commit/1e99e8d2e7b73de42b751d32777f18906881eca8))

### [v4.4.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.4.0...v4.4.3) -  31 July 2022 

#### Fixes

- closed bottom sheet snap point (by @eastroot1590) (#1043, #1035) ([`c7f2ce2`](https://github.com/gorhom/react-native-bottom-sheet/commit/c7f2ce26fdaf525951b70b76cd857e0b63cb4865))

#### Chores And Housekeeping

- export internal hook and type ([`a3ae54d`](https://github.com/gorhom/react-native-bottom-sheet/commit/a3ae54dcf7079e88979057f2e19a7813082e798d))
- updated is-sponsor-label action ([`5281041`](https://github.com/gorhom/react-native-bottom-sheet/commit/5281041bdad5fb522a964e61e8ff79acea16143e))
- updated sponsor-label action ([`2583e3b`](https://github.com/gorhom/react-native-bottom-sheet/commit/2583e3b18dcde4e1bc449e43f7c0991d257c67df))
- updated release script ([`a0b64b7`](https://github.com/gorhom/react-native-bottom-sheet/commit/a0b64b7f3da9c6dc811a068fc839efd653c74c16))

### [v4.4.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.3.2...v4.4.0) -  9 July 2022 

#### New Features

- allow scrollable events (#1019) ([`2be6498`](https://github.com/gorhom/react-native-bottom-sheet/commit/2be6498e3c564bd446a92f80df5de5ba6ce5f533))

#### Chores And Housekeeping

- updated git actions ([`bd0a9de`](https://github.com/gorhom/react-native-bottom-sheet/commit/bd0a9de4af48b7babbf524a1b6fc1e799441b207))
- export internal hooks ([`603ac94`](https://github.com/gorhom/react-native-bottom-sheet/commit/603ac9420a6958a9dfc54975576ed19f306a89e7))

### [v4.3.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.3.1...v4.3.2) -  13 June 2022 

#### Fixes

- (regression): updated keyboard handling reaction (by @yusufyildirim) (#979) ([`1811239`](https://github.com/gorhom/react-native-bottom-sheet/commit/1811239202f7dac2b55bb42cd1155d092f1c5694))

### [v4.3.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.3.0...v4.3.1) -  24 May 2022 

#### Fixes

- removed flex style from draggable view ([`29152fb`](https://github.com/gorhom/react-native-bottom-sheet/commit/29152fb65672a07ff91249a882f0fc0f3d9b796c))
- added a fixed position for the container on web ([`ce5115a`](https://github.com/gorhom/react-native-bottom-sheet/commit/ce5115a2abd2ddc7140eb3037274b2c5bb3ff10a))

#### Refactoring and Updates

- allow passing style to the container ([`5e1ed9d`](https://github.com/gorhom/react-native-bottom-sheet/commit/5e1ed9da98913d47b27912f49cf7e12b2393176e))

#### Chores And Housekeeping

- added Expo example  (#958) ([`cb58a8a`](https://github.com/gorhom/react-native-bottom-sheet/commit/cb58a8aaf90fcd0f7b497b6d1d05db60c7088fde))
- fixed dynamic snap point example text color ([`321de77`](https://github.com/gorhom/react-native-bottom-sheet/commit/321de777cb848c85a85ac6107ddc26bef1845566))

### [v4.3.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.2.2...v4.3.0) -  14 May 2022 

#### New Features

- added data to present modal api (#942) ([`8a3d138`](https://github.com/gorhom/react-native-bottom-sheet/commit/8a3d13871a40e08e0c3deb302b60bbb2bcffd9f3))

#### Refactoring and Updates

- expose animateOnMount for modals (#943) ([`df3b180`](https://github.com/gorhom/react-native-bottom-sheet/commit/df3b1803f20bcd6cc106984c6aed6c7a271cbff7))
- added jest mock file (#941) ([`ce15894`](https://github.com/gorhom/react-native-bottom-sheet/commit/ce15894c221fae77f96261eeb5d389eb209ad3a5))

### [v4.2.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.2.1...v4.2.2) -  2 May 2022 

#### Fixes

- allowed keyboard height to be recalculated when it changes (#931) ([`2f33bbe`](https://github.com/gorhom/react-native-bottom-sheet/commit/2f33bbe8ddee66b959100fbe06c54eaf097138df))

### [v4.2.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.2.0...v4.2.1) -  24 April 2022 

#### Fixes

- updated footer container export name ([`a887141`](https://github.com/gorhom/react-native-bottom-sheet/commit/a88714153a780395337b84efe00e3d410702c1d9))

### [v4.2.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.6...v4.2.0) -  24 April 2022 

#### New Features

- allow unsafe usage for useBottomSheetInternal & useBottomSheetModalInternal (#740)(by @jembach) ([`1bf6139`](https://github.com/gorhom/react-native-bottom-sheet/commit/1bf613997cb7a7c8d1fd14f8253701e511a145c7))

#### Chores And Housekeeping

- fixed types import from reanimated ([`831df9c`](https://github.com/gorhom/react-native-bottom-sheet/commit/831df9c9e8f25ead974251efcdc384fa1ca00c2e))
- fixed types import ([`95cb80d`](https://github.com/gorhom/react-native-bottom-sheet/commit/95cb80d3331efb12a1b22b904ebdc0155ebcd833))
- exported useBottomSheetModalInternal hook ([`31eb738`](https://github.com/gorhom/react-native-bottom-sheet/commit/31eb73859b46ca325d8960baff9a9ddccb1b89fe))

### [v4.1.6](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.5...v4.1.6) -  23 April 2022 

#### Fixes

- updated BottomSheetBackdrop "falsey" default props (#793)(by @jakobo) ([`7e00dd2`](https://github.com/gorhom/react-native-bottom-sheet/commit/7e00dd2e30808a122d28ca1e37eebe19e450b884))
- always update container height to avoid races. (#919)(by @elan) ([`3245b23`](https://github.com/gorhom/react-native-bottom-sheet/commit/3245b23653a38da2057f28d02f6d2bf1168864d0))
- always update handle height to avoid races.(related #919) ([`dbf8945`](https://github.com/gorhom/react-native-bottom-sheet/commit/dbf894591db8c72c4a0a4a5f1c2986f07ed4b1fb))

#### Documentation Changes

- updated the readme file ([`d951b17`](https://github.com/gorhom/react-native-bottom-sheet/commit/d951b17957eb5d2f7f1b40a628ba6d5edd4b5a99))

#### Chores And Housekeeping

- updated react native to 0.68 ([`b4614bd`](https://github.com/gorhom/react-native-bottom-sheet/commit/b4614bdd70a82dc31d9ef148a47533682b67a802))
- updated reanimated to 2.8 ([`c1e6847`](https://github.com/gorhom/react-native-bottom-sheet/commit/c1e6847048c43fb2b678bedfd94ae57502df9765))
- added native screens example ([`1cf46c0`](https://github.com/gorhom/react-native-bottom-sheet/commit/1cf46c08c5561c0320c57e1006b24b70c690a34f))
- updated react native portal library ([`955b774`](https://github.com/gorhom/react-native-bottom-sheet/commit/955b7748932ba5ea81d2406c0acf7b612fecbf0e))
- updated portal to 1.0.12 ([`0010008`](https://github.com/gorhom/react-native-bottom-sheet/commit/0010008906154f9a545f89d5826ea7af48336610))
- replaced blacklist with exclusionList (#649)(by @aleppos) ([`e3881b3`](https://github.com/gorhom/react-native-bottom-sheet/commit/e3881b3149c522102b93c5d2ed2a23003ece4ca2))
- export BottomSheetFooterContainer component ([`4f63b0d`](https://github.com/gorhom/react-native-bottom-sheet/commit/4f63b0d0609160790b420d88478859b91fb8424d))

### [v4.1.5](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.4...v4.1.5) -  5 December 2021 

#### Fixes

- resume animation on interruption (#769) ([`f2a9332`](https://github.com/gorhom/react-native-bottom-sheet/commit/f2a933274c88004357700bf728c1c3d1fde48d20))

### [v4.1.4](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.3...v4.1.4) -  21 November 2021 

#### Fixes

- prevent hiding bottom sheet container on platforms other than Android (#719) ([`3da1a2e`](https://github.com/gorhom/react-native-bottom-sheet/commit/3da1a2e6f33fb886e53606d4bbcd06938d839008))

#### Documentation Changes

- updated readme ([`d951a19`](https://github.com/gorhom/react-native-bottom-sheet/commit/d951a1976f5fd2e7a38bedbabb452a103b9644ea))

#### Refactoring and Updates

- updated modal ref calls to use optional chaining (#725)(by @jcgertig) ([`9ace1c6`](https://github.com/gorhom/react-native-bottom-sheet/commit/9ace1c69f1153af8b598724f184672e3f6a807a5))

#### Chores And Housekeeping

- updated example dependencies ([`9176e35`](https://github.com/gorhom/react-native-bottom-sheet/commit/9176e35dec148a8d3eff8b472ccb495b4992d8e1))

### [v4.1.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.2...v4.1.3) -  18 October 2021 

#### Fixes

- prevent unstable mounting for modals (#697) ([`657505a`](https://github.com/gorhom/react-native-bottom-sheet/commit/657505a65b01a1ccd7e2027b12fe1953967aa875))

#### Documentation Changes

- updated logo ([`7c176e0`](https://github.com/gorhom/react-native-bottom-sheet/commit/7c176e08eca0be638b283712c643f0ef281134ae))

#### Refactoring and Updates

- updated modal ref calls to use optional chaining (#699)(by @jcgertig) ([`ea19e3f`](https://github.com/gorhom/react-native-bottom-sheet/commit/ea19e3fa17953854c769ef6d2033d14bcd5a747e))

#### Chores And Housekeeping

- updated @gorhom/portal dependency ([`e777487`](https://github.com/gorhom/react-native-bottom-sheet/commit/e77748712772f2da66ea27ddd655fc5b7d75ab02))
- updated sponsor link ([`2b624cc`](https://github.com/gorhom/react-native-bottom-sheet/commit/2b624ccfb8d5cb6c03337052e86d4d0d8ab960fa))
- updated contact list scroll indicator style to black ([`9cc8b17`](https://github.com/gorhom/react-native-bottom-sheet/commit/9cc8b172298fa38c2a5597d3ed77361fd496db25))

### [v4.1.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.1...v4.1.2) -  12 October 2021 

#### Fixes

- hide the bottom sheet on closed (#690) ([`9f04d55`](https://github.com/gorhom/react-native-bottom-sheet/commit/9f04d557d202ab8570b1b409332bfdd129e5efa4))

### [v4.1.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.1.0...v4.1.1) -  3 October 2021 

#### Refactoring and Updates

- allow to render component inside default backdrop (#662) ([`5df1a1f`](https://github.com/gorhom/react-native-bottom-sheet/commit/5df1a1f35f4dab867b38818d01c0f865091a2e70))
- calling dismiss without a key will remove the current modal if any (#676)(by @Shywim) ([`fd4bb8d`](https://github.com/gorhom/react-native-bottom-sheet/commit/fd4bb8df8b4dae879326438697a85c0c9d2ddb24))

### [v4.1.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.3...v4.1.0) -  26 September 2021 

#### New Features

- added handling for keyboard height change (#656)(by @Ferossgp) ([`3c5fc57`](https://github.com/gorhom/react-native-bottom-sheet/commit/3c5fc571e6442bd56712e9f4dbba89bbcd93dda1))

#### Fixes

- updated initial position to screen height (#657) ([`dc56417`](https://github.com/gorhom/react-native-bottom-sheet/commit/dc56417c912b068d0ed2487517ae8f2ad2334b57))
- remove 'removeListener' as it is now deprecated (#635)(by @brianathere) ([`f03b05b`](https://github.com/gorhom/react-native-bottom-sheet/commit/f03b05bbc39bf62f7d97422e717f2998f2e1fada))
- revert changes on BottomSheetModal that blocked stack behavour ([`15225ae`](https://github.com/gorhom/react-native-bottom-sheet/commit/15225aef40fb5cb789fb077505edb5d710ab9e91))
- updated asigning velocity in animate worklet (#650) ([`38b635e`](https://github.com/gorhom/react-native-bottom-sheet/commit/38b635ec03d749cc0b7258ae2972ece722e0bb4a))

#### Documentation Changes

- fix overDragResistanceFactor description (#633) ([`1da46f5`](https://github.com/gorhom/react-native-bottom-sheet/commit/1da46f5ade949aaaaff9d0e472c41059e9aaa969))

#### Chores And Housekeeping

- updated @gorhom/portal dependency ([`366e46b`](https://github.com/gorhom/react-native-bottom-sheet/commit/366e46bc44eb63f8e6bf99d225612c9659b4a72a))

### [v4.0.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.2...v4.0.3) -  2 September 2021 

#### Fixes

- allow content to be accessible #619 ([`f1baf0e`](https://github.com/gorhom/react-native-bottom-sheet/commit/f1baf0e4748fd84110d905f82404a86fd697c936))

### [v4.0.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.1...v4.0.2) -  31 August 2021 

#### Fixes

- updated types for styles (#616) ([`7fa1453`](https://github.com/gorhom/react-native-bottom-sheet/commit/7fa14531fe2fe28ba9385fdcb22e4ca5e6aacf9e))

### [v4.0.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0...v4.0.1) -  30 August 2021 

#### Fixes

- pass correct params to animateToPosition (#610) ([`01883fb`](https://github.com/gorhom/react-native-bottom-sheet/commit/01883fb9575574c228cd40ec4a43658a6ea831c9))

#### Documentation Changes

- add kickbk as a contributor for bug, test (#612) ([`3316c8b`](https://github.com/gorhom/react-native-bottom-sheet/commit/3316c8b92662e5be92d2c355f3fa04632eb8b6bf))
- add vonovak as a contributor for code (#611) ([`7c97e8f`](https://github.com/gorhom/react-native-bottom-sheet/commit/7c97e8ffd76936a5168ad9f914bdc5e1ab1b3bdd))

### [v4.0.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.30...v4.0.0) -  30 August 2021 

#### Documentation Changes

- added auto-deployment for documentation website ([`3b14281`](https://github.com/gorhom/react-native-bottom-sheet/commit/3b1428199f49339d5aa8a607cd0f496907fcb2e5))
- updated readme file ([`84fdcf6`](https://github.com/gorhom/react-native-bottom-sheet/commit/84fdcf6db98a5c58ee0b8cfa821bd8031c710df0))

#### Chores And Housekeeping

- updated close method type ([`ca3a11a`](https://github.com/gorhom/react-native-bottom-sheet/commit/ca3a11a3f56f3ba3bcd865ce1006490f3819f054))

### [v4.0.0-alpha.30](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.29...v4.0.0-alpha.30) -  22 August 2021 

#### Fixes

- prevent the sheet from snapping while layout being calculated ([`445a964`](https://github.com/gorhom/react-native-bottom-sheet/commit/445a9645366af04931f4464d1befb1bc8e1dbbed))

#### Refactoring and Updates

- added forceClose and remove force param from close method ([`3dd5796`](https://github.com/gorhom/react-native-bottom-sheet/commit/3dd5796eb722e4e579de7b2439d224a5e0238b55))
- clean up animation configs variables #572 ([`8e002e1`](https://github.com/gorhom/react-native-bottom-sheet/commit/8e002e1c20c019951bbf444fceacefc0cf0e86c2))

#### Chores And Housekeeping

- delete debug view from builds ([`7ead04e`](https://github.com/gorhom/react-native-bottom-sheet/commit/7ead04edc1a77cf820adcdadecc912b7791ab14c))

### [v4.0.0-alpha.29](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.28...v4.0.0-alpha.29) -  18 August 2021 

#### New Features

- added backgroundStyle, handleStyle & handleIndicatorStyle to bottom sheet ([`2211765`](https://github.com/gorhom/react-native-bottom-sheet/commit/221176546fd59ed0c9d79fe7f0350eda24dd8550))

#### Fixes

- prevent keyboard change to snap sheet while user is interacting ([`dd632b0`](https://github.com/gorhom/react-native-bottom-sheet/commit/dd632b04651d37ab6a8a2aba2be13d9633e677e4))

### [v4.0.0-alpha.28](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.27...v4.0.0-alpha.28) -  17 August 2021 

#### Fixes

- provide dynamic initial snap points while layout is calculating  (#584) ([`98fb8d2`](https://github.com/gorhom/react-native-bottom-sheet/commit/98fb8d24a55c064f0072c74c0bf2e1af079be819))
- prevent snap points lower than 0 ([`95ea72a`](https://github.com/gorhom/react-native-bottom-sheet/commit/95ea72a459f96d40ad583c5579cc72f0e128e5dd))

#### Chores And Housekeeping

- updated github workflow and templates ([`db68fac`](https://github.com/gorhom/react-native-bottom-sheet/commit/db68fac9eb4ac117e7c89dd74352391a77f0a3ec))
- updated auto-close action version ([`991d214`](https://github.com/gorhom/react-native-bottom-sheet/commit/991d2141a4f026068737abc098f9b0d2b6968a5f))

### [v4.0.0-alpha.27](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.26...v4.0.0-alpha.27) -  15 August 2021 

#### Refactoring and Updates

- rename Touchables.android to Touchables, to allow web usage ([`a95e34f`](https://github.com/gorhom/react-native-bottom-sheet/commit/a95e34fc2d0af0aaecf514ebbd0e8dee9df55fb0))

### [v4.0.0-alpha.26](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.25...v4.0.0-alpha.26) -  15 August 2021 

#### New Features

- added onClose callback to BottomSheet ([`ee64545`](https://github.com/gorhom/react-native-bottom-sheet/commit/ee64545ce0e7609fb383f1473773c8481a0bc7aa))

#### Fixes

- updated animated closed position value on detached ([`833879f`](https://github.com/gorhom/react-native-bottom-sheet/commit/833879f3f703b80fb5bc591a823d86f3c56cc7ee))

#### Documentation Changes

- added code of conduct file ([`18a32e5`](https://github.com/gorhom/react-native-bottom-sheet/commit/18a32e5979d22a693734d1af7fef6cc9887cea67))

#### Refactoring and Updates

- updated footer api ([`2cf7289`](https://github.com/gorhom/react-native-bottom-sheet/commit/2cf72890abd92b7e9be25d7013744fe503107a1a))

#### Chores And Housekeeping

- updated package dependencies ([`e11dc84`](https://github.com/gorhom/react-native-bottom-sheet/commit/e11dc844a7cdcba694a01d4cbeb37f1709e23dea))
- renamed the branch to master ([`a0bb98a`](https://github.com/gorhom/react-native-bottom-sheet/commit/a0bb98a77686687e643514d131b74f421b5d4aee))

### [v4.0.0-alpha.25](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.24...v4.0.0-alpha.25) -  6 August 2021 

#### Fixes

- fixed the multiline issue on BottomSheetTextInput #411 ([`e21d676`](https://github.com/gorhom/react-native-bottom-sheet/commit/e21d6762a929c6eaaf64e95d8af2934cc8b3a703))

### [v4.0.0-alpha.24](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.23...v4.0.0-alpha.24) -  5 August 2021 

#### Fixes

- prevent animatedIndex from flickering caused by content resizing ([`7fef5d0`](https://github.com/gorhom/react-native-bottom-sheet/commit/7fef5d03c0edef5945dc0bd825ce9081b90e7402))

### [v4.0.0-alpha.23](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.22...v4.0.0-alpha.23) -  5 August 2021 

#### New Features

- allow custom pan gesture and scroll handler customisation  (#525) (by @vonovak) ([`4c32da7`](https://github.com/gorhom/react-native-bottom-sheet/commit/4c32da7c0bb7e902883f009f10909286ad65042c))

#### Fixes

- allow user to override showsVerticalScrollIndicator value on scrollables ([`11cdc34`](https://github.com/gorhom/react-native-bottom-sheet/commit/11cdc344e029200435280389b291441c1c363e97))

#### Refactoring and Updates

- updated animateOnMount default value to true ([`6293fe4`](https://github.com/gorhom/react-native-bottom-sheet/commit/6293fe452f54c3f5d2ac332642b4c369bc768c92))

#### Chores And Housekeeping

- remove unnecessary useMemos (#515) ([`51fa2b3`](https://github.com/gorhom/react-native-bottom-sheet/commit/51fa2b36989c5ee8a73d3a13a903c49392a4419a))
- removed enableFlashScrollableIndicatorOnExpand prop ([`e447da4`](https://github.com/gorhom/react-native-bottom-sheet/commit/e447da49a79f09456603cf57b5839c42f390f9b5))

### [v4.0.0-alpha.22](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.21...v4.0.0-alpha.22) -  20 July 2021 

#### Refactoring and Updates

- allow closing animation to be interrupted ([`937f9ee`](https://github.com/gorhom/react-native-bottom-sheet/commit/937f9ee91c485759c492b9dec532914ffa40375b))

### [v4.0.0-alpha.21](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.20...v4.0.0-alpha.21) -  18 July 2021 

#### New Features

- react to index prop changes ([`55af54b`](https://github.com/gorhom/react-native-bottom-sheet/commit/55af54bd772ff312f91891d7c88f33afa02f1efe))

#### Fixes

- updated detached bottom sheet handling ([`603f492`](https://github.com/gorhom/react-native-bottom-sheet/commit/603f49294e572716d7eaf517a2adde01681c56c6))

### [v4.0.0-alpha.20](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.19...v4.0.0-alpha.20) -  13 July 2021 

#### Fixes

- prevent stuck state when animation is interrupted ([`01e1e87`](https://github.com/gorhom/react-native-bottom-sheet/commit/01e1e8716477aa904bedbda2aa08642f8a0c3c9c))

#### Refactoring and Updates

- removed none from keyboard behavior and set interactive as default ([`26d3b71`](https://github.com/gorhom/react-native-bottom-sheet/commit/26d3b7187cb309ce77dd55c32d44a63316776515))

### [v4.0.0-alpha.19](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.18...v4.0.0-alpha.19) -  4 July 2021 

#### Fixes

- stablise animated index when reacting to keyboard status ([`26132c1`](https://github.com/gorhom/react-native-bottom-sheet/commit/26132c14871af82eda7adf63ea98ab7a9f7d95e3))

### [v4.0.0-alpha.18](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.17...v4.0.0-alpha.18) -  1 July 2021 

#### Fixes

- fixed handling dynamic snap point on mount snapping ([`35b2fcb`](https://github.com/gorhom/react-native-bottom-sheet/commit/35b2fcb7d4eb1a2b953280a56396459b43b8767e))

### [v4.0.0-alpha.17](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.16...v4.0.0-alpha.17) -  29 June 2021 

#### Fixes

- updated android keyboard handling ([`f53306d`](https://github.com/gorhom/react-native-bottom-sheet/commit/f53306d8d214d7dc605eb5ecb343f08f011c3ae2))

### [v4.0.0-alpha.16](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.15...v4.0.0-alpha.16) -  27 June 2021 

#### New Features

- allow view scrollble to over-drag sheet ([`2c2ca4e`](https://github.com/gorhom/react-native-bottom-sheet/commit/2c2ca4ec17587689c2e38fcb0aad87a172251b55))

#### Fixes

- updated keyboard handling for Android ([`2d74ab0`](https://github.com/gorhom/react-native-bottom-sheet/commit/2d74ab069357f0ba430ff9f059dad0c6305eef48))

### [v4.0.0-alpha.15](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.14...v4.0.0-alpha.15) -  26 June 2021 

### [v4.0.0-alpha.14](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.13...v4.0.0-alpha.14) -  26 June 2021 

#### Fixes

- refactored snap points reaction to handle keyboard state (#497) ([`f8f2417`](https://github.com/gorhom/react-native-bottom-sheet/commit/f8f2417454480207ae7a5a481b9fcd1483043e23))

### [v4.0.0-alpha.13](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.12...v4.0.0-alpha.13) -  15 June 2021 

#### Fixes

- prevent animation to same position ([`9636f84`](https://github.com/gorhom/react-native-bottom-sheet/commit/9636f847d53ff99d801753254876722050cc3e13))

### [v4.0.0-alpha.12](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.11...v4.0.0-alpha.12) -  12 June 2021 

#### New Features

- added detached bottom sheet  (#487) ([`3aa5fdb`](https://github.com/gorhom/react-native-bottom-sheet/commit/3aa5fdbce75acf47f534e69b3a898abbf7dfca46))

#### Documentation Changes

- updated detached prop description ([`9d4779b`](https://github.com/gorhom/react-native-bottom-sheet/commit/9d4779b57f60bba7f895f7609e759e0eb0b2640a))

#### Chores And Housekeeping

- updated portal dependency ([`70d72ec`](https://github.com/gorhom/react-native-bottom-sheet/commit/70d72ecff5c78c397dbfc47bbff94b52237efab8))

### [v4.0.0-alpha.11](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.10...v4.0.0-alpha.11) -  6 June 2021 

### [v4.0.0-alpha.10](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.9...v4.0.0-alpha.10) -  6 June 2021 

#### New Features

- added pull to refresh implementaion ([`016a01f`](https://github.com/gorhom/react-native-bottom-sheet/commit/016a01f3705c83c9903a3e28c875e7b90424a128))
- introduced more stable handling for dynamic snap points ([`3edb2d1`](https://github.com/gorhom/react-native-bottom-sheet/commit/3edb2d1f9a9a8b1ba2e04803cd12306e4353199b))

#### Fixes

- dismiss keyboard when sheet position change on Android ([`8f34990`](https://github.com/gorhom/react-native-bottom-sheet/commit/8f34990436f8cc8c1ec1c545488d77db5845166c))

### [v4.0.0-alpha.9](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.8...v4.0.0-alpha.9) -  3 June 2021 

#### New Features

- added keyboard input mode for android ([`069c4b6`](https://github.com/gorhom/react-native-bottom-sheet/commit/069c4b6742630dc5fa7d4763a5c4dc6bfec439cc))

#### Chores And Housekeeping

- export useBottomSheetInternal, added animatedPosition and animatedIndex to useBottomSheet ([`fb3df59`](https://github.com/gorhom/react-native-bottom-sheet/commit/fb3df595c0bf5bcc63ca29e8e2609929de63e595))

### [v4.0.0-alpha.8](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.7...v4.0.0-alpha.8) -  2 June 2021 

#### Fixes

- updated typings for sectionlist to mirror rn core types (#475) ([`dd9dbdc`](https://github.com/gorhom/react-native-bottom-sheet/commit/dd9dbdc8d9fbeb5d557cee37841c5ca187c1b5fb))
- prevent animated content height value from getting below zero ([`d9b417f`](https://github.com/gorhom/react-native-bottom-sheet/commit/d9b417f703ceb69a959b0ce59600e53d75560d1e))
- updated BottomSheetContainer measuring on android ([`d0e5227`](https://github.com/gorhom/react-native-bottom-sheet/commit/d0e52270076617242010b08f73fe09ab8ede69d1))

#### Chores And Housekeeping

- minor refactor (#473) ([`e209ebe`](https://github.com/gorhom/react-native-bottom-sheet/commit/e209ebe67aabe1d78710a65bda1435387d75dd39))
- minor simplifications (#467) ([`7cfe70d`](https://github.com/gorhom/react-native-bottom-sheet/commit/7cfe70dda633c3953e7c6bdb3fabcf54408529e8))

### [v4.0.0-alpha.7](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.6...v4.0.0-alpha.7) -  30 May 2021 

#### New Features

- allow handle to drag sheet without effecting the scrollable ([`580b763`](https://github.com/gorhom/react-native-bottom-sheet/commit/580b7632e656403b0797c4e969a35d30f0ec5cb3))

### [v4.0.0-alpha.6](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.5...v4.0.0-alpha.6) -  28 May 2021 

#### Fixes

- scrollble container style crash ([`a4b9b93`](https://github.com/gorhom/react-native-bottom-sheet/commit/a4b9b933268a670fbf6dd1198de61d899abde738))

### [v4.0.0-alpha.5](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.4...v4.0.0-alpha.5) -  27 May 2021 

#### New Features

- added pre-integrated VirtualizedList component ([`2d4d69d`](https://github.com/gorhom/react-native-bottom-sheet/commit/2d4d69d8881a3cbe452f5e46157e2b9702528206))

#### Fixes

- updated keyboard height in container calculation ([`2599f6c`](https://github.com/gorhom/react-native-bottom-sheet/commit/2599f6cf46af0f95812e34670de5a7cae5d44fd9))
- re-snap to current position when snap points get updated ([`bb8e202`](https://github.com/gorhom/react-native-bottom-sheet/commit/bb8e202af05dc6beeb108cfa1680401374ac58ad))
- handle initial closed sheet ([`4bc40d9`](https://github.com/gorhom/react-native-bottom-sheet/commit/4bc40d93da05dcff664ce939a9944416b9e91359))

### [v4.0.0-alpha.4](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.3...v4.0.0-alpha.4) -  25 May 2021 

#### New Features

- added footer component (#457) ([`46fb883`](https://github.com/gorhom/react-native-bottom-sheet/commit/46fb88398ec7625c258cd62cb8560d72f3537fcb))

### [v4.0.0-alpha.3](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.2...v4.0.0-alpha.3) -  23 May 2021 

#### Fixes

- on mount flicker on fixed sheet ([`48c4988`](https://github.com/gorhom/react-native-bottom-sheet/commit/48c49888b95dc88abf320d4d7590f43806e0bd59))
- prevented animatedSnapPoints reaction from running randomly ([`bf4e461`](https://github.com/gorhom/react-native-bottom-sheet/commit/bf4e461e2cb9b5cb90a7de105637fc43d3947525))

#### Refactoring and Updates

- removed deprecated props (#452) ([`993f936`](https://github.com/gorhom/react-native-bottom-sheet/commit/993f9369dbf62c3e6d193e843e0e2dc7b82dbd50))

### [v4.0.0-alpha.2](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.1...v4.0.0-alpha.2) -  23 May 2021 

#### Refactoring and Updates

- updated handling animated heights (#451) ([`b9313ba`](https://github.com/gorhom/react-native-bottom-sheet/commit/b9313baadc7ea5418be44a7f18bff578be73bac2))

### [v4.0.0-alpha.1](https://github.com/gorhom/react-native-bottom-sheet/compare/v4.0.0-alpha.0...v4.0.0-alpha.1) -  16 May 2021 

#### New Features

- added snap to position (#443) ([`9ca5f29`](https://github.com/gorhom/react-native-bottom-sheet/commit/9ca5f29b200e1192712859dd9fe31f8c411fadf1))

### [v4.0.0-alpha.0](https://github.com/gorhom/react-native-bottom-sheet/compare/v3.6.6...v4.0.0-alpha.0) -  16 May 2021 

#### New Features

- added enable pan down to close (#437) ([`1f103b0`](https://github.com/gorhom/react-native-bottom-sheet/commit/1f103b0d2c0a1661213b8c63af1db24cb0c191f7))

#### Fixes

- sheet positioning on modals ([`ee573e9`](https://github.com/gorhom/react-native-bottom-sheet/commit/ee573e9463836301d9736c3e5d86b2b363f9fb14))
- prevent animatedPosition from becoming undefined ([`400d7b9`](https://github.com/gorhom/react-native-bottom-sheet/commit/400d7b93caa0a46f678db2978e7e5f95cc87ee99))

#### Refactoring and Updates

- create one generic scrollable component (#442) ([`01f791e`](https://github.com/gorhom/react-native-bottom-sheet/commit/01f791e42874a5c9bf1b18df029e32c30a51e8b5))
- converted all internal state/memoized variables to reanimated shared values. (#430) ([`89098e9`](https://github.com/gorhom/react-native-bottom-sheet/commit/89098e9c430917ec0930f6de64b9cb18663242ab))

#### Chores And Housekeeping

- updated dependencies ([`7d2a947`](https://github.com/gorhom/react-native-bottom-sheet/commit/7d2a9473a95c3e245e90932715406b62e81e6a63))
- patch react-native-gesture-handler for android ([`26a0d64`](https://github.com/gorhom/react-native-bottom-sheet/commit/26a0d64a062a441b2f96b3f04c48a039cee6684a))
