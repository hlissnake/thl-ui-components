---
title: ExpandableSearch Component
layout: default
---

# ExpandableSearch Component

## Getting Started

This component uses a NavLink button and additional button to dynamically display a search bar 

([Live Demo]({{ '/storybook/?selectedKind=ExpandableSearch' | prepend: site.baseurl }}))

```jsx
<ExpandableSearch onSearch={}>{children}</ExpandableSearch>
```

## API

### ExpandableSearch

__props__

| Property Name | Type | Description |
| --- | --- | --- | 
| __onSearch__ |  _function(string)_ | Function called when the user presses enter or the search button, passed in the search string |
| __children__ |  _any_ | Is passed as the children of both buttons |
