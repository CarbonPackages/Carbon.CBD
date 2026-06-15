# Carbon.CBD

`Carbon.CBD` helps you build complex content elements in Neos CMS (for example sliders, maps, tabs, or other multi-item components) with a smooth editor workflow.

It provides a reusable backend/live-preview wrapper pattern around content collections, so editors can switch between editing and live view directly in the backend.

## Features

- Reusable component base for content elements with nested item nodes
- Editor-friendly wrapper with backend/live toggle
- Empty-state handling for components without items
- Translation auto-include for backend labels

## Requirements

- PHP package:
  - `neos/neos`: `^8.4`
  - `carbon/eel`: `^2.14`

## Installation

Install via Composer:

```bash
composer require carbon/cbd
```

## How It Works

The package auto-includes Fusion via settings and exposes a reusable `Carbon.CBD:Component` base that:

- Reads child nodes of your element
- Passes data to your custom renderer type
- Wraps output in `Carbon.CBD:Presentation.Wrapper`
- Shows backend editing controls when in backend context

## Basic Usage

### 1. Create an element node type

Your element should inherit from `Carbon.CBD:Mixin.Element`.

```yaml
"Vendor.Site:Content.Slider":
  superTypes:
    "Carbon.CBD:Mixin.Element": true
  ui:
    label: "Slider"
```

### 2. Create an item node type

Items should inherit from `Carbon.CBD:Mixin.Element.Item`.

```yaml
"Vendor.Site:Content.Slider.Item":
  superTypes:
    "Carbon.CBD:Mixin.Element.Item": true
  ui:
    label: "Slide"
```

### 3. Restrict allowed children on your element

```yaml
"Vendor.Site:Content.Slider":
  constraints:
    nodeTypes:
      "*": false
      "Vendor.Site:Content.Slider.Item": true
```

### 4. Define a Fusion prototype for your element

```elm
prototype(Vendor.Site:Content.Slider) < prototype(Carbon.CBD:Component) {
    type = 'Vendor.Site:Presentation.Slider'
    data = Neos.Fusion:DataStructure {
        autoplay = ${q(node).property('autoplay')}
    }
}
```

### 5. Render your live presentation type

```elm
prototype(Vendor.Site:Presentation.Slider) < prototype(Neos.Fusion:Component) {
    renderer = afx`
        <div
          @if={props.count > 1}
          class="my-slider"
          data-autoplay={props.data.autoplay}
        >
            {props.content}
        </div>
        {props.count > 1 ? '' : props.content}
    `
}
```

## Notes

- The package enables Fusion auto-include and translation auto-include via `Configuration/Settings.yaml`.
- `Carbon.CBD:Mixin.Element.Item` is blocked on generic `Neos.Neos:ContentCollection` to avoid accidental insertion outside CBD elements.

## License

GPL-3.0-or-later
