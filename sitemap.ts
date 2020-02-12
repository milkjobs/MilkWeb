import fs from "fs";
import urljoin from "url-join";
import builder from "xmlbuilder";

const staticPaths = [
  "/",
  "/about",
  "/stories",
  "/help",
  "/help/tos",
  "/help/privacy",
  "/help/faq",
  "/help/pricing",
  "/awesome/電商",
  "/awesome/遊戲",
  "/awesome/政大政治",
  "/awesome/成大都市計畫學系",
  "/awesome/台大電機",
  "/awesome/台大資工",
  "/awesome/台大財金",
  "/awesome/台大國企",
  "/awesome/台大工管",
  "/awesome/台大化工",
  "/awesome/台大機械",
  "/awesome/台大公衛",
  "/awesome/台大藥學",
  "/awesome/台大圖資",
  "/awesome/台大數學",
  "/awesome/台大經濟",
  "/awesome/台大材料",
  "/awesome/台大物理",
  "/awesome/台大政治"
];

const generateUrlNode = (url: string) => {
  // Always add trailing slash.
  url = url.endsWith("/") ? url : `${url}/`;

  return {
    url: {
      loc: {
        "#text": url
      },
      "xhtml:link": {
        "@rel": "alternate",
        "@hreflang": "zh",
        "@href": url
      },
      lastmod: {
        "#text": new Date().toISOString().slice(0, 10)
      },
      changefreq: {
        "#text": "daily"
      }
    }
  };
};

