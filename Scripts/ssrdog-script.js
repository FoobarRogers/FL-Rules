/*
 * SSRDOG：读取传入订阅的 proxies 和 dns，应用本次 OIX 统一分流模板。
 * 结构基于用户提供的 OIX 模板，FL-Rules 增量更新于 2026-10-30。
 * 与同包 OIX 脚本共用中文显示、地区识别、应用默认出口及 TUN 设置；DNS 各自继承订阅。
 * 节点随 SSRDOG 订阅更新；63 个远程规则集按各自 interval 更新内容。
 * OIX 新增/删除规则条目或分组不会跨订阅自动同步，届时需更新此脚本。
 * 本文件不含任何实际节点、账号、密码或订阅链接，无需依赖另一个 JS 文件。
 */
function main(config) {
  if (!config || !Array.isArray(config.proxies) || config.proxies.length === 0) {
    throw new Error("SSRDOG 脚本需要订阅中的内联 proxies 节点。");
  }
  // 复制节点对象；下方另行保留 DNS。协议、服务器、密码、SNI 等属性完整保留。
  const proxies = JSON.parse(JSON.stringify(config.proxies));
  const normalNames = proxies.filter(proxy => !oixIsInfoNode(proxy.name)).map(proxy => proxy.name);
  if (normalNames.length === 0) throw new Error("订阅只有流量/到期提示，没有可用节点。");

  const profile = {
  "proxy-groups": [
    {
      "name": "Proxy",
      "type": "select",
      "proxies": [
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Domestic",
      "type": "select",
      "proxies": [
        "DIRECT",
        "Proxy"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Others",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "AdBlock",
      "type": "select",
      "proxies": [
        "REJECT",
        "DIRECT",
        "Proxy"
      ]
    },
    {
      "name": "Netflix",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Disney Plus",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "YouTube",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Max",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Spotify",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "CN Mainland TV",
      "type": "select",
      "proxies": [
        "DIRECT",
        "Proxy"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Asian TV",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Global TV",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Apple Push",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Apple Services",
      "type": "select",
      "proxies": [
        "DIRECT",
        "Proxy"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Apple TV",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Telegram",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Google FCM",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Crypto",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Discord",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Microsoft",
      "type": "select",
      "proxies": [
        "DIRECT",
        "Proxy"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "AI Suite",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "PayPal",
      "type": "select",
      "proxies": [
        "DIRECT",
        "Proxy"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Scholar",
      "type": "select",
      "proxies": [
        "DIRECT",
        "Proxy"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Speedtest",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "Steam",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "TikTok",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "miHoYo",
      "type": "select",
      "proxies": [
        "DIRECT",
        "Proxy"
      ],
      "_nodeScope": "all"
    },
    {
      "name": "hoyoverse",
      "type": "select",
      "proxies": [
        "Proxy",
        "DIRECT"
      ],
      "_nodeScope": "all"
    }
  ],
  "rule-providers": {
    "AdBlock": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/AdBlock.yaml",
      "path": "./Rules/FL-Rules/AdBlock.yaml",
      "interval": 86400
    },
    "Special": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Special.yaml",
      "path": "./Rules/FL-Rules/Special.yaml",
      "interval": 86400
    },
    "PROXY": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Proxy.yaml",
      "path": "./Rules/FL-Rules/Proxy.yaml",
      "interval": 86400
    },
    "Domestic": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Domestic.yaml",
      "path": "./Rules/FL-Rules/Domestic.yaml",
      "interval": 86400
    },
    "Domestic IPs": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Domestic%20IPs.yaml",
      "path": "./Rules/FL-Rules/Domestic%20IPs.yaml",
      "interval": 86400
    },
    "LAN": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/LAN.yaml",
      "path": "./Rules/FL-Rules/LAN.yaml",
      "interval": 86400
    },
    "Netflix": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Netflix.yaml",
      "path": "./Rules/FL-Rules/Media/Netflix.yaml",
      "interval": 86400
    },
    "Spotify": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Spotify.yaml",
      "path": "./Rules/FL-Rules/Media/Spotify.yaml",
      "interval": 86400
    },
    "YouTube": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/YouTube.yaml",
      "path": "./Rules/FL-Rules/Media/YouTube.yaml",
      "interval": 86400
    },
    "Max": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Max.yaml",
      "path": "./Rules/FL-Rules/Media/Max.yaml",
      "interval": 86400
    },
    "Bilibili": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Bilibili.yaml",
      "path": "./Rules/FL-Rules/Media/Bilibili.yaml",
      "interval": 86400
    },
    "IQ": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/IQ.yaml",
      "path": "./Rules/FL-Rules/Media/IQ.yaml",
      "interval": 86400
    },
    "IQIYI": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/IQIYI.yaml",
      "path": "./Rules/FL-Rules/Media/IQIYI.yaml",
      "interval": 86400
    },
    "Letv": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Letv.yaml",
      "path": "./Rules/FL-Rules/Media/Letv.yaml",
      "interval": 86400
    },
    "Netease Music": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Netease%20Music.yaml",
      "path": "./Rules/FL-Rules/Media/Netease%20Music.yaml",
      "interval": 86400
    },
    "Tencent Video": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Tencent%20Video.yaml",
      "path": "./Rules/FL-Rules/Media/Tencent%20Video.yaml",
      "interval": 86400
    },
    "Youku": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Youku.yaml",
      "path": "./Rules/FL-Rules/Media/Youku.yaml",
      "interval": 86400
    },
    "WeTV": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/WeTV.yaml",
      "path": "./Rules/FL-Rules/Media/WeTV.yaml",
      "interval": 86400
    },
    "ABC": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/ABC.yaml",
      "path": "./Rules/FL-Rules/Media/ABC.yaml",
      "interval": 86400
    },
    "Abema TV": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Abema%20TV.yaml",
      "path": "./Rules/FL-Rules/Media/Abema%20TV.yaml",
      "interval": 86400
    },
    "Amazon": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Amazon.yaml",
      "path": "./Rules/FL-Rules/Media/Amazon.yaml",
      "interval": 86400
    },
    "Apple Music": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Apple%20Music.yaml",
      "path": "./Rules/FL-Rules/Media/Apple%20Music.yaml",
      "interval": 86400
    },
    "Apple News": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Apple%20News.yaml",
      "path": "./Rules/FL-Rules/Media/Apple%20News.yaml",
      "interval": 86400
    },
    "Apple TV": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Apple%20TV.yaml",
      "path": "./Rules/FL-Rules/Media/Apple%20TV.yaml",
      "interval": 86400
    },
    "Bahamut": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Bahamut.yaml",
      "path": "./Rules/FL-Rules/Media/Bahamut.yaml",
      "interval": 86400
    },
    "BBC iPlayer": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/BBC%20iPlayer.yaml",
      "path": "./Rules/FL-Rules/Media/BBC%20iPlayer.yaml",
      "interval": 86400
    },
    "DAZN": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/DAZN.yaml",
      "path": "./Rules/FL-Rules/Media/DAZN.yaml",
      "interval": 86400
    },
    "Discovery Plus": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Discovery%20Plus.yaml",
      "path": "./Rules/FL-Rules/Media/Discovery%20Plus.yaml",
      "interval": 86400
    },
    "Disney Plus": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Disney%20Plus.yaml",
      "path": "./Rules/FL-Rules/Media/Disney%20Plus.yaml",
      "interval": 86400
    },
    "DMM": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/DMM.yaml",
      "path": "./Rules/FL-Rules/Media/DMM.yaml",
      "interval": 86400
    },
    "encoreTVB": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/encoreTVB.yaml",
      "path": "./Rules/FL-Rules/Media/encoreTVB.yaml",
      "interval": 86400
    },
    "F1 TV": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/F1%20TV.yaml",
      "path": "./Rules/FL-Rules/Media/F1%20TV.yaml",
      "interval": 86400
    },
    "Fox Now": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Fox%20Now.yaml",
      "path": "./Rules/FL-Rules/Media/Fox%20Now.yaml",
      "interval": 86400
    },
    "Fox+": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Fox%2B.yaml",
      "path": "./Rules/FL-Rules/Media/Fox%2B.yaml",
      "interval": 86400
    },
    "Hulu Japan": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Hulu%20Japan.yaml",
      "path": "./Rules/FL-Rules/Media/Hulu%20Japan.yaml",
      "interval": 86400
    },
    "Hulu": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Hulu.yaml",
      "path": "./Rules/FL-Rules/Media/Hulu.yaml",
      "interval": 86400
    },
    "Japonx": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Japonx.yaml",
      "path": "./Rules/FL-Rules/Media/Japonx.yaml",
      "interval": 86400
    },
    "JOOX": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/JOOX.yaml",
      "path": "./Rules/FL-Rules/Media/JOOX.yaml",
      "interval": 86400
    },
    "KKBOX": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/KKBOX.yaml",
      "path": "./Rules/FL-Rules/Media/KKBOX.yaml",
      "interval": 86400
    },
    "KKTV": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/KKTV.yaml",
      "path": "./Rules/FL-Rules/Media/KKTV.yaml",
      "interval": 86400
    },
    "Line TV": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Line%20TV.yaml",
      "path": "./Rules/FL-Rules/Media/Line%20TV.yaml",
      "interval": 86400
    },
    "myTV SUPER": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/myTV%20SUPER.yaml",
      "path": "./Rules/FL-Rules/Media/myTV%20SUPER.yaml",
      "interval": 86400
    },
    "Niconico": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Niconico.yaml",
      "path": "./Rules/FL-Rules/Media/Niconico.yaml",
      "interval": 86400
    },
    "Pandora": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Pandora.yaml",
      "path": "./Rules/FL-Rules/Media/Pandora.yaml",
      "interval": 86400
    },
    "PBS": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/PBS.yaml",
      "path": "./Rules/FL-Rules/Media/PBS.yaml",
      "interval": 86400
    },
    "Pornhub": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Pornhub.yaml",
      "path": "./Rules/FL-Rules/Media/Pornhub.yaml",
      "interval": 86400
    },
    "Soundcloud": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/Soundcloud.yaml",
      "path": "./Rules/FL-Rules/Media/Soundcloud.yaml",
      "interval": 86400
    },
    "ViuTV": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Media/ViuTV.yaml",
      "path": "./Rules/FL-Rules/Media/ViuTV.yaml",
      "interval": 86400
    },
    "Telegram": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Telegram.yaml",
      "path": "./Rules/FL-Rules/Telegram.yaml",
      "interval": 86400
    },
    "Crypto": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Crypto.yaml",
      "path": "./Rules/FL-Rules/Crypto.yaml",
      "interval": 86400
    },
    "Discord": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Discord.yaml",
      "path": "./Rules/FL-Rules/Discord.yaml",
      "interval": 86400
    },
    "Steam": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Steam.yaml",
      "path": "./Rules/FL-Rules/Steam.yaml",
      "interval": 86400
    },
    "TikTok": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/TikTok.yaml",
      "path": "./Rules/FL-Rules/TikTok.yaml",
      "interval": 86400
    },
    "Speedtest": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Speedtest.yaml",
      "path": "./Rules/FL-Rules/Speedtest.yaml",
      "interval": 86400
    },
    "PayPal": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/PayPal.yaml",
      "path": "./Rules/FL-Rules/PayPal.yaml",
      "interval": 86400
    },
    "Microsoft": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Microsoft.yaml",
      "path": "./Rules/FL-Rules/Microsoft.yaml",
      "interval": 86400
    },
    "AI Suite": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/AI%20Suite.yaml",
      "path": "./Rules/FL-Rules/AI%20Suite.yaml",
      "interval": 86400
    },
    "Apple": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Apple.yaml",
      "path": "./Rules/FL-Rules/Apple.yaml",
      "interval": 86400
    },
    "Apple Push": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Apple%20Push.yaml",
      "path": "./Rules/FL-Rules/Apple%20Push.yaml",
      "interval": 86400
    },
    "Google FCM": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Google%20FCM.yaml",
      "path": "./Rules/FL-Rules/Google%20FCM.yaml",
      "interval": 86400
    },
    "Scholar": {
      "type": "http",
      "behavior": "classical",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Scholar.yaml",
      "path": "./Rules/FL-Rules/Scholar.yaml",
      "interval": 86400
    },
    "miHoYoCN": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/miHoYoCN.yaml",
      "path": "./Rules/FL-Rules/miHoYoCN.yaml",
      "interval": 86400
    },
    "HoYoverse": {
      "type": "http",
      "behavior": "classical",
      "format": "yaml",
      "url": "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/HoYoverse.yaml",
      "path": "./Rules/FL-Rules/HoYoverse.yaml",
      "interval": 86400
    }
  },
  "rules": [
    "RULE-SET,AdBlock,AdBlock",
    "RULE-SET,Special,DIRECT",
    "RULE-SET,Netflix,Netflix",
    "RULE-SET,Disney Plus,Disney Plus",
    "RULE-SET,YouTube,YouTube",
    "RULE-SET,Max,Max",
    "RULE-SET,Spotify,Spotify",
    "RULE-SET,Abema TV,Asian TV",
    "RULE-SET,Bahamut,Asian TV",
    "RULE-SET,DMM,Asian TV",
    "RULE-SET,Fox+,Asian TV",
    "RULE-SET,Hulu Japan,Asian TV",
    "RULE-SET,IQ,Asian TV",
    "RULE-SET,Japonx,Asian TV",
    "RULE-SET,JOOX,Asian TV",
    "RULE-SET,KKBOX,Asian TV",
    "RULE-SET,KKTV,Asian TV",
    "RULE-SET,Line TV,Asian TV",
    "RULE-SET,myTV SUPER,Asian TV",
    "RULE-SET,Niconico,Asian TV",
    "RULE-SET,ViuTV,Asian TV",
    "RULE-SET,ABC,Global TV",
    "RULE-SET,Amazon,Global TV",
    "RULE-SET,BBC iPlayer,Global TV",
    "RULE-SET,DAZN,Global TV",
    "RULE-SET,Discovery Plus,Global TV",
    "RULE-SET,encoreTVB,Global TV",
    "RULE-SET,F1 TV,Global TV",
    "RULE-SET,Fox Now,Global TV",
    "RULE-SET,Hulu,Global TV",
    "RULE-SET,Pandora,Global TV",
    "RULE-SET,PBS,Global TV",
    "RULE-SET,Pornhub,Global TV",
    "RULE-SET,Soundcloud,Global TV",
    "RULE-SET,Bilibili,CN Mainland TV",
    "RULE-SET,IQIYI,CN Mainland TV",
    "RULE-SET,Letv,CN Mainland TV",
    "RULE-SET,Netease Music,CN Mainland TV",
    "RULE-SET,Tencent Video,CN Mainland TV",
    "RULE-SET,WeTV,CN Mainland TV",
    "RULE-SET,Youku,CN Mainland TV",
    "RULE-SET,Telegram,Telegram",
    "RULE-SET,Crypto,Crypto",
    "RULE-SET,Discord,Discord",
    "RULE-SET,Google FCM,Google FCM",
    "RULE-SET,AI Suite,AI Suite",
    "RULE-SET,Microsoft,Microsoft",
    "RULE-SET,PayPal,PayPal",
    "RULE-SET,Scholar,Scholar",
    "RULE-SET,Speedtest,Speedtest",
    "RULE-SET,Steam,Steam",
    "RULE-SET,TikTok,TikTok",
    "RULE-SET,Apple Music,Apple TV",
    "RULE-SET,Apple News,Apple TV",
    "RULE-SET,Apple TV,Apple TV",
    "RULE-SET,Apple Push,Apple Push",
    "RULE-SET,Apple,Apple Services",
    "RULE-SET,HoYoverse,hoyoverse",
    "RULE-SET,miHoYoCN,miHoYo",
    "RULE-SET,PROXY,Proxy",
    "RULE-SET,Domestic,Domestic",
    "RULE-SET,Domestic IPs,Domestic",
    "RULE-SET,LAN,DIRECT",
    "GEOIP,CN,Domestic",
    "MATCH,Others"
  ]
};
  profile.proxies = proxies;
  // 节点启动解析由 SSRDOG 订阅维护，保留整段 DNS，不混入 OIX 专用地址。
  if (Object.prototype.hasOwnProperty.call(config, "dns")) {
    profile.dns = JSON.parse(JSON.stringify(config.dns));
  }
  profile["proxy-groups"].forEach(group => {
    const scope = group._nodeScope;
    delete group._nodeScope;
    if (scope === "all") {
      group.proxies.push(...(group.name === "Proxy" ? proxies.map(proxy => proxy.name) : normalNames));
    }
  });
  return applyOixProfile(profile);
}

