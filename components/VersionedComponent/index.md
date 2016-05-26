---
title: VersionedComponent
layout: default
---

# VersionedComponent Component

## Getting Started

This component is used to version the display of a component.

([Live Demo]({{ '/storybook/?selectedKind=VersionedComponent&selectedStory=version%201.1.0' | prepend: site.baseurl }}))

__props__

| Name | Type | Description |
| --- | --- | --- |
| __version__ | _string_ | The target version, can target a specific version '1.1.0', all higher versions '^1.1.0' or all bugfixes '~1.0.0'. Format is `Major`.`Minor`.`Patch`+`Prerelease` |
| __components__ | _object_ | The components to display at each version, key is the version number to display at, value is the component or stateless component that should be displayed |