const getTeamIds = () => {
  return [
    "00380d74a84e40b8bc251d33078b60fd",
    "2ea01256c9894d289d5b9546577aaf80",
    "c181b9e6e3914e73ac53899739d315cb",
    "763f330eb61141e6b77700f02cf68130",
    "f3ffa32e19b940b6b355cbb878793527",
    "d04644c12dff46099e21bfc6b9bf9ee5",
    "d102548227ca436d87db0d9256219265",
    "e3670876ce3946e78fa58c0668c6065d",
    "b8f498f88fbc4a15889665e3bc5f7597",
    "bced2c7064664c7a82d0cefb772b0b58",
    "75bb2b58beb74160abe8dc9935dafcc6",
    "6cbbc7e750954ffaa42647e80783b981",
    "4800121ad2c3431eaac13c752b84960d",
    "e95fb46cf42940e1899eba778000f61e",
    "b849be7be07b4ee0b511c19e9e8600d4",
    "283e64b8928148cfaabb5bf1da90e1dc",
    "53fbe163b5324556a2a9870dbce2562b",
    "9ab23dc519eb4723bed00f9e5456066a",
    "e32fdb24bc734bf185f529054e2d775d",
    "775a6b2e331d407ca5a95ef3b7df92ab",
    "6d848bbec4ed4a9ca3a52301ac72e77d",
    "f3f9e408cdbf4831b036a05877e8d4cb",
    "28682ea1b57a40f6a8372a8310936130",
    "eb12009b1aab485aae29621371be2aae",
    "781877baa2454e779bc72e943274840b",
    "e1f2608bcdf442fe9639b3c7d2878f62",
    "87ff5e6789254f2dabbec313cf4361b3",
    "4394b8a493c5478a803e01873a1596a1",
    "b50a66c2991e42498270c801d4fbaf25",
    "98b42bb3a3464ec4b227dcf6091312ae",
    "47fc773380b944c2904e49d749be8938",
    "f1338b053b844455a85c0a4615897990",
    "5bf87d372e4b42e586c435e3c6a2fd9e",
    "ee09199ad1e2402ca533920c76070e43",
    "e0247f0ff5c140579f77cba9d3adf1bd",
    "94646f55bd37450d9153de88d3ba97e6",
    "9276db50dbc9462cb3a6947236ce0e99",
    "5264be54a14f4ce48cdf543872f34e3c",
    "c74382b6bdc24efcad9e60d657afdbcd",
    "1125cd45fa754b0aa6d9a7ab0102cc96",
    "8cf3a8fe7ccc4a47ae8f7e32ddc00c2b",
    "4a6988f87c9b419e8e87e02e659f4f03",
    "9c914d7b68e144cd9152819687a13d56",
    "170e2e44784b4a26a909863ed03e649f",
    "ee1b80628f3548179c79c326107b1c5f",
    "ba3e2399b45b403793918fa75818240e",
    "852a3c241ff14f4184b074246580ad06",
    "362c48f3f1554efc96a942b1ff31219c",
    "bde2d6dbfafa442382ffd57c42d16f0b",
    "34918bc3c67c41fa91fa50f12e7a7e96",
    "94872b79deca44558b5f3f2525c276f8",
    "ddfd1f2344284402ba7cd5294d6d6c36",
    "9be9ef4cae62447eb30818eba826fe7e",
    "617684e9324e40f98718e2991bcc78d1",
    "81ee14b0a7a24cf2a1de279ce2a151cd",
    "62f0a8dfed5f4a9fad975bdff6089f93",
    "4d318282a3b940c687b5a9b0cb8f0a91",
    "50c12c7492d34f119b721c24331ca51a",
    "e22cd5aa4d6f42b09610a3e4ca701ed6",
    "3aebb5492d1e4c87852dd5cb1348e402",
    "5b79b90dd647463b991e20801fa77134",
    "0d95c0f7cbd24f69872de00b2bd72283",
    "67f2ad8e12bb4224b35b2e5acf4d00ce",
    "cf7bbb9921564ca4a0535d65b63083b0",
    "1ec746f548e844faacb11eb3a8d0f751",
    "59d49e3108444270bbc1e83f41c3519b",
    "6f2c83707876436bbd7a4e7b889192ea",
    "dadf2f19568e4647bf7e7736bcba29dd",
    "a264cfa65c8c479da74378c4476d4c66",
    "043bf1e322f64cb9a72bcd02ef19d9b8",
    "032ce7791d414cfb8e5806c63fe5f0c3",
    "28ca4290a3dc4234b3a3e8597b32cd74",
    "c87f56fbd53b4375aa46c2e1b09b2c98",
    "6347cdcd5ed3420991a75f2b67ddc408",
    "7606d4a09ccd4593b72a0214337dab52",
    "d72001437f144b16b325a54ba85cb76a",
    "b045a4d0e9ab444fb8052f898e93f2a7",
    "eba0d9f71a654843a9cbbb08414589d6",
    "33cc06e22a904673950474ceeeca0406",
    "d5b0def8b09f45e595c2f16c6f98d6fa",
    "e5d6849279ca44bd8c4bc58629d87365",
    "89d4d022ba8e4fd3a47bc9931d3271ff",
    "aa9330d265324821a11e8dbb3a5f585c",
    "e4da4f565be243429d8c80c407851fab",
    "3a4f6c286fd04547abffd64e299f597a",
    "d1159478dde240198af5c45e9563a6d8",
    "e200b70e9ab04e60a3b1f587910eaf52",
    "a00f916e335c4bdf8bab99613d6408ee",
    "140cbc1a0c034541b628afaf499a1a74",
    "3339911390af4d6484dcfc446ce1df8a",
    "4eed528f8bb2438d9e1f84d2ef093bf1",
    "b7c11940d4b745999dc60665c6c85463",
    "3dd007b03e89401daad25e9c0377f87d",
    "190d926baee448268f440f10181f7fd5",
    "1772719c5c2d4f39a5c74e3a4028318d",
    "c75e730e5dad41f6b7c2016cdf363f5f",
    "a6058da761124faa9fd6da4fa1a4c49a",
    "bf27f5d74add4fc58cee371eb0eb8258",
    "84f5d7c2be9047218ebbf42e78f10ffd",
    "4a919a5e7de444a78198edf66397e718",
    "857e2dc329ac4bf0b0996f47261f1f36",
    "06ce0bde2b404fe784c909dd3c939f49",
    "7b4a11d665cc42b5b918190edf6c9bd2",
    "525bf5f1b7c645d8941aa96266eb49bf",
    "2dc2c12700ee491582e1c8e167c04992",
    "b41ce4ec08424ae1966eeae9bfe1b18d",
    "2bd3b99892be4ec1a3978041e89ebc8c",
    "03503d70d11043d9ab80e6c05f947cf8",
    "4226b2be26fa4e0ea01615142a0e6396",
    "745c21c05a354356a5c155ef7d987c97",
    "c3d6fb4ac0044f44ace45297137d2567",
    "c4570a53b2774c16a68cb68798c35124",
    "9a245e31ed004f918988289b575a42a1",
    "1181321d73f1474ea2cf7141e6c686b0",
    "9745812aeb7141be902405015141ea85",
    "732f4087733f4392ba9484686ffcd785",
    "cf550a4c5edc457bb6786f175b06f3fb",
    "1ce34326e373465889ecbcc21f1896f5",
    "0f9f1a499e53432f8eddb44ec8269474",
    "e6b749718de344cdabdbdf287ed0d983",
    "66a7562213254198a8ac8a7af364b5b4",
    "7634c07d39214e2db8feae7f456b8712",
    "fc84bec07e1d4cf28067e2ae80647c06",
    "90df797bf47145e883ba3f11037a2f4f",
    "318213df849b4234afdd9924488b805c",
    "eb7b9dc7cc7a4f9e8884e2c72ec1cde4",
    "cd1e23cef8434ce2b9dad35806639dcb",
    "82af87595aba4eb2871fc095a2138cce",
    "a068b59d4d2a47c98bfb56fc83ab2309",
    "9ac4ccbfabf74548b368a02a34da5e3b",
    "01851f6db0f6446e9a463991ededf3f3",
    "1d5e8564039f46a8811aa6c043e8ecfe",
    "d94636da0aa14d5cb4edf04632f2b51c",
    "9c64b61a181d4d0aba220a2091acb8fa",
    "206f3215168949c78390dcb6542347c4",
    "c6642a50890e471096867cee19cd2e91",
    "f2b6e48df7f541e081483ccb496dcba3",
    "2570ee4717d54007b7894fc450d6cc0a",
    "79ad744821eb4b6190c35321e8442692",
    "edaa353c94b94287b04ff7fe44924f08",
    "1702a63ecec043fdb97c632e48bddea5",
    "7cc985ce42934feb95007c8fcba4c802",
    "d18cbde642bc4f55b820df86a456401e",
    "93cbf243a69f4abdb2b88258a38339d0",
    "0ee13a5df5e447e7abacbe9161f6c750",
    "44a3b32d1d6f472eb825e4fa05819bb0",
    "7d26843dc6d54c568ae751016d7c6450",
    "85c365dfe6a04c1286312bb963a7ca33",
    "ff8d26fbfd044f73bbc033adbbe2e558",
    "f992960b9894415f94d2b53d6951cc93",
    "b41d46c5c5934907b95856bfd350acb3",
    "5f178500e8634cea94caa2165a211b3a",
    "161e4f31a16745699593b8b94bf4d389",
    "812afffab564478ba93824ea052d1fec",
    "559946710c8f4365a9f4761a6493fe67",
    "ca852014357b4a63823ea856951d0036",
    "5918e86100134456a0e0f5bf15a41d5f",
    "e745e881ab1c4f44bd44fe2e32d13ca1",
    "5f7f0e27105d469ab7d7eae05289113b",
    "448524657ad441af8a72093c9c7d06d3",
    "f729a47f59544441988be3498d53452f",
    "060210e558a9428496a94f809b724430",
    "fc1d733d4ff74cd6bb5f47ebb5fd79a5",
    "3cabb6bac07846989b534fb41182819a",
    "eac5155b23614e45a28399790483bed8",
    "18b177c9a90c40a8921a77ea63203f85",
    "bbe9ef18b89d4a849ee7a5951bba0c44",
    "dfd76bc6d4b848e0ba8773e22138b174",
    "93a409d0993c43748cc389d382d60ee7",
    "f9e9ce4d405b4af5aca0010bcfc38a3d",
    "36eaea8de79549759bb0e0454a3d60ff",
    "f1001d9d60384665b671707ded23f7a4",
    "32b25756f8d649338a107c809454e5f5",
    "1abcaaf5c3374a6e9ee783e99aa83faa",
    "660685c710d942ff80f7aba58825f418",
    "7459852fbda94c76acb9f4265dc82e96",
    "5f6ad03d21e946f3a5b06fe12104490f",
    "b46f92b7fdee4900b035b08acb292277",
    "b73a6677121c40aca2fc7e5a38022ee9",
    "76a431cd16c14b6086b4e88a1ce6c767",
    "ed01a6294b564a8ab7904909f836f37a",
    "94c99c9f6518474a99f954ff6d8b5dd3",
    "d9a918cd02534bf2b9f6154c6faa50e0",
    "e0062d21e9bb40bd99262110fb4c059c",
    "e4176bf260b04f9ebc751ae0572156a4",
    "5b892cd3180b4b249359b0e0f2fc3e67",
    "2fd5026660fe4c59a00b890a42444504",
    "226612176b1d4d1a940d2d6594e6561e",
    "ba66124b48c84abca408cc86416b1551",
    "e53dbe507d54494ea95a08b1acb9f259",
    "38ff85125e464e3aae936a821eb457c6",
    "21d30303c2a041b49145f0244877153d",
    "ca0294e29c954a2cab919701e11600c1",
    "11bff8cfe6cf4b35b7f36ee635d09cfe",
    "cfd760ea94e84287a435bd02eb0ca5fb",
    "eacd1405ba7d4adfbe3b45bdda664342",
    "3388736d86074a1084031aa432d118e0",
    "16e861df7ee847e8a8400f407a72a05e",
    "5e39326426034272a95bad3645eef998",
    "01138f09d0764d9c85d2aed3187a90fa",
    "6e0a3f2b67b84c2fa0461ef3cab55abe",
    "6a8636d997324b1db431d6fc6af44905",
    "a5b6de425fb4442db2f3bf295d5765b0",
    "d927efd0f9014dc2ab8973900ebc7a35",
    "7b9dab73070d4223aa9ae1833bbf8af5",
    "7ba270ecfd5149ffa636d0920afae738",
    "bdbb730e2ece45839c1c7347b9388935",
    "e5624ac536d845f09fb1f86a118bc492",
    "837173a1fbf94446bc0184e0d5e8472f",
    "db0c1eb9509f4ef893b8cc6aeb31675f",
    "04effcb9c8454f458ce4f55ff7911127",
    "e96dd3aebdc3466482c105d1cd679f8f",
    "aacd43aa2fec4142a720ede47e288cbe",
    "dd9cb3f97af8457495e3b314bfc7f449",
    "f9afaf61e4924710aca295eb8b7da407",
    "9e82bfeb0ab94085b7752007a178026a",
    "8ecad2929f2c4634884a5e9a284ee805",
    "f0903c045ee648fc8300158ba0229a0e",
    "eb10d2ccafe64078ab87225111638454",
    "c3a12ee8bf374c7485fca305e93f21a6",
    "74ce62bd92a745e6a14f2166e8e0498e",
    "0d3d85905e264b4fb0dfaa9484706d56",
    "82fc3625e05a4b8abe0f6287cf7cf3cd",
    "d21b8c46c9a746df8e09c7796eccb97e",
    "465d09011d874e3c83ad6ef3e9e45e1b",
    "afd03205a51d4b45b3547472ad4607ea",
    "0792d0d380ba4b07a6b8db772b6fdb3b",
    "fd9d02d38bc940abb2ee1231cca50267",
    "742c1f55137a460bada2fe0e7aa6286c",
    "51ccdbaf3df449bb88d7c8066d30477c",
    "2dd2ccbaa58b4c1889a0fefed2cd098a",
    "434c57c23e4e4491a1debde5ec8c0e98",
    "c4069eda3b874672bc22a18b92b0085e",
    "2c1447e9c5d04823aadd3a3f295b040d",
    "a51d7ee7e065470981db787436d966d0",
    "68fae3e0130545e48a7793da954b0935",
    "3dfabce7da814237ae27b4a9faa9ce2a",
    "13dc4b7462564bd7a296b9999d711f80",
    "95f004bc81484b54aa39e04bc437d1a6",
    "6d22075f52cb4414810dc79edcffa5aa",
    "8fb7a34f6bc043f2b4c0e85644c7773b",
    "03b167b1a41e4c018648a90be067f1c9",
    "06024f6780a04e3db1d31026b0bfdddd",
    "b95818f31e654c778d59d48bfda5c40b",
    "12fa9fc0b93840779233a24781599bc6",
    "5674f162b46e4386b463c6b86e390e12",
    "e36003258dc94e75bec227cb8f485cd7",
    "34d61b531c5c49c1aedaa001673acc1b",
    "c0bd4698203c43f99bfd29f49981f978",
    "d8640c9484f1429d9af29d9c30d18ccf",
    "2265cac995e941f7b2ddf3543d6631e8",
    "29ad257ee56f4f9da7adcb2283a4f7e9",
    "1ea3fc3391d34d4c9a7046a987a13f3d",
    "57dddf5bce634bcd9aea457a249f234d",
    "7ee55d7109954e2ba3545d2c242298fe",
    "b3df9267f1434e268f4ac2a48d0d9d52",
    "72dd64a6420d44a3b4948e5a88558188"
  ];
};

