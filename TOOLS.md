# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Telegram Bot

### 发送消息给 hasaki

```bash
curl -s -X POST "https://api.telegram.org/bot8609870200:AAFj8oy6BRtEv1fvhpgjSEajVD2CxC4qfko/sendMessage" \
  -d "chat_id=5220650531" \
  -d "text=消息内容"
```

### 信息

- **Bot**: @HeHeScorchBot
- **Chat ID**: 5220650531 (hasaki 私聊)

### 注意

`sessions_send` 是把消息注入到目标 session 让 agent 处理，不是直接发 Telegram。直接发消息要用 Bot API。

---

## VLESS REALITY 代理

### 服务器信息

- **IP**: 43.165.175.150
- **端口**: 443
- **协议**: VLESS + REALITY
- **Docker 容器**: `vless-reality`
- **配置文件**: `/opt/vless-reality/config.json`

### 客户端配置

| 配置项 | 值 |
|--------|-----|
| 类型 | VLESS |
| 地址 | 43.165.175.150 |
| 端口 | 443 |
| UUID | `b2c3d4e5-f6a7-8901-bcde-f12345678901` |
| 传输 | TCP |
| TLS | REALITY |
| SNI | www.microsoft.com |
| Public Key | `NRwgGwquMGTk4tRzvEZuWvT97KEewXdulX1MnK5TGSU` |
| Short ID | `0123456789abcdef` |
| Flow | xtls-rprx-vision |

### 分享链接

```
vless://b2c3d4e5-f6a7-8901-bcde-f12345678901@43.165.175.150:443?encryption=none&security=reality&sni=www.microsoft.com&fp=chrome&pbk=NRwgGwquMGTk4tRzvEZuWvT97KEewXdulX1MnK5TGSU&sid=0123456789abcdef&type=tcp&flow=xtls-rprx-vision#REALITY
```

### 密钥（服务器端）

- **Private Key**: `IDEY5a8xYMHNYcmQVK-Ye0I92ri7L_9d4NQV3mJtCWc`
- **Public Key**: `NRwgGwquMGTk4tRzvEZuWvT97KEewXdulX1MnK5TGSU`

### 管理命令

```bash
# 查看状态
docker logs vless-reality

# 重启
docker restart vless-reality

# 查看配置
cat /opt/vless-reality/config.json
```

---

Add whatever helps you do your job. This is your cheat sheet.
