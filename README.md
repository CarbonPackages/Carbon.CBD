# Carbon.CBD

`Carbon.CBD` provides building blocks for complex, multi-item content elements in Neos CMS, such as sliders, maps and tabs. It separates the editor's content-collection view from the live presentation and adds a toggle to the Neos UI.

## Features

- Reusable `Carbon.CBD:Component` Fusion prototype
- Separate live and edit renderers
- Synchronized live/edit toggles in the inline toolbar and inspector
- Empty-state handling for empty content collections
- Custom attributes for the backend wrapper and edit renderer
- Translation auto-include for the UI

## Requirements

- `neos/neos` `^8.4`

## Installation

```bash
composer require carbon/cbd
```

The package automatically includes its Fusion prototypes and translations through [`Configuration/Settings.Neos.yaml`](Configuration/Settings.Neos.yaml).

## Usage

### Element and item node types

Make the parent element inherit from `Carbon.CBD:Mixin.Element` and its items from `Carbon.CBD:Mixin.Element.Item`:

```yaml
"Vendor.Site:Content.Slider":
  superTypes:
    "Carbon.CBD:Mixin.Element": true
  ui:
    label: "Slider"
  constraints:
    nodeTypes:
      "*": false
      "Vendor.Site:Content.Slider.Item": true

"Vendor.Site:Content.Slider.Item":
  superTypes:
    "Carbon.CBD:Mixin.Element.Item": true
  ui:
    label: "Slide"
```

`Carbon.CBD:Mixin.Element` is a content collection and allows no children by default. Define the allowed item types explicitly, as shown above. CBD item nodes are also blocked on regular `Neos.Neos:ContentCollection` nodes.

The mixin registers the `Carbon.CBD/InspectorButton` inspector view under the `cbd` key. Assign the view to an inspector group and set its position on the concrete element node type:

```yaml
"Vendor.Site:Content.Slider":
  ui:
    inspector:
      groups:
        presentation:
          label: "Presentation"
          position: 10
      views:
        cbd:
          group: "presentation"
          position: 10
```

The inspector toggle and the button in the inline toolbar stay synchronized. Both are only shown for CBD elements that contain child nodes.

### Fusion component

Use `Carbon.CBD:Component` as the base prototype for the element:

```elm
prototype(Vendor.Site:Content.Slider) < prototype(Carbon.CBD:Component) {
    live = Carbon.CBD:ChildContentRenderer
    edit = Carbon.CBD:ContentCollectionRenderer
}
```

The default values are:

- `live`: `Carbon.CBD:ChildContentRenderer`, which renders the child nodes without content-element wrappers
- `edit`: `Carbon.CBD:ContentCollectionRenderer`, which renders the editable content collection and its empty state
- `wrapperAttributes`: attributes for the outer wrapper rendered in the Neos backend
- `editAttributes`: attributes added to the root element of the edit renderer

Override either property when the element needs a custom live presentation or edit renderer. A custom live renderer can still use `Carbon.CBD:ChildContentRenderer` for its child content:

```elm
prototype(Vendor.Site:Component.Slider) < prototype(Neos.Fusion:Component) {
    content = Carbon.CBD:ChildContentRenderer

    renderer = afx`
        <div class="my-slider">
            {props.content}
        </div>
    `
}
```

Attributes can be added to the backend wrapper and the edit view independently:

```elm
prototype(Vendor.Site:Content.Slider) < prototype(Carbon.CBD:Component) {
    wrapperAttributes.class = 'slider-backend-wrapper'
    editAttributes {
        class = 'slider-edit-view'
        data-component = 'slider'
    }
}
```

When using `Carbon.CBD:ContentCollectionRenderer` directly, its root element can also be configured through `attributes`:

```elm
prototype(Vendor.Site:Content.Slider) < prototype(Carbon.CBD:Component) {
    edit.attributes.class = 'slider-content-collection'
}
```

`Carbon.CBD:Presentation.Wrapper` is used internally by `Carbon.CBD:Component`. In the backend it adds `data-__cbd-mode="live"` or `data-__cbd-mode="edit"` and attaches the edit renderer's insertion anchor. The Neos UI button switches these modes for elements that contain child nodes.

Make sure that you disable the content element wrapping if you use custom live elements:

```elm
prototype(Neos.Neos:ContentElementWrapping) {
    @if.wrapping = false
}
prototype(Neos.Neos:Editable) {
    renderer.editable.condition = false
}
```

Here an example:

```elm
prototype(Vendor.Site:Content.Tabs) < prototype(Carbon.CBD:Component) {
    live >
    live = Vendor.Site:Presentation.Tabs {
        prototype(Neos.Neos:ContentElementWrapping) {
            @if.wrapping = false
        }
        prototype(Neos.Neos:Editable) {
            renderer.editable.condition = false
        }
        // type is used for different views for the tabs
        type = ${q(node).property('type')}

        items = Neos.Fusion:Map {
            items = ${q(node).children()}
            itemName = 'node'
            itemRenderer = Neos.Fusion:DataStructure {
                label = ${q(node).property('title')}
                icon = ${q(node).property('icon')}
                content = Neos.Fusion:Loop {
                    items = ${q(node).children()}
                    itemRenderer = Neos.Neos:ContentCase
                    itemName = 'node'
                    iterationName = 'iterator'
                }
            }
        }
    }
}
```
