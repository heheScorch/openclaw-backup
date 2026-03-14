# OpenClaw 命令列表

## 常用命令

| 命令 | 功能 |
|------|------|
| /check_openclaw_update | 检查 OpenClaw 是否有新版本 |
| /weather | 查询天气 |
| /pair | 配对新设备 |

## OpenClaw CLI 命令

### 基础命令
| 命令 | 功能 |
|------|------|
| openclaw --version | 查看版本 |
| openclaw configure | 交互式配置 |
| openclaw doctor | 健康检查+修复 |

### Gateway 管理
| 命令 | 功能 |
|------|------|
| openclaw gateway start | 启动 Gateway |
| openclaw gateway stop | 停止 Gateway |
| openclaw gateway restart | 重启 Gateway |
| openclaw gateway status | 查看状态 |

### 设备管理
| 命令 | 功能 |
|------|------|
| openclaw devices list | 列出已配对设备 |
| openclaw devices approve <id> | 批准设备 |

### 定时任务
| 命令 | 功能 |
|------|------|
| openclaw cron list | 列出定时任务 |
| openclaw cron add | 添加任务 |
| openclaw cron remove | 删除任务 |

### 模型管理
| 命令 | 功能 |
|------|------|
| openclaw models list | 列出可用模型 |
| openclaw models scan | 扫描模型目录 |

### 频道管理
| 命令 | 功能 |
|------|------|
| openclaw channels list | 列出频道 |
| openclaw channels add | 添加频道 |

## Telegram 机器人命令

Telegram 机器人的命令需要在 BotFather 中设置。
可以通过 openclaw channels configure 来管理。

