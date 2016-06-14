---
title: RebassThemes Component
layout: default
---

# RebassThemes Component

## Getting Started

This component adds and manipulates the `context.rebass` values.

([Live Demo]({{ '/storybook/?selectedKind=RebassThemes' | prepend: site.baseurl }}))

```jsx
<RebassThemes theme={theme}>
    {content}
</RebassThemes>
```

## API

### RebassThemes

__props__

| Property Name | Type | Description |
| --- | --- | --- | 
| __theme__ |  _object_ | This is a rebass config object, allows you to override the `context.rebass` object selectively. |
| __primaryColour__ |  _string_ | Allows quick switching of the primary theme colour without having to change the rest of the theme object. |

