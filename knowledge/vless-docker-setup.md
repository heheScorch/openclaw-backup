# VLESS 代理服务配置 (Docker)

## 服务器信息
- 服务器 IP: 43.165.175.150 (东京 Tencent 云)
- 端口: 8443
- UUID: eaf395db-3b39-4519-a763-f46d6d5ba332

## 配置文件

路径: `/root/vless/config.json`

```json
{
  "log": {
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "port": 8443,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "eaf395db-3b39-4519-a763-f46d6d5ba332"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/vless"
        },
        "security": "none"
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
    }
  ]
}
```

## Docker 命令

### 启动服务
```bash
docker run -d \
  --name vless-server \
  --restart always \
  -p 8443:8443 \
  -v /root/vless/config.json:/etc/xray/config.json \
  teddysun/xray:latest
```

### 管理命令
```bash
# 查看日志
docker logs vless-server --tail 50

# 重启服务
docker restart vless-server

# 停止服务
docker stop vless-server

# 删除容器
docker rm -f vless-server
```

## 客户端 URL

```
vless://eaf395db-3b39-4519-a763-f46d6d5ba332@43.165.175.150:8443?encryption=none&security=none&type=ws&path=%2Fvless#OpenClaw-VLESS-WS
```

## 注意事项

1. 确保云服务商安全组开放 8443 端口
2. 如需更换 UUID: `cat /proc/sys/kernel/random/uuid`
3. 修改配置后需重启容器: `docker restart vless-server`
