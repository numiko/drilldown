# Drilldown

The Drilldown Package provides an easy-to-use solution for creating animated, hierarchical menus using the GreenSock Animation Platform (GSAP). It allows for smooth transitions between menu levels with configurable options for customization and callbacks for advanced integrations.

## Table of Contents

- [Features](#markdown-header-features)
- [Dependencies](#markdown-header-dependencies)
- [Installation](#markdown-header-installation)
- [Usage](#markdown-header-usage)
- [API](#markdown-header-api)
- [Release Notes](#markdown-header-release-notes)

## Features

- **Dynamic Hierarchical Menus**: Easily create multi-level drilldown menus to efficiently manage complex site navigation structures.
- **GSAP Animations**: Utilizes the GreenSock Animation Platform (GSAP) to provide smooth, high-performance transitions between menu levels.
- **Configurable Selectors**: Customize selectors for menu items, back buttons, submenus, and more to match your HTML structure.
- **Customizable Animation Callbacks**: Offers hooks for animation start and complete events at both child and parent levels, allowing for fine-tuned control over menu behavior.
- **Automatic Height Adjustment**: Features a ResizeObserver to automatically adjust the height of the drilldown menu, ensuring it matches the content for a seamless user experience.
- **Lifecycle Management**: Features methods for initializing and destroying drilldown instances, enabling proper setup and teardown of components to prevent memory leaks and ensure clean transitions between states.

## Dependencies

- GSAP


## Installation

You then install this package choosing the latest tag.

```shell
npm install ssh://git@bitbucket.org:numiko/drilldown.git#<TAG_NAME>
```

## Usage

### JS initialisation

```JS
import { Drilldown } from './path/to/Drilldown.js';

const menuElement = document.getElementById('menu');
const options = {
  backSelector: '[data-js-menu-back]',
  nextSelector: '[data-js-menu-link-has-submenu]',
  submenuSelector: '[data-js-menu-container]',
  itemSelector: '[data-js-menu-item]',
};

const menu = new Drilldown(menuElement, options);
menu.init();

```

### HTML Structure

```HTML
<div id="menu-dropdown" class="hidden overflow-hidden" data-js-menu-container="" data-js-menu-container-level="0">
    <ul data-js-menu="" data-js-menu-level="0">
        <!-- Top Level Menu Item with Submenu -->
        <li data-js-menu-item="" data-js-menu-item-level="0" data-js-menu-item-has-submenu="">
            <button type="button" data-js-menu-link="" data-js-menu-link-level="0" data-js-menu-link-has-submenu="" aria-controls="submenu-1">
                Top Level 1
                <span>▼</span> <!-- Simplified arrow for demonstration -->
            </button>
            <!-- Submenu Level 1 -->
            <div id="submenu-1" class="invisible" data-js-menu-container="" data-js-menu-container-level="1">
                <button data-js-menu-back="">
                    Go Back
                </button>
                <ul data-js-menu="" data-js-menu-level="1" data-js-menu-submenu="">
                    <li data-js-menu-item="" data-js-menu-item-level="1">
                        <a href="/" data-js-menu-link="" data-js-menu-link-level="1">
                            Second Level 1
                        </a>
                    </li>
                    <!-- Additional list items can be added here -->
                </ul>
            </div>
        </li>
        <!-- Additional top-level menu items can be added here -->
    </ul>
</div>
```


## API

### Constructor

- `Drilldown(context, options = {})`: Initializes a new instance of the Drilldown class.
  - `context`: The HTMLElement to initialize the drilldown on.
  - `options`: Configuration options for the drilldown.

### Options

Customizable options and their defaults are as follows:

| Option | Description | Type | Default
| --- | --- | --- | --- |
| `backSelector` | Selector for back buttons. | `string` | `[data-js-menu-back]` |
| `nextSelector` | Selector for next buttons. | `string` | `[data-js-menu-link-has-submenu]` |
| `submenuSelector` | Selector for submenu containers. | `string` | `[data-js-menu-container]` |
| `itemSelector` | Selector for menu items. | `string` | `[data-js-menu-item]` |
| `onChildTweenStart` | Callback functions before sub menu animation. | `function` | `null` |
| `onChildTweenComplete` | Callback functions after sub menu animation. | `function` | `null` |
| `onParentTweenStart` | Callback functions before parent menu animation. | `function` | `null` |
| `onParentTweenComplete` | Callback functions after parent menu animation. | `function` | `null` |

### Methods

| Method | Description
| --- | --- |
| `init()` | Initalise the drilldown |
| `reset()` | Resets the drilldown menu to its initial state. |
| `destroy()` | Destroys drilldown. Cleans up event listeners and resets the menu. |


## Release notes

### v1.0.0

- Inital version created to work with SiteKit menus