function applyOixProfile(config) {

  // ================= 官方同步与名称显示 =================
  // 组名按下表显示；FL-Rules 的规则源和米哈游拆分在下方统一接入。
  const GROUP_NAMES = {
    "Proxy": "默认代理",
    "Domestic": "直接连接",
    "miHoYo": "mihoyo",
    "HoYoverse": "hoyoverse",
    "Apple Services": "Apple", // 保留原脚本中的名称
    // 可按需取消注释；改名后应重新检查该组的已选出口。
    // "Others": "漏网之鱼",
    // "AdBlock": "广告拦截",
    // "CN Mainland TV": "国内媒体",
    // "Asian TV": "亚洲媒体",
    // "Global TV": "全球媒体",
    // "AI Suite": "AI 服务",
  };

  // true：覆盖全部节点的普通应用组，用地区组代替重复的长节点列表。
  // 单独限定节点的组及自动测速组始终保留官方成员，避免扩大其范围。
  const COMPACT_APP_GROUPS = true;

  if (!config || !Array.isArray(config["proxy-groups"]) ||
      !Array.isArray(config.rules) || config.rules.length === 0) {
    throw new Error("需要完整的 oixCloud 订阅：缺少 proxy-groups 或 rules。");
  }
  if (!Array.isArray(config.proxies) || config.proxies.length === 0) {
    throw new Error("此版本需要订阅中的内联节点。");
  }
  applyFlRulesProfile(config);

  // 不保留跨地区自动选择组。地区间由用户手动选择，区内仍可自动测速。
  const sourceGroups = config["proxy-groups"];
  const removedAutoGroups = new Set(sourceGroups
    .filter(group => group.name === "Auto - UrlTest" || group.name === "自动选择")
    .map(group => group.name));
  const upstreamGroups = sourceGroups.filter(group => !removedAutoGroups.has(group.name));
  const upstreamRules = config.rules.slice();
  if (!upstreamGroups.some(group => group.name === "Proxy")) {
    throw new Error("未找到官方 Proxy 组。请整体替换旧脚本，并在原始 oixCloud 订阅上运行。");
  }
  if (!Array.isArray(config.proxies) || config.proxies.length === 0) {
    throw new Error("此版本需要订阅中的内联节点。删除节点的对照 YAML 不能直接用于连接。");
  }

  const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const unique = values => [...new Set(values)];
  const referenceNames = Object.create(null);
  const originalProxyNames = config.proxies.map(proxy => proxy.name);
  const originalProxySet = new Set(originalProxyNames);
  upstreamGroups.forEach(group => {
    referenceNames[group.name] = hasOwn(GROUP_NAMES, group.name)
      ? GROUP_NAMES[group.name] : group.name;
  });
  // 其他组、规则及下载出口如果指向被移除的组，统一转向手动“默认代理”。
  removedAutoGroups.forEach(name => { referenceNames[name] = referenceNames.Proxy; });
  const renameReference = name => hasOwn(referenceNames, name)
    ? referenceNames[name] : name;

  // ================= 基础配置开关 =================
  // 是否在默认代理中保留 "剩余流量"、"套餐到期" 等提示信息类节点
  // true 则显示在默认代理中，false 则从该组隐藏；不用于地区测速
  const SHOW_INFO_NODES_IN_MAIN = true;
  
  // 是否在默认代理中保留 "DIRECT" (直连) 选项
  // true 则保留，false 则去除
  const SHOW_DIRECT_IN_MAIN = true;

  // 两家订阅共用地区识别：优先真实旗帜，再识别完整中文/英文及独立代码。
  // 沿用“欧盟策略”这个已有组名，实际包含英国、瑞士等欧洲节点。
  const sortOrder = ["香港策略", "台湾策略", "狮城策略", "日本策略", "韩国策略", "美国策略", "欧盟策略", "冷门自选"];
  const proxies = config.proxies;
  const infoNodes = [];
  const normalProxies = [];
  proxies.forEach(proxy => {
    if (oixIsInfoNode(proxy.name)) infoNodes.push(proxy.name);
    else normalProxies.push(proxy);
  });
  if (normalProxies.length === 0) {
    throw new Error("订阅只有流量/到期提示，没有可用节点。");
  }
  const countryNodes = Object.create(null);
  const otherProxyNames = [];
  normalProxies.forEach(proxy => {
    const region = oixRegionForName(proxy.name);
    proxy.name = oixNormalizeNodeName(proxy.name, region);
    if (!countryNodes[region]) countryNodes[region] = [];
    countryNodes[region].push(proxy.name);
  });

  // 获取所有存在节点的国家组名，并按照指定顺序排序
  let countryGroupNames = Object.keys(countryNodes);
  countryGroupNames.sort((a, b) => {
    const indexA = sortOrder.indexOf(a);
    const indexB = sortOrder.indexOf(b);
    
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else if (indexA !== -1) {
      return -1;
    } else if (indexB !== -1) {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });

  // 生成排好序的国家节点组
  const SELECT_GROUPS = ["欧盟策略", "冷门自选"];
  const countryProxyGroups = [];
  countryGroupNames.forEach(groupName => {
  if (SELECT_GROUPS.includes(groupName)) {
    countryProxyGroups.push({
      name: groupName,
      type: "select",
      proxies: countryNodes[groupName]
    });
  } else {
    countryProxyGroups.push({
      name: groupName,
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 600,
      lazy: false,
      proxies: countryNodes[groupName]
    });
  }
  });

  // 默认代理中按国家组顺序衔接；每个国家内部保留输入顺序
  const allProxyNames = [
    ...sortOrder.flatMap(groupName => countryNodes[groupName] || []),
    ...otherProxyNames
  ];

  // 2. 记录节点改名，随后同步所有明确的出站引用。
  // 旧脚本会整理旗帜/节点名；直接保留官方组时不能遗漏这层转换。
  proxies.forEach((proxy, index) => {
    const originalName = originalProxyNames[index];
    if (hasOwn(referenceNames, originalName)) {
      throw new Error("节点与策略组重名：" + originalName);
    }
    referenceNames[originalName] = proxy.name;
  });
  const infoSet = new Set(infoNodes);
  const normalOriginalNames = originalProxyNames.filter(name => !infoSet.has(name));

  // 3. 从官方组生成应用组：保留类型、首选出口、限制及新增组。
  // AdBlock 会自然保留 REJECT；不再把所有应用套成同一份候选列表。
  const newProxyGroups = upstreamGroups.map(sourceGroup => {
    const group = { ...sourceGroup, name: renameReference(sourceGroup.name) };
    if (Array.isArray(sourceGroup.proxies)) {
      // 默认代理不能把自动组映射回自己；先移除此处的引用，避免自循环。
      const members = sourceGroup.proxies.filter(name =>
        !(sourceGroup.name === "Proxy" && removedAutoGroups.has(name)));
      const mappedMembers = unique(members.map(renameReference));
      const memberSet = new Set(members);
      const coversAllNodes = normalOriginalNames.length > 0 &&
        normalOriginalNames.every(name => memberSet.has(name));

      // 有动态成员、过滤条件时保留官方组原样，不压缩其节点范围。
      const hasDynamicMembers = Boolean(
        sourceGroup.use || sourceGroup.filter || sourceGroup["exclude-filter"] ||
        sourceGroup["exclude-type"] || sourceGroup["include-all"] ||
        sourceGroup["include-all-proxies"] || sourceGroup["include-all-providers"]
      );
      const canAddRegions = sourceGroup.type === "select" &&
        coversAllNodes && !hasDynamicMembers;

      if (sourceGroup.name === "Proxy" && canAddRegions) {
        // 地区组优先，保留逐个节点和直连的手动入口。
        const controls = members.filter(name => !originalProxySet.has(name))
          .filter(name => SHOW_DIRECT_IN_MAIN || name !== "DIRECT")
          .map(renameReference);
        group.proxies = unique([
          ...countryGroupNames, ...controls,
          ...(SHOW_INFO_NODES_IN_MAIN ? infoNodes : []), ...allProxyNames
        ]);
      } else if (canAddRegions && COMPACT_APP_GROUPS &&
                 !originalProxySet.has(members[0])) {
        // 先保留所有官方组/内置出口及其顺序，再追加地区组。
        group.proxies = unique([
          ...members.filter(name => !originalProxySet.has(name)).map(renameReference),
          ...countryGroupNames
        ]);
      } else {
        group.proxies = mappedMembers;
      }

      // 流量/到期提示节点只用于默认代理中的展示，不进入自动测速等组。
      if (sourceGroup.name !== "Proxy") {
        group.proxies = group.proxies.filter(name => !infoSet.has(name));
      }
    }
    if (typeof group["default-selected"] === "string") {
      group["default-selected"] = renameReference(group["default-selected"]);
      // 默认代理曾首选自动组时，改名结果会指向自身；清除此默认值。
      if (group["default-selected"] === group.name) {
        delete group["default-selected"];
      // 官方若明确指定其他节点，保留它，不能被列表压缩丢掉。
      } else if (Array.isArray(group.proxies) &&
          !group.proxies.includes(group["default-selected"])) {
        group.proxies.push(group["default-selected"]);
      }
    }
    return group;
  });
  newProxyGroups.push(...countryProxyGroups);

  // 4. 只替换规则的最终出站字段，不改 RULE-SET 的规则集名称。
  // 从末尾定位，兼容 AND/OR/NOT 中的逗号，以及 no-resolve/src 附加参数。
  // SUB-RULE 的末项是子规则名称，不是出站，必须原样保留。
  function ruleTargetIndex(parts) {
    if (parts[0].trim().toUpperCase() === "SUB-RULE") return -1;
    let index = parts.length - 1;
    while (index > 0 && /^(no-resolve|src)$/i.test(parts[index].trim())) index--;
    return index > 0 ? index : -1;
  }
  function renameRuleTarget(rule) {
    const parts = rule.split(",");
    const index = ruleTargetIndex(parts);
    if (index < 0) return rule;
    const before = parts[index].trim();
    const after = renameReference(before);
    if (before === after) return rule;
    parts[index] = parts[index].replace(before, () => after);
    return parts.join(",");
  }
  // 沿用源规则的解析行为：只改出站名称，不额外添加或删除 no-resolve。
  const processRule = renameRuleTarget;
  const rules = upstreamRules.map(processRule);
  if (config["sub-rules"]) {
    Object.keys(config["sub-rules"]).forEach(name => {
      config["sub-rules"][name] = config["sub-rules"][name].map(processRule);
    });
  }

  // 明确记录为出站名称的其他引用，也随改名更新。
  proxies.forEach(proxy => {
    if (typeof proxy["dialer-proxy"] === "string") {
      proxy["dialer-proxy"] = renameReference(proxy["dialer-proxy"]);
    }
  });
  ["proxy-providers", "rule-providers"].forEach(section => {
    Object.values(config[section] || {}).forEach(provider => {
      if (typeof provider.proxy === "string") {
        provider.proxy = renameReference(provider.proxy);
      }
      if (provider.override && typeof provider.override["dialer-proxy"] === "string") {
        provider.override["dialer-proxy"] = renameReference(provider.override["dialer-proxy"]);
      }
    });
  });

  // 保留订阅 DNS 的地址、策略、兼容列表及未知字段，只适配已改名的出口。
  // 只处理 DNS 服务器地址的 #出口 参数，不替换域名策略的键或 URL 主体。
  function renameDnsServer(server) {
    if (typeof server !== "string") return server;
    const hash = server.indexOf("#");
    if (hash < 0) return server;
    const options = server.slice(hash + 1).split("&").map(option => {
      let name = option;
      try { name = decodeURIComponent(option); } catch (_) {}
      return hasOwn(referenceNames, name) ? renameReference(name) : option;
    });
    return server.slice(0, hash + 1) + options.join("&");
  }
  function renameDnsValue(value) {
    return Array.isArray(value) ? value.map(renameDnsServer) : renameDnsServer(value);
  }
  if (config.dns && typeof config.dns === "object" && !Array.isArray(config.dns)) {
    ["default-nameserver", "nameserver", "fallback", "proxy-server-nameserver",
      "direct-nameserver"].forEach(key => {
      if (hasOwn(config.dns, key)) config.dns[key] = renameDnsValue(config.dns[key]);
    });
    ["nameserver-policy", "proxy-server-nameserver-policy"].forEach(key => {
      const policy = config.dns[key];
      if (policy && typeof policy === "object" && !Array.isArray(policy)) {
        Object.keys(policy).forEach(domain => { policy[domain] = renameDnsValue(policy[domain]); });
      }
    });
  }

  // 检查改名后的重名和悬空引用，避免载入一份表面正常、实际缺组的配置。
  const builtins = ["DIRECT", "REJECT", "REJECT-DROP", "PASS", "COMPATIBLE", "GLOBAL"];
  const outputNames = new Set(builtins);
  [...proxies, ...newProxyGroups].forEach(item => {
    if (outputNames.has(item.name)) throw new Error("改名后存在重复名称：" + item.name);
    outputNames.add(item.name);
  });
  const hasProxyProviders = Object.keys(config["proxy-providers"] || {}).length > 0;
  if (!hasProxyProviders) {
    newProxyGroups.forEach(group => {
      (group.proxies || []).forEach(name => {
        if (!outputNames.has(name)) throw new Error(group.name + " 引用了不存在的出站：" + name);
      });
    });
  }
  const allRules = rules.concat(...Object.values(config["sub-rules"] || {}));
  allRules.forEach(rule => {
    const parts = rule.split(",");
    const index = ruleTargetIndex(parts);
    if (index >= 0 && !hasProxyProviders && !outputNames.has(parts[index].trim())) {
      throw new Error("规则引用了不存在的出站：" + parts[index].trim());
    }
    if (parts[0].trim().toUpperCase() === "RULE-SET" &&
        !hasOwn(config["rule-providers"] || {}, parts[1].trim())) {
      throw new Error("缺少官方规则集：" + parts[1].trim() + "，请更新完整订阅。");
    }
  });

  // 5. 沿用原脚本的个人网络配置（官方同步仅针对分流层）。
  config["port"] = 7890;
  config["socks-port"] = 7891;
  config["mixed-port"] = 7892;
  config["allow-lan"] = true;
  config["bind-address"] = "*";
  config["mode"] = "rule";
  config["log-level"] = "info";
  config["ipv6"] = false;
  config["find-process-mode"] = "always";
  config["external-controller"] = "127.0.0.1:9090";
  config["profile"] = {
    "store-selected": true,
    "store-fake-ip": true
  };
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;

  config["sniffer"] = {
    "enable": true,
    "force-dns-mapping": true,
    "parse-pure-ip": true,
    "override-destination": true,
    "sniff": {
      "HTTP": {
        "ports": [80, "8080-8880"],
        "override-destination": true
      },
      "TLS": {
        "ports": [443, 8443]
      },
      "QUIC": {
        "ports": [443, 8443]
      }
    },
    "skip-domain": [
      "Mijia Cloud",
      "+.push.apple.com"

    ]
  };

  config["ntp"] = {
    "enable": true,
    "write-to-system": false,
    "server": "ntp.aliyun.com",
    "port": 123,
    "interval": 30
  };

  config["tun"] = {
    "enable": false,
    "stack": "mixed",
    "auto-route": true,
    "auto-detect-interface": true,
    "strict-route": true,
    "dns-hijack": [
      "any:53",
      "tcp://any:53"
    ],
    "mtu": 1500,
    "endpoint-independent-nat": true
  };

  // DNS 原样继承输入订阅（仅适配上面的出口引用），上游由客户端覆写管理。

  // 6. 将构建好的对象重新赋给 config
  config["proxy-groups"] = newProxyGroups;
  config.rules = rules;

  return config;
}

// ---------- 两份脚本共用的节点识别函数（无需外部 JS 文件） ----------
function oixIsInfoNode(name) {
  if (typeof name !== "string" || !name.trim()) {
    throw new Error("订阅中存在缺少名称的节点。");
  }
  return /剩余流量|套餐到期|到期时间|过期时间|有效时间|流量重置|\b(?:Traffic|Expire|Expiration)\b/i.test(name) ||
    /^\s*\d+(?:\.\d+)?\s*(?:[KMGTPE]?i?B)\s*[|丨/]\s*\d+(?:\.\d+)?\s*(?:[KMGTPE]?i?B)\s*$/i.test(name);
}

function oixRegionForName(name) {
  const flagMatch = name.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u);
  const flag = flagMatch ? flagMatch[0] : "";
  const regionFlags = {
    "🇭🇰": "香港策略", "🇹🇼": "台湾策略", "🇸🇬": "狮城策略",
    "🇯🇵": "日本策略", "🇰🇷": "韩国策略", "🇺🇸": "美国策略"
  };
  const europeFlags = [
    "🇦🇹", "🇧🇪", "🇧🇬", "🇭🇷", "🇨🇾", "🇨🇿", "🇩🇰", "🇪🇪", "🇫🇮", "🇫🇷",
    "🇩🇪", "🇬🇷", "🇭🇺", "🇮🇸", "🇮🇪", "🇮🇹", "🇱🇻", "🇱🇹", "🇱🇺", "🇲🇹",
    "🇳🇱", "🇳🇴", "🇵🇱", "🇵🇹", "🇷🇴", "🇸🇰", "🇸🇮", "🇪🇸", "🇸🇪", "🇨🇭",
    "🇬🇧", "🇷🇸"
  ];
  if (Object.prototype.hasOwnProperty.call(regionFlags, flag)) return regionFlags[flag];
  if (europeFlags.includes(flag)) return "欧盟策略";
  // 这两份订阅的台湾节点使用 🇨🇳；以明确的台湾名称识别后再整理显示。
  const taiwan = /台湾|臺灣|台灣|台北|臺北|台中|高雄|新北|台南|\b(?:Taiwan|TW|TWN|TPE|TSA|KHH)\b/i;
  if (flag === "🇨🇳") return taiwan.test(name) ? "台湾策略" : "冷门自选";
  // 已有明确的其他国家旗帜时不再靠单字猜测，避免巴西/墨西哥误入欧洲。
  if (flag) return "冷门自选";

  const patterns = [
    ["香港策略", /香港|港[\s\d]|\b(?:Hong\s*Kong|HK|HKG)\b/i],
    ["台湾策略", taiwan],
    ["狮城策略", /新加坡|狮城|獅城|\b(?:Singapore|SG|SGP|SIN|XSP)\b/i],
    ["日本策略", /日本|东京|東京|大阪|\b(?:Japan|JP|JPN|NRT|HND|KIX|CTS|FUK)\b/i],
    ["韩国策略", /韩国|韓國|首尔|首爾|\b(?:South\s*Korea|Korea|KR|KOR|ICN)\b/i],
    ["美国策略", /美国|美國|洛杉矶|洛杉磯|纽约|紐約|\b(?:United\s*States|USA|US|SJC|JFK|LAX|ORD|ATL|DFW|SFO|MIA|SEA|IAD)\b/i],
    ["欧盟策略", /奥地利|奧地利|比利时|比利時|保加利亚|克罗地亚|塞尔维亚|捷克|丹麦|丹麥|爱沙尼亚|芬兰|芬蘭|法国|法國|德国|德國|希腊|匈牙利|爱尔兰|愛爾蘭|意大利|義大利|拉脱维亚|立陶宛|卢森堡|盧森堡|马耳他|馬耳他|荷兰|荷蘭|挪威|冰岛|冰島|波兰|波蘭|葡萄牙|罗马尼亚|斯洛伐克|斯洛文尼亚|西班牙|瑞典|瑞士|英国|英國|\b(?:Austria|Belgium|Bulgaria|Croatia|Cyprus|Czechia|Czech|Denmark|Estonia|Finland|France|Germany|Greece|Hungary|Iceland|Ireland|Italy|Latvia|Lithuania|Luxembourg|Malta|Netherlands|Norway|Poland|Portugal|Romania|Serbia|Slovakia|Slovenia|Spain|Sweden|Switzerland|United\s*Kingdom|Great\s*Britain|Britain|UK|GB|GBR|DE|DEU|FR|FRA|NL|NLD|AT|BE|BG|HR|CY|CZ|DK|EE|FI|GR|HU|IS|IE|IT|LV|LT|LU|MT|NO|PL|PT|RO|RS|SK|SI|ES|SE|CH|CDG|AMS|MAD|BCN|FCO|MUC|BRU|LHR|LGW)\b/i]
  ];
  for (const [region, pattern] of patterns) {
    if (pattern.test(name)) return region;
  }
  return "冷门自选";
}

