# vnite-plugin-sdk

[English](README.md) | [简体中文](README.zh-CN.md)

The Vnite plugin development toolkit provides complete type definitions for the APIs that Vnite passes to plugins.

## Installation

```bash
npm install -D vnite-plugin-sdk
```

## Usage

It's recommended to use the [create-vnite-plugin](https://github.com/ximu3/create-vnite-plugin) scaffold to create plugin projects.

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