const getJobIds = () => {
  return [
    "1b91ed81e3414c84ad3e2e4402b44ad1",
    "29978b1b6dc540f1957b8ceb16715658",
    "2df4e512b9874cb89440043f2f6590ec",
    "9a64e72123ef48d3b565654098d56c34",
    "ea940431f82741499cd5fb97229c2857",
    "d02d4bbbaa56432f9f37e9ff71ee6ba9",
    "b0942a9ab5664651b269938459d96d5f",
    "ce451128ba524e7c8303509d6b8c083c",
    "50690c02766d499a9da3fb156e4cfe0a",
    "7e0e7f8c40264c989fb8d10922a08bd8",
    "1eb933257d8d41deaa8199b07b43460e",
    "bec858717b6d4c348a494da37f121187",
    "2739dee640f4409d83a938b8f9acfa2e",
    "429ce6352cca495988e65be92ae20fe0",
    "a56fdfe2aaa0496b9738a3351a4b51d6",
    "ccfac96aecaf4f98bb6d119f0f854e1a",
    "aa1db5920f4e44fb9755c6807758f169",
    "2e2aa7dc13c542179559177d265f2183",
    "fd4a7334cafe485b829ed1bd1c5dcef5",
    "c9929b7b9cb74e309a2bf43120392e52",
    "e5465e26e5c64c6f971276f242d48814",
    "8027ef5be199472f97865926c059eeaa",
    "9a69a7f86f684ff6a0fea112e321a529",
    "ff0f2c9d90244b849e93809d68034847",
    "7d79f232d8ab451ab61fe6627f50750a",
    "78b9d9a36f244335b5ecc7de7b76bdc6",
    "f1f85d8eb1b74532a5c68c7d1e2154ee",
    "f92ffa00233844bdbc86b630fcf5a23d",
    "83a3f4ed4d0b4a039b3621a50febe89b",
    "5aaf47660a114d32b5e49804cc5aec22",
    "9034583decbb43948bb053ef42e47fe3",
    "3863227e2268492c95d468566b8c5b67",
    "71eb6d7231344a97828f2741e3a43cd2",
    "700b2195607741cbb19ad28c2ed35e23",
    "884ad87b84ee4214b413430ffc2af84a",
    "b333675864394fb08cb715e5744a6124",
    "34fe04a379e74e62b9d51b6dc87f3fb2",
    "c0ae5561aa5a4350aebc56de81b7f777",
    "8b77708d49de49d7ac4affc2116fcd20",
    "85b9d76e08ec4e21a7a5317a0e10fb2d",
    "e27b3a6ab5e64d6c8c413352b7f7070d",
    "0bd635ce433042e0b01dfb8775264508",
    "cd54bef455474e269d950d8fb887e675",
    "8bbde0fb626e49c0a7f09ba5f95b9f6a",
    "5f80d229f0294b2698985a47a7af0ce6",
    "0ced27311f5744ab800fecf5e4725a69",
    "5ee8fdc4a4e7425f9fe0e7db490958bf",
    "2fdf44b525704f6cafe8334d72f4b029",
    "941918037f37435cb4bd8e724e63fd58",
    "eed1c9e53a2f47698cb3ebb3a08d9578",
    "4966a1dd81e647c8bca12f4c95ed332a",
    "883206e22b844b8885f94da349786271",
    "4714fafd46474b30954d685f2bf85bf1",
    "ba342edf7fe74728a23f99cd08f06b60",
    "d0ed6aa1adfa416ebf1b748f336e3e47",
    "f1655c4430ca4c65b451980bb8343793",
    "0b864e7050e845e4a135b9d098a43a1e",
    "72c777fbe2294af187b58d84ea79140e",
    "b056582dea8140f4bd034f18b6af67b2",
    "d4c495ee7ccf4e4b99f2610dc282acef",
    "d43e1d70b2e3432a86b98b4c2516b6a0",
    "04241f8d6bf74703aac96a5642c9df69",
    "bf678fb56d8f4c13a91d9705f6f2e2e4",
    "4aff7d2094404bb093e97abfd1358720",
    "094d34550e03402f99115d171786cb7b",
    "e6962961ae7b4254859732ad0f983b8e",
    "55a0b910042a4bf09fa02e18dca3b703",
    "d14f30e7ba1848a9be7e25c8d2abe089",
    "bec99b835dc843198398b3ec172fbe69",
    "d3356a317f474be883d1679f46359a77",
    "c6fc9df66cc14c0eab6b230f7ac58ab9",
    "1001596f659d40018088d9ca43149697",
    "30b5738c9af342d5bf7fcc343ed537ce",
    "de6e73eadd1b43b28a65b7100cb6bd65",
    "2a6cacc1e2294ed39c096f476d7fbfb6",
    "78a76c0375334f1ca53ac4047f089f0c",
    "fa9a5983e9d647c594a6d1c88ccec6c6",
    "7c695cdbd4794fd6afe3566f5d6a7355",
    "fd9229dd1d5f429cb5c306de4c783212",
    "001b3d5b3e634d08ad26a74f204c1d98",
    "597c839175a44cac90d2da284a7ac937",
    "ebc5cf6a64f746ccb08c2ad0eace9bd5",
    "ecbfabfe1f814f3c9a70e25f881b46b6",
    "5fcf92a290b54a78ac5b633ebfd5f069",
    "b3fccfe844ad48be9eea42a35cc3508b",
    "4498475412c643aab7360cf2e0622ff4",
    "b2a20d68741b4fedb44bc260df0bbd5b",
    "3ee92df273b44cb9a555827007505f80",
    "5472d440adb844e5bf9b5b43369da1ea",
    "3dc15e0379ee4545a7a697db59e7b9a1",
    "8b20daf006254b15b856a4f1ff763cfd",
    "b72c43e6a63844daa2ab688d522b5841",
    "c402ca2ecfd9484ca31305d2bb61a61a",
    "7007e6dc805c40199f01e2b6ab140565",
    "431f9a1e6d514ad9984e917daaccb392",
    "a94fc470537044c2b10b1a1802bbbafa",
    "4d959780c75e49ccb0bc278446f02cc4",
    "16883983e1e4482f94f02ee67c5d731f",
    "1def2529d49d42fab8ab2bfa7918c269",
    "b2463246eb1f4b12b38113dfedcbbf62",
    "947da89eba7540ad9ca51bafdd6874b2",
    "918ac12e4afc4f5aa1e86755deac790c",
    "6ce2b88d62bd4d50b23afe29730f0a7e",
    "a6fdcc80219b4813979051f90755dc2b",
    "1dedb23dd1874898912dc6a99d9cf6fe",
    "435bbe3770714f1d95313945b7024d76",
    "8740286a931a4e25964e3731fe3f76c7",
    "a6855748d528441d891a349f841487fa",
    "363ef27aa76c48c599ec95934c7346ff",
    "58af9e5a6da04c98aac2514594db8cbb",
    "9907cfed8cc949b1be44ee9e52819e3e",
    "38ae49a7a0f14d71b036374320fa5a89",
    "7b57e670755647039c9e35095d1bcc80",
    "71cdd6280ac14077bf4972184e458d5b",
    "dafc4093d0874764939285c91bba70d9",
    "35d9659edfc643acbc7c86059401f910",
    "c6a276f4812841279a42cd9685bdb569",
    "a2b7bbd76ea940f691b62ca0955bf005",
    "e392f2b681b44d5c85f52a656f466b80",
    "06e113a621cf40bd98971752e938efe9",
    "46c6b98cd6c34736bc25ff346e785978",
    "2a26fb52da4c40d399bc240efc3895d0",
    "220062fde7104d1a9c53dc06e3a90b22",
    "81ee1bb2e87444e89f2931afef7d62d0",
    "a8d0aecaf1f44f37bf49c840989200ff",
    "75bc43a1437c447ab7475b78b518407b",
    "9dd8bf38bd46421494c56907363bad15",
    "9ab50850fff743709f8d67042e97cde0",
    "34298377c1a344a4b1487f63b5f4712e",
    "206be193594d4f59aaa5053bbcdc65da",
    "30354bbbc0c34223a04d137521a67eda",
    "37f8a147430740f9961dae3f48e1481a",
    "bc083436288b41618a333dbda83f5ea9",
    "e3af6760a5ed41f0aef3de9c0019864c",
    "13c6b8c6386e42d7a0e5df9e839e02f7",
    "f255ed02f7a8492f9b7979510463fa35",
    "deacf73431d94d2fa64ec4c2063c0392",
    "900f0f7eccd042cb8992adddf1498623",
    "f945fafca40b425d8bd873f558ff16fb",
    "2c20de7d5be34e19930c33e359057600",
    "701203607b424206b751fcc1c025877e",
    "b8146da767344241ba4698fae2b4f76d",
    "ea4d45bf79854879aaf6aedebfa2303c",
    "c76bc7e8a20546249ee07f38507ede52",
    "9e48c67e64a74cd6bb905f73a0b56c93",
    "9450189debd148f2a8c3ec53ff5f3626",
    "2d8bd55c7ece48ecbba4b27a8709d83e",
    "5c47d73fbdd0454f8222274a818d943f",
    "8a756dba45d84bf19c67731f05839083",
    "ea43e46167fc439d88a00423ec9e1ebb",
    "48a4c569b47045ee9724b70a1dac121a",
    "cfe19d7e8d864c65a2ad7b5a4bc0820b",
    "375a1ad6a86a454c92aa0ce4bab70105",
    "d18f04a1d5af4518a10da6125edaf4d6",
    "2f9c00eff0df4d5bb8a0d601a3308518",
    "141c53d3dad441f49e55951ea1a5d1e7",
    "37ce55c5b1b94c10846fa352f8372d86",
    "a98d7fc338944e789edb760250a8d392",
    "628bee36d90f4aeb9f79751bf4be8f98",
    "2d6935eb13f24edd923b94cb3b87ce1f",
    "a090d366c07a4867a11a73cfd2f4dcae",
    "634cb77e35144ed2bdaadb6d27eeccaf",
    "d3a0890773344d918e58b6d0223a344f",
    "aa2f75616cb44993b4226867448ef6a5",
    "c16db1f050c4421aa952c4f7f72b56a1",
    "a98783bf023c488999a010669e030d76",
    "6127caa5e2bf4762bc953917a1739580",
    "e405d0899ebe4ea7a7bb9c650a4285c3",
    "cefdcba71eff423cafafa4784b58f890",
    "133ac73b10a447c98dce0628988849fc",
    "e9c928a74b4249c2bc37c558ad8b0b4f",
    "9c5e878e46b24be29e80df6a21e04c46",
    "72dd2bc88d624498a562beba1a771aa1",
    "544f4d2370a243fa8eb469d008de3b9f",
    "c771458a86344374907914cbfa0228bb",
    "dbf40981656d4bae8b0a991bb9d4a577",
    "95c9279c9346400fa24479f87b19ce58",
    "fb26f4ac689a4c1e9ce23a35684fbecf",
    "179a1976dd6d49aa839f0597a1d8b755",
    "fc9ce1cf4d514d5c84fd147b616fb4cb",
    "93fb9d8438684a0bb9543c88fee150ec",
    "77ae8c9e68d7403d9f82def53d2f4e20",
    "8c87dde01bc84dc98edcfe712d0df2ac",
    "868cf459946f4df5ae43f33b78eed15c",
    "41d43235b01a4a12b1ce5e7d33dc72fb",
    "153170a9df7948238514126401449e69",
    "ddc6283f79204f219e970cdd5733da00",
    "1dde48130ca647d8bdd6a2402ee94053",
    "63dbfa69520243218de0b2eacd2f6cb7",
    "8ce9c525b33e45e088076ef29d5247c8",
    "9f8ac25b7a7d4d89841fcbc003829e53",
    "b0a321ff40e946418a336d7d99a4e41f",
    "5fed6a165c7a497ba979649705b01ff2",
    "2120ef76556a4fa0a6c50e9c92178fab",
    "89da1d300e4c4ce0a576cdaf2ec44fb2",
    "b28c9e83f0bc4f95857b29206547c393",
    "da7dc138f237474886163f1fb425706a",
    "f9b46a00ca6e43d8a8d3a298af9c8fa9",
    "2c1ce4385ec34fb88f137605e984a99d",
    "359c3dbfab09406e9383f79108af6ba5",
    "441b49c2402742ecb05e8671b539413c",
    "8d915267e7824d99aafa979116348df7",
    "a62e5052b63741c79c46c40d7a68ca16",
    "dd7368bc95eb4d1989bd87417ec9bc97",
    "09bfe0ad5c3d46488364f1e4073819d6",
    "d2f0c5b409a449dab1c07b77bbc5e872",
    "a8347fda851548dca1c0b923a7384c54",
    "c893baac7bc44bf6aae1be826aeb562d",
    "9e3424371e514740ad1c046c981a48fd",
    "de72ac9a9ee54cb48a34c612dd2a6351",
    "bd57709b7ece44049c79ad029697c779",
    "e5c82bfc24de4231abaaa35e76d2f5f1",
    "9efd2df6b78e4b2eaea524393e03a452",
    "293554584a054c9e8ac318882629ece7",
    "3bbcc96ce0c14915926c08dfed87aa89",
    "78da82ff99e94e7d84fb7aff7dc2a7a5",
    "d52227dc9a7a42cabc788422654d6c00",
    "217f2c9641774833b7b71b79f313d7ff",
    "58f85078dd704c619846a2f60eb091f5",
    "bb85b65adeb24ebd890f46318d35964f",
    "d22e1b4c001b460b8aaf2f71e106f365",
    "d88d8f52b8304f9eba1e1c1ad58894c3",
    "a27e761617d54e898800d83d64c97ba7",
    "0506830a19d54a889507b6d8a5331090",
    "3cf9505b4b4f4058bb3486e445fd309a",
    "d8262bf0b3af46bc987f940d69727996",
    "94c3897a411a4d67866665ddfcc6b1cf",
    "0bec0b1b4a8140f0bbe61cd08ad8bb42",
    "0a14437bbbe94cf1811c4e61f4890f2b",
    "96106d9f997d40048bab06bcab0e3afa",
    "cedbe97fade643be9f5634ce4f774b0c",
    "ade559a7c7e54a0dae6fe229bae3f11d",
    "7eee50cf796248a089cc3cef895b08d6",
    "91e41edba98b454a8ed67dd1e55d741e",
    "c0e0d18737994eb08c7bdb32f302554c",
    "84c5b7d598af464ba8428652948c7eaf",
    "60c9b8c5b2f34cbc9cfe4b8028501a0e",
    "b38a6339c81a4d80aa33bb036d16190a",
    "6cd50173d62a44b6ad81aab7f4197243",
    "515c51f6df49438ca729d67f97d197a2",
    "40db4652b1bc4dc883b011bb4ab6628b",
    "9079595fcadc4e42ac82b2f36ba3e160",
    "2661dda4e20448368e7a6b073ef29378",
    "9dc8e9e9b30445d8802e725f9f95e257",
    "d199888bfe9c4da99979125789bf2a3f",
    "ead9173e70c549fbba8f374736f230bd",
    "ce9ced43c2a24b978523e624340b652b",
    "a6ec611678ff4f288270cff7c51d1fbd",
    "c8469dd17df94e2f9abf6da13298366c",
    "ec33eeb885ad47029583969841777614",
    "df7cd6d80da9474dba42195a52e00a3a",
    "075ba1753bc94604803e045100e5415e",
    "4d3463e12d6a4c468145c93fe5844e1c",
    "9d724dce690d4cb19e80ce73e2962825",
    "ceb2889121ce4ef997b3944680b89ca2",
    "9df86135756e45a5a42fb4270353a2d7",
    "efdde8b9ae9545c0b22d9d1427d20e33",
    "25eae3be7e3c49f4b20bd1aa6b7d6b3e",
    "a598558d202246daacf65dddb656c42e",
    "8db13d9f809f43e7a00583605dda335f",
    "ae7869c81762414894a053089ddcd75a",
    "d40ca58d46a8406992c89ff9d6dbffeb",
    "08f579e81d2842439351d4baa5679a56",
    "3cf84c0acb734466b8683ef7e3ae98ca",
    "b4284518d7c04426bc7f60f2536413fd",
    "8ed94cb416554e62ae02f93451383c72",
    "0e6da22f9471415f85d1f26172bdeaa5",
    "d68b96f5027f4647956ccaa8f6cff4c2",
    "f8498234e9564edb87e546a917dc5e41",
    "2b90d57d2e864940988828e6d4be396f",
    "0466d3f7b1fc4f55b84bad81a64e3eaa",
    "6f3a88b5efe446ffb65daba516fe96b2",
    "e5cbf33bd43242db86366f8760de5264",
    "42660114e5664870a4e78cf6252401fd",
    "ca6f99dd2b074779b81b21dde2054018",
    "74550df3925449ba8f6fc06b8142a1c0",
    "32ae83fea565484580601e3ac1097bc5",
    "bc01dd1a87f84d2f9eeabe1104711ffb",
    "5f2a872b74384991acb212537a20d6ab",
    "9af2d3950861482f8550b365180ab73d",
    "1f830f73fc07402aa50d84491234d61f",
    "7d1f8de57ee84de38ffd366eea5ae765",
    "0366609b30e741458f1f87732becce4e",
    "d93ad2b42cd4495d8d0da705ef09875a",
    "4af80df3b5d842c8b8e649ba29ae14c3",
    "b8627753dbf04fbfb3780fa37729e4da",
    "0f9b528e47f64b8e9a7a2847a3d98415",
    "f6520f89fdfc466e9d07117a75a9100a",
    "53c76d97710147f7a9ee308e1d53834c",
    "8fa5ce54c45a4b88bdc4fa1ea576def3",
    "b9a0c8fc186343a7a2643c3bad48beaf",
    "ad10a3641ce449b6a2a4bea2b36a5af3",
    "4decade2cf724eafb4cf72747bc0ec60",
    "c804c6f2daf44e9e99c00750d5c26a6e",
    "987701b153204320803361413a747db1",
    "45db5b66f2e841068b0ef21683fc31f8",
    "84d750dbdb0c4fe1b8af89ec5e03a765",
    "063ff862638b4b60a5cc6a3b2bc925cd",
    "b566cc7991824219ad759ffbf1e7d5fb",
    "c5e86e1553ce4f6fa85b64ade696a086",
    "0e39afc3e0434236b7955c36b1b66aa8",
    "b1ab7895e27444558173e4c99e9095ab",
    "4d7be89cf3864f8bb9dec41bb8a917d2",
    "a41c48f181bf4d01a6b93e76df2f5025",
    "c111f7fc35e34898a8dceb248e3643b2",
    "6df73fe441fe4d7baf706803877bdd91",
    "30eac76702ab493fbb82fca59522dff7",
    "54d1573401ff4d329be599bc795b1372",
    "d2d0b92cf41343618c96735fdde11fe2",
    "c043144bf73c463db7901c8fcb2311dc",
    "4f163b7e95e840a68b7972448868641a",
    "d297694f6160438c946fe785adf90954",
    "609f5ae4c3d74f3183d4456fbb1c9aef",
    "1fa6ee1e57ee4d00bc7d8b5889bd8779",
    "71412ac006f34c288ffee3e1caf8321c",
    "f5b9efd1ea654007a007130f9a555f4d",
    "c6b71595bc85465c96cf82aca58681fe",
    "c2206040f8ec435ba2efa09e019c09e4",
    "b94ec2801fab4a3c80b8e45b53b739fe",
    "4dc39cc5fe684e8b930199ee51903281",
    "53356c049aa5443ba27ad123568bf350",
    "bd14d947dfc948feb4bd0eb3d71a61c6",
    "cb5602906f2d4850b45b1b2a13c3f4c6",
    "cb7a5263bdcd483f892903d3fc579df3",
    "d3176087509f4112a905c449cfd6e2c5",
    "a581424c80ef440c94e336dfde617f19",
    "52b25bebda33442380dcd267632f0ac1",
    "38762946e71d47e096b90ea5e2aea21c",
    "c2ad4823f30e454eba7d2cb55ea20c03",
    "2d56e6f815d34ceab6fe0dd71dd119e3",
    "8ec5e33773df4d039f0e51b3e0a0ecbf",
    "13b53c29dea44ffcaa026685415e2466",
    "142eeb30e2c54f0bb9db8850e8b2d93a",
    "9a0519787ea14718a326d06d3bf0fd49",
    "f6f184f9ce41418bbdba6586780743fc",
    "f98700e8151c43df832a0715fb8d67fc",
    "8209a8d86f474d60912dbea99ab0a505",
    "649095d636fe49b58c940b879a5b99d9",
    "d7af58f9804a42f8978ea8d9f53f5700",
    "218ed343fd064302b4337275e1308d60",
    "69945ca3f715404cb431c525d2d79f8b",
    "8e443bcbc63e42da9f161ef48008992f",
    "753a990e5ab9476bb9da5518912ad0ab",
    "ab20e5509d204cd3b84349828ca1b5b5",
    "2a6625ac73364d498492c12e82803720",
    "000ef08f7c054b69a02da9a3400e7d36",
    "d371e73d18be49dcb210b853417d069d",
    "8a15dd7f2bbb4c8dbb736eaeba394161",
    "7298a821b82f4dd8a5798e7d220ba2c8",
    "db0747ed6ebd4102910fcc45a8c3efa7",
    "b2c390ac29554ffc8353c1ebe39d0e4a",
    "d3381ab1d673486997b1a6d2256625a3",
    "e8987249e80d4ef5af6af4abf3f2e716",
    "dfa836e6a1d845938503551f8436337f",
    "e6b295018b8e4400a6d1481dffacd2bd",
    "a103796b30204152af7f5dd80ba94e56",
    "8a7b7f02d85e4a8587f1664f3f5c474f",
    "4c66723b527b417f9b6e639b6420055e",
    "e47f9fed68de4991a8ddec8a7620841b",
    "0350409b2c77439db3e1a8b2e9e8ee24",
    "8d35ee1ba11546a4889ac0d6a6727416",
    "96e4645490334a3b83b4dd041f3c8710",
    "db1be2dcf4224f1192921fd4198514ea",
    "3e7acea028b04cd99e6685ac8176471b",
    "2f2fcd0c5b094962b37210d50f5f640c",
    "03b68ec72a804dfca963921cf322d8f7",
    "f969614bf6504206a3464850ba14a01b",
    "0d95fa0f4cef419abdd566f69ce364fd",
    "d2b9c243efce4f91814ad98fd3eabeb3",
    "e731168ba85d40c1b89316bc63d7b7bd",
    "c9a243c9d645472da348dbecfff96811",
    "0e0612b55bc64422ba8791f928ef3484",
    "ae7fbfd77db74bc7b29176f67c5236ed",
    "9ed2e2f3a15f430c8c7747e4c075f8f3",
    "c9d3f66d3c414d4b8f3e64221c79d836",
    "0b3dc437320c4428ab2e38748b21402a",
    "9fbfdc35c27e44e18ea4f85e048e2490",
    "3fb424a7f9b64dbaae9b1ed3754d805c",
    "733ae5b0f1c247629fae783283246477",
    "b75449727dc044b1a124d26e4cec24aa",
    "c691bf7d98de402e8c73ce99a3abe42a",
    "9c027a7be24d4815b1946a72e52c3bed",
    "25459ffee2ae4f8ca7d029285d6237f6",
    "4a57e23cc684478dbfb5e67185d2dad7",
    "355746da3c144b3996e42557fa8d41f0",
    "32d92087ab6a42c58cf4e38aa163a78a",
    "24494ea6a63049e19a701b0a1c373e55",
    "99046c95378b465db41424754742b622",
    "ec2790d4880a4968953aa366bbf8295c",
    "e04a5c2a5b5f4520877114edc58066b5",
    "f245dde5180a424dbe27a7e12661b3b2",
    "904ffd1facec42c9b4be4c0b372f067d",
    "8ded8eecbfdb41f6aac0f2bb16a53c8e",
    "e7b439e9afed480c86a8448d384a81fd",
    "43fc3ada7a90488c8d6a1ae78c9a8193",
    "5cedf6a04a2e4be49737ffeef0d7cb7f",
    "7179cc39e7b54ee08b038fa0a653beea",
    "afd054504fe34345960d4f2803898c89",
    "7f1f1c98aef641b8aa72a6b8b17554b0",
    "4979f02775e04066bd42941ae92225b9",
    "0626e3034b8f4f6eb6c5d4da17536c4a",
    "c0b90e60b90b4bbab69e66ae42a91353",
    "d901bcb8e58f4766954301b9f9ef942c",
    "001a934889d148c09389b51109b148ec",
    "04589ddbe81c4884bfbc808446fd2017",
    "a04f76e06d1d44ebaf0ce69109776432",
    "205ab5e948ff440bb74d4d246615be53",
    "a36d261aa60f4723aea43a247860e768",
    "cb6a78fcc7364547ae9c98fbc61bfed9",
    "e61119b0757742b5bd760f1cb766ee16",
    "965e75d4b0de499a8a2377f4bd389cbb",
    "438e7a67546b4900b383362e8541134e",
    "bb802e72299942eaac29f22aa4abc9c6",
    "f4d7b72371d94a28ae096a1a378c3468",
    "374cf2522c6d460f8b9056dca6b69de4",
    "5c0edb3232bd4b5ea95f74b90ff81068",
    "eeddd9d7a15e4007a179e4320a765aa8",
    "b1243628aea24733ba17271621484a71",
    "dce6a6a870bb4c29a8c28a51d9bc2485",
    "0f5cb5902eb84406be88225eeb5305cd",
    "b01d7a0169b14e05b0c684389b068d0e",
    "c7e911b115164d9ab2d18db90a73e8e8",
    "8103f600b7784730b52ba87e5280167b",
    "8af26213f3a4479cbe111bb091632f4f",
    "b59597ddb8994f7088091765699af88f",
    "b39707c6cc644be0bb4187f4548d958c",
    "e4221b3350274cb699a6cac6b6d196d0",
    "aa8bcfa6c07044c8a13531461605dd23",
    "33d2beefe5894f09836a36c69e5d612d",
    "80101d482ebd47a88f10cb1aed550ee9",
    "0874ec6a78f746b79e23ddedece1b20b",
    "ec40aa47ee324dc99b7e4c0ccaad6329",
    "9b3db57d287e46c6897617eeb711c01d",
    "43884992c2764059ab2b065d046ab49d",
    "f25daac2c3384858b999885a4adf1d07"
  ];
};

const root = builder
  .begin()
  .declaration({ encoding: "UTF-8" })
  .ele("urlset", {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
    "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
  });

staticPaths.forEach(path => {
  const url = urljoin("https://milk.jobs", path);
  const urlNode = generateUrlNode(url);
  root.ele(urlNode);
});

const teamIds = getTeamIds();
teamIds.forEach(teamId => {
  const url = urljoin("https://milk.jobs/team", teamId);
  const urlNode = generateUrlNode(url);
  root.ele(urlNode);
});

const jobIds = getJobIds();
jobIds.forEach(teamId => {
  const url = urljoin("https://milk.jobs/job", teamId);
  const urlNode = generateUrlNode(url);
  root.ele(urlNode);
});

const xml = root.end({ pretty: true, spaceBeforeSlash: true });

fs.writeFile("public/sitemap.xml", xml, () => {});
