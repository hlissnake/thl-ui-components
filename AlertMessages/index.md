---
title: AlertMessages Component
layout: default
---

# AlertMessages Component

## Getting Started

This component is used to display auto hiding and dismissable Message components

([Live Demo]({{ '/storybook/?selectedKind=AlertMessages' | prepend: site.baseurl }}))

```jsx
<AlertMessages 
	messages={}
	clear={}
/>
```

## API

### AlertMessages

__props__

| Property Name | Type | Description |
| --- | --- | --- | 
| __messages__ |  _array (required)_ | Array of messages of the form `{key: 'unique-key', theme: 'theme-name', children, timeout: 1000}`. timeout is optional. children is a valid react component |
| __clear__ |  _function(key)_ | Function that should take a key of a message and remove it from the messages array passed |
