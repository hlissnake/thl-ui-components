---
title: ToolbarOverflow Component
layout: default
---

# ToolbarOverflow Component

## Getting Started

The ToolbarOverflow component works by detecting how many of the children are completely showing and moving the rest to a rebass Dropdown.  

([Live Demo]({{ '/storybook/?selectedKind=ToolbarOverflow&selectedStory=default' | prepend: site.baseurl }}))

```jsx
<OverflowToolbar overflowButton={<Button>More...</Button>}>
    <Button>Test Title 1</Button>
    <Button>Test Title 2</Button>
</OverflowToolbar>
```

## API

### NavigationToolbar

__props__

| Property Name | Type | Description |
| --- | --- | --- | 
| __overflowButton__ |  _React Element | Stateless Function_ | This is passed as the contents for Rebass' Dropdown as the trigger element, if a stateless function is passed it receives the properties `onClick` and `dropdownShown`. |
| __appendStart__ |  _boolean: true_ | Whether the dropdown trigger is added at the start or end of the row |
| __overflowButtonWidth__ |  _number: 80_ | The space allocated to the overflow dropdown button |
