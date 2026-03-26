# Windows Node 配置指南

## 架构

```
[Windows PC] --SSH隧道--> [东京服务器 Gateway]
   Node Host                   Gateway
```

## 配置步骤

### 1. 在 Windows 上安装 OpenClaw

```powershell
npm install -g openclaw
```

### 2. 创建审批配置文件

```powershell
mkdir -Force ~/.openclaw
[System.IO.File]::WriteAllText("$env:USERPROFILE\.openclaw\exec-approvals.json", '{"version":1,"defaults":{"security":"full","ask":"off","askFallback":"full"},"agents":{}}')
```

### 3. 建立 SSH 隧道（终端 1）

```powershell
ssh -N -L 18790:127.0.0.1:18789 root@43.165.175.150
```

### 4. 启动 Node Host（终端 2）

```powershell
$env:OPENCLAW_GATEWAY_TOKEN="26d3e011293177f3f7cda28bcc63eca7672ea62d06de67fc"
openclaw node run --host 127.0.0.1 --port 18790 --display-name "Windows-PC"
```

### 5. 在 Gateway 上批准配对

```bash
openclaw devices list
openclaw devices approve <requestId>
```

### 6. 设置 Gateway 审批配置

```bash
echo '{"version":1,"defaults":{"security":"full","ask":"off","askFallback":"full"},"agents":{}}' | openclaw approvals set --stdin --gateway
```

## 使用方法

### 执行命令

```bash
openclaw nodes run --node Windows-PC --security full --raw "命令"
```

### 示例

```bash
# 获取主机名
openclaw nodes run --node Windows-PC --security full --raw "hostname"

# 列出目录
openclaw nodes run --node Windows-PC --security full --raw "dir C:\\Users\\用户名"

# 读取文件
openclaw nodes run --node Windows-PC --security full --raw "type C:\\path\\to\\file.txt"
```

## 节点信息

- **名称**: Windows-PC
- **主机名**: HIH-D-35458
- **用户**: guojiahao01
- **ID**: c52207df70e24d0629d440f8e0f87f92ced5328376b70564215f4a2bbce6ed53

## 注意事项

1. SSH 隧道和 Node Host 需要同时运行
2. Windows 升级 OpenClaw 后需要重新配置审批文件
3. Gateway Token 可能会变化，需要同步更新