function oixNormalizeNodeName(name, region) {
  let cleaned = name.replace(/\s+/g, " ").trim();
  const flags = {
    "香港策略": "🇭🇰", "台湾策略": "🇹🇼", "狮城策略": "🇸🇬",
    "日本策略": "🇯🇵", "韩国策略": "🇰🇷", "美国策略": "🇺🇸"
  };
  // 只在明确识别为台湾时转换订阅中的旗帜，其他节点的旗帜和名称保留。
  if (region === "台湾策略") cleaned = cleaned.replace(/🇨🇳/gu, "🇹🇼");
  const hasFlag = /[\u{1F1E6}-\u{1F1FF}]{2}/u.test(cleaned);
  if (!hasFlag && flags[region]) cleaned = flags[region] + " " + cleaned;
  return cleaned.replace(/^([\u{1F1E6}-\u{1F1FF}]{2})\s*/u, "$1 ");
}

// FL-Rules 分流增量。DNS 保留订阅值，由 FlClash 的按项覆写管理。
function applyFlRulesProfile(config) {
  const base = "https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/";
  const providers = config["rule-providers"] || (config["rule-providers"] = {});
  const normalNames = config.proxies.filter(proxy => !oixIsInfoNode(proxy.name)).map(proxy => proxy.name);
  const groups = config["proxy-groups"];
  const legacyIndex = groups.findIndex(group => group.name === "miHoYo");
  const newGroups = groups.filter(group => !["miHoYo", "mihoyo", "HoYoverse", "hoyoverse"].includes(group.name));
  const at = legacyIndex < 0 ? newGroups.length : Math.min(legacyIndex, newGroups.length);
  newGroups.splice(at, 0,
    { name: "miHoYo", type: "select", proxies: ["DIRECT", "Proxy", ...normalNames] },
    { name: "hoyoverse", type: "select", proxies: ["Proxy", "DIRECT", ...normalNames] }
  );
  config["proxy-groups"] = newGroups;

  // 仅替换已知 dler GitHub/CDN 的 Provider 路径，不改第三方自定义来源。
  Object.values(providers).forEach(provider => {
    if (typeof provider.url !== "string") return;
    const cdn = provider.url.match(/^https:\/\/(?:fastly|cdn)\.jsdelivr\.net\/gh\/dler-io\/Rules@main\/Clash\/Provider\/(.+?)(?:[?#].*)?$/);
    const raw = provider.url.match(/^https:\/\/raw\.githubusercontent\.com\/dler-io\/Rules\/main\/Clash\/Provider\/(.+?)(?:[?#].*)?$/);
    if (!cdn && !raw) return;
    const relative = (cdn || raw)[1];
    provider.url = base + relative;
    // 独立缓存路径，避免首次切换时继续使用旧仓库的缓存内容。
    provider.path = "./Rules/FL-Rules/" + relative;
  });
  for (const name of ["miHoYoCN", "HoYoverse"]) {
    providers[name] = {
      type: "http", behavior: "classical", format: "yaml",
      url: base + name + ".yaml", path: "./Rules/FL-Rules/" + name + ".yaml", interval: 86400
    };
  }
  const isHoYo = rule => /^RULE-SET\s*,\s*(?:miHoYo|miHoYoCN|HoYoverse)\s*,/i.test(rule);
  const first = config.rules.findIndex(isHoYo);
  const rules = config.rules.filter(rule => !isHoYo(rule));
  let insertAt = first < 0
    ? rules.findIndex(rule => /^RULE-SET\s*,\s*(?:PROXY|Domestic)\s*,|^GEOIP\s*,|^MATCH\s*,/i.test(rule))
    : config.rules.slice(0, first).filter(rule => !isHoYo(rule)).length;
  if (insertAt < 0) insertAt = rules.length;
  rules.splice(insertAt, 0, "RULE-SET,HoYoverse,hoyoverse", "RULE-SET,miHoYoCN,miHoYo");
  config.rules = rules;
  // 原文件在 fork 中保留兼容。当前配置没有引用时才移除旧 Provider。
  const allRules = rules.concat(...Object.values(config["sub-rules"] || {}));
  if (!allRules.some(rule => /^RULE-SET\s*,\s*miHoYo\s*,/i.test(rule))) delete providers.miHoYo;
}
