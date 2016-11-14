---
title: ProgressBar Component
layout: default
---

# ProgressBar Component

## Getting Started

This Component is a modified version of https://github.com/minhtranite/react-progress-bar-plus

([Live Demo]({{ '/storybook/?selectedKind=ProgressBar' | prepend: site.baseurl }}))

```jsx
<ProgressBar 
	percent={10}
/>
```

## API

### ProgressBar

__props__

| Property Name | Type | Description |
| --- | --- | --- | 
| __percent__ |  _number (required)_ | Progress percent |
| __onTop__ |  _bool_ | Progress bar will ontop & height 100% |
| __absolute__ |  _bool_ | If true position is `absolute` if false `fixed` |
| __autoIncrement__ |  _bool_ | if `true` percent will auto increment `Math.random() + 1 - Math.random()`% in `intervalTime` ms. |
| __intervalTime__ | _number_ | Interval time for auto increment. |
| __spinner__ | _oneOf([false, 'left', 'right'])_ | Spinner position. Pass `false` to hide spinner icon. Defaults to `left` |
| __className__ | _string_ | Custom class |
| __theme__ | _string_ | Rebass theme color to use, defaults to `primary` |
