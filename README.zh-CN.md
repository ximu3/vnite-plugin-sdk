# vnite-plugin-sdk

[English](README.md) | [简体中文](README.zh-CN.md)

Vnite 插件开发工具包，提供了 Vnite 传递给插件的 api 的完整类型定义。

## 安装

```bash
npm install -D vnite-plugin-sdk
```

## 使用

推荐使用 [create-vnite-plugin](https://github.com/ximu3/create-vnite-plugin) 脚手架来创建插件项目。

```typescript
import type { IPluginAPI } from 'vnite-plugin-sdk'

/**
 * Common example plugin
 *
 * Can implement plugin functionality through the event system
 */

// Plugin activation function
async function activate(api: IPluginAPI): Promise<void> {
  api.eventBus.on('game:added', async (eventData) => {
    const gameName = eventData.name
  })
}

// Plugin deactivation function
async function deactivate(api: IPluginAPI): Promise<void> {}

// Export plugin
export default {
  activate,
  deactivate
}
```
