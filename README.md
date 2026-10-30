# FL-Rules

基于 [dler-io/Rules](https://github.com/dler-io/Rules) 的个人分流定制，主要用于 FlClash Script 模式。保留 fork 关系；上游同步和个人增量分别审查。

## 使用入口

- `Scripts/oix-script.js`、`Scripts/ssrdog-script.js`：两份可独立运行的固定分流脚本，执行代码完全相同，文件名仅用于区分订阅。
- 两份脚本都只读取输入订阅的内联 `proxies` 和 `dns`；不读取订阅里的分组、规则或 Provider。分组、规则、规则集地址、默认出口全部由脚本内置模板维护。
- 内置模板含 65 条路由、63 个 Provider。节点和 DNS 随当前订阅更新；远程 Provider 内容按 interval 更新。新增或调整分组、规则顺序、Provider 定义时需同步更新两份脚本，不会从 OIX 封端订阅自动继承。
- `Clash/Rule_FL.yaml`：本 fork 的路由片段，不是完整订阅；使用前需要定义其中引用的策略组，包括 `mihoyo` 和 `hoyoverse`。
- `Clash/Rule.yaml`、`Clash/Provider/miHoYo.yaml`：保留上游兼容入口；前者仍引用上游仓库，后者仍为旧的国内外混合列表。新脚本不使用这个混合 Provider。

两份 JS 均为独立文件；下载交付使用 ZIP，无需把两份脚本一起载入。仓库不保存任何实际节点、凭据或订阅链接。

## 米哈游拆分

| Provider | 策略组 | 默认出口 | 来源 |
| --- | --- | --- | --- |
| `Clash/Provider/miHoYoCN.yaml` | `mihoyo` | DIRECT | MetaCubeX `mihoyo-cn` |
| `Clash/Provider/HoYoverse.yaml` | `hoyoverse` | 默认代理 | MetaCubeX `hoyoverse` |

两份文件为 classical YAML，保留域名正则。大陆包包含各款游戏、米游社及 `mihoyo.com` 后缀，因此覆盖 `baike.mihoyo.com`、`bbs.mihoyo.com` 等 Wiki、账号和资源子域名。海外包包含国际服游戏、HoYoLAB、HoYoverse 平台等。

按域名分类无法区分同一后端请求来自大陆还是国际服页面。国际服调用共享的 `mihoyo.com` 后端时，仍进入大陆组；有实测证据后，应在大陆宽泛后缀之前添加具体子域名例外。共享 CDN 不能整站归入米哈游。

## 规则和 DNS

内置规则保留 OIX 基线原有的 `no-resolve` 状态，不额外添加或删除。OIX 原来的 LAN 规则可以为域名解析真实 IP，后面的 GEOIP CN 继续补漏。原有 Provider 中已写的 `no-resolve` 保留。

DNS 继承各自输入订阅；客户端可以按项覆写。OIX 的节点专用 DNS 不复制到 SSRDOG。客户端保存的策略选择可能优先于列表顺序，应用脚本后检查实际出口。

已审查的服务增量、暂缓地址及来源提交见 [docs/rule-additions-20261030.json](docs/rule-additions-20261030.json)。本轮没有增加 Steam CDN，没有加入云服务商根域名规则，也没有加入新的云租户正则。精确的服务专用云主机按社区分类收录，并不代表经过服务商官方允许列表认证。

## 下载地址

GitHub 存储文件，jsDelivr 提供独立 CDN 服务。示例：

```text
https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/Telegram.yaml
https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/miHoYoCN.yaml
https://fastly.jsdelivr.net/gh/FoobarRogers/FL-Rules@main/Clash/Provider/HoYoverse.yaml
```

`@main` 跟随本 fork 的 main 分支，但 CDN 存在缓存；jsDelivr 文档列出的分支缓存为 12 小时，客户端还按各 Provider 的 interval 拉取。本 fork 不会因为上游更新就自行更新，仍需同步和复核。测试固定版本可将 `@main` 换成具体提交 SHA；固定 SHA 不会跟随后续修正。

脚本使用 `./Rules/FL-Rules/` 作为独立 Provider 缓存目录，避免首次切换沿用旧源缓存。

## 同步上游

普通 Sync fork / merge 会合并上游提交并保留本 fork 的修改；同一部分同时修改可能冲突。不要使用 Discard commits、强制同步或 reset 来解决定制冲突。

即使没有文本冲突，也需复核规则顺序、Provider 引用、策略组和云地址范围。新增的两个米哈游文件、Scripts 和 docs 通常独立于上游文件；现有服务 Provider 的追加段可能需要人工处理。来源和定制清单用于核对，不能假定一次无冲突合并就保证行为一致。

本项目默认只向 `FoobarRogers/FL-Rules` 提交或创建 PR，不自动向上游贡献。
