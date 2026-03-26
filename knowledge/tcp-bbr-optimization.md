# TCP BBR 优化

用于提升 VLESS 等代理的网速。

## 一键优化脚本

```bash
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
cat >> /etc/sysctl.conf << 'EOF'

# TCP 优化
net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.tcp_fastopen = 3
net.ipv4.tcp_mtu_probing = 1
EOF
sysctl -p
```

## 验证

```bash
sysctl net.ipv4.tcp_congestion_control
# 应显示: net.ipv4.tcp_congestion_control = bbr
```

## 优化项说明

| 优化项 | 值 | 说明 |
|--------|-----|------|
| tcp_congestion_control | bbr | Google BBR 拥塞控制算法 |
| default_qdisc | fq | Fair Queue 队列调度 |
| rmem_max | 67108864 | 最大接收缓冲区 (64MB) |
| wmem_max | 67108864 | 最大发送缓冲区 (64MB) |
| tcp_fastopen | 3 | 客户端+服务端都开启 TFO |
| tcp_mtu_probing | 1 | 开启 MTU 探测 |

## 效果

- 提升代理网速
- 降低延迟
- 改善丢包恢复

## 注意

- 需要 Linux 内核 4.9+ 支持 BBR
- Docker 容器无需单独配置，继承宿主机设置
