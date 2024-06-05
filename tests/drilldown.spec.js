import { Window } from 'happy-dom';
import fs from 'fs';
import path from 'path';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { Drilldown } from '../lib/Drilldown';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Read the HTML document content
const htmlDocumentContent = fs.readFileSync(path.join(process.cwd(), 'index.html')).toString();

// Initialise Happy DOM
const window = new Window();
const document = window.document;

// Make window and document global
global.window = window;
global.document = document;

/**
 * Make sure the document is in a clear state before each test
 */
beforeEach(() => {
  document.body.innerHTML = '';
  document.write(htmlDocumentContent);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Drilldown initialisation', () => {
  let drilldown;
  const DEFAULT_DURATION = 0.2;
  const DEFAULT_EASE = 'power1.out';
  const DEFAULT_STAGGER = 0;

  it('should correctly initialize with default options', () => {
    const menuElement = document.getElementById('menu');
    drilldown = new Drilldown(menuElement);

    expect(drilldown.options.backSelector).toBe('[data-js-menu-back]');
    expect(drilldown.options.nextSelector).toBe('[data-js-menu-next]');
    expect(drilldown.options.submenuSelector).toBe('[data-js-menu-container]');
    expect(drilldown.options.itemSelector).toBe('[data-js-menu-item]');
    expect(drilldown.options.childTween.outDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.childTween.inDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.childTween.outEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.childTween.inEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.childTween.inStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.childTween.outStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.parentTween.outDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.parentTween.inDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.parentTween.outEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.parentTween.inEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.parentTween.inStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.parentTween.outStagger).toBe(DEFAULT_STAGGER);
  });

  it('should correctly initialize with custom selectors', () => {
    const menuElement = document.getElementById('menu');
    drilldown = new Drilldown(menuElement, {
      backSelector: '[data-js-back-selector]',
      nextSelector: '[data-js-next-selector]',
      submenuSelector: '[data-js-submenu-selector]',
      itemSelector: '[data-js-item-selector]',
    });

    expect(drilldown.options.backSelector).toBe('[data-js-back-selector]');
    expect(drilldown.options.nextSelector).toBe('[data-js-next-selector]');
    expect(drilldown.options.submenuSelector).toBe('[data-js-submenu-selector]');
    expect(drilldown.options.itemSelector).toBe('[data-js-item-selector]');
  });

  it('should correctly initialize with custom childTween options', () => {
    const menuElement = document.getElementById('menu');
    const IN_DURATION = 0.5;
    const OUT_DURATION = 0.5;
    const IN_EASE = 'power2.in';
    const OUT_EASE = 'power2.out';
    const IN_STAGGER = 0.1;
    const OUT_STAGGER = 0.1;

    drilldown = new Drilldown(menuElement, {
      childTween: {
        inDuration: 0.5,
        outDuration: 0.5,
        inEase: 'power2.in',
        outEase: 'power2.out',
        inStagger: 0.1,
        outStagger: 0.1,
      },
    });

    expect(drilldown.options.childTween.outDuration).toBe(IN_DURATION);
    expect(drilldown.options.childTween.inDuration).toBe(OUT_DURATION);
    expect(drilldown.options.childTween.outEase).toBe(OUT_EASE);
    expect(drilldown.options.childTween.inEase).toBe(IN_EASE);
    expect(drilldown.options.childTween.inStagger).toBe(IN_STAGGER);
    expect(drilldown.options.childTween.outStagger).toBe(OUT_STAGGER);
  });

  it('should correctly initialize with custom parentTween options', () => {
    const menuElement = document.getElementById('menu');
    const IN_DURATION = 0.5;
    const OUT_DURATION = 0.5;
    const IN_EASE = 'power2.in';
    const OUT_EASE = 'power2.out';
    const IN_STAGGER = 0.1;
    const OUT_STAGGER = 0.1;

    drilldown = new Drilldown(menuElement, {
      parentTween: {
        inDuration: 0.5,
        outDuration: 0.5,
        inEase: 'power2.in',
        outEase: 'power2.out',
        inStagger: 0.1,
        outStagger: 0.1,
      },
    });

    expect(drilldown.options.parentTween.outDuration).toBe(IN_DURATION);
    expect(drilldown.options.parentTween.inDuration).toBe(OUT_DURATION);
    expect(drilldown.options.parentTween.outEase).toBe(OUT_EASE);
    expect(drilldown.options.parentTween.inEase).toBe(IN_EASE);
    expect(drilldown.options.parentTween.inStagger).toBe(IN_STAGGER);
    expect(drilldown.options.parentTween.outStagger).toBe(OUT_STAGGER);
  });
});

describe('Interacting with the menu', () => {
  it('should reveal a submenu when a link is clicked that has a submenu', async () => {
    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
    });
    drilldown.init();

    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    const submenuWrapper = document.querySelector('[data-js-menu-container-level="1"]');
    const submenuLinks = document.querySelectorAll('[data-js-menu-link-level="1"]');

    linkWithSubmenu.click();

    await delay(250);

    expect(submenuWrapper.style.opacity).toBe('1');
    expect(submenuWrapper.style.visibility).toBe('inherit');

    submenuLinks.forEach((link) => {
      expect(link.style.opacity).toBe('1');
      expect(link.style.visibility).toBe('inherit');
    });
  });

  it('should reveal a parent menu when a link is clicked that has a parent menu', async () => {
    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
      parentTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
    });
    drilldown.init();

    // Open the submenu.
    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    linkWithSubmenu.click();

    await delay(250);

    // Go back up to the parent menu.
    const backButton = document.querySelector('[data-js-menu-back]');
    backButton.click();

    await delay(250);

    // All top-level links should be visible.
    const topLevelLinks = document.querySelectorAll('[data-js-menu-link-level="0"]');
    topLevelLinks.forEach((link) => {
      expect(link.style.opacity).toBe('1');
      expect(link.style.visibility).toBe('inherit');
    });

    // The submenu should be hidden.
    const submenuWrapper = document.querySelector('[data-js-menu-container-level="1"]');
    expect(submenuWrapper.style.opacity).toBe('0');
    expect(submenuWrapper.style.visibility).toBe('hidden');

    // The submenu links should be hidden.
    const submenuLinks = document.querySelectorAll('[data-js-menu-link-level="1"]');
    submenuLinks.forEach((link) => {
      expect(link.style.opacity).toBe('0');
      expect(link.style.visibility).toBe('hidden');
    });
  });

  it('should add a `hidden` class to parent `li` items when showing a child menu', async () => {
    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      }
    });
    drilldown.init();

    // Open the submenu.
    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    linkWithSubmenu.click();

    await delay(250);

    // There are two parent menu items in the top-level menu. We want to make sure
    // that the menu item that is not the currently-active item, has a class of `hidden`.
    const nonActiveParentMenuItem = document.querySelector('[data-js-menu-item-level="0"]');
    expect(nonActiveParentMenuItem.classList.contains('hidden')).toBe(true);
  });

  it('should remove inline styles of all children when reset', async () => {
    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
    });
    drilldown.init();

    const elementsInMenu = menu.querySelectorAll('*');
    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');

    linkWithSubmenu.click();
    await delay(250);
    drilldown.reset();

    elementsInMenu.forEach((element) => {
      expect(element.getAttribute('style')).toBe(null);
    });
  });
});

describe('When callbacks are utilised', () => {
  it('should call the onStart callback when a submenu is opened', async () => {
    const onStartCallback = vi.fn();
    const menu = document.getElementById('menu');
    const submenuToBeRevealed = document.querySelector('[data-js-menu-container-level="1"]');
    const topLevelMenu = document.querySelector('[data-js-menu-container-level="0"]');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
        onStart: onStartCallback
      },
    });
    drilldown.init();

    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    linkWithSubmenu.click();

    await delay(250);

    expect(onStartCallback).toHaveBeenCalled();
    expect(onStartCallback).toHaveBeenCalledWith(topLevelMenu, submenuToBeRevealed);
  });

  it('should call the onComplete callback when a submenu has finished opening', async () => {
    const onCompleteCallback = vi.fn();
    const menu = document.getElementById('menu');
    const submenuToBeRevealed = document.querySelector('[data-js-menu-container-level="1"]');
    const topLevelMenu = document.querySelector('[data-js-menu-container-level="0"]');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
        onComplete: onCompleteCallback
      },
    });
    drilldown.init();

    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    linkWithSubmenu.click();

    await delay(250);

    expect(onCompleteCallback).toHaveBeenCalled();
    expect(onCompleteCallback).toHaveBeenCalledWith(topLevelMenu, submenuToBeRevealed);
  });

  it('should call the onStart callback when going back up a level', async () => {
    const onStartCallback = vi.fn();
    const menu = document.getElementById('menu');
    const submenuToBeRevealed = document.querySelector('[data-js-menu-container-level="1"]');
    const topLevelMenu = document.querySelector('[data-js-menu-container-level="0"]');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
      parentTween: {
        inDuration: 0.01,
        outDuration: 0.01,
        onStart: onStartCallback
      }
    });
    drilldown.init();

    // Open the submenu.
    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    linkWithSubmenu.click();
    await delay(250);

    // Navigate back to top-level menu.
    const backLink = document.querySelector('[data-js-menu-back]');
    backLink.click();
    await delay(250);

    expect(onStartCallback).toHaveBeenCalled();
    expect(onStartCallback).toHaveBeenCalledWith(submenuToBeRevealed, topLevelMenu);
  });

  it('should call the onComplete callback after going back up a level', async () => {
    const onCompleteCallback = vi.fn();
    const menu = document.getElementById('menu');
    const submenuToBeRevealed = document.querySelector('[data-js-menu-container-level="1"]');
    const topLevelMenu = document.querySelector('[data-js-menu-container-level="0"]');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
      parentTween: {
        inDuration: 0.01,
        outDuration: 0.01,
        onComplete: onCompleteCallback
      }
    });
    drilldown.init();

    // Open the submenu.
    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    linkWithSubmenu.click();
    await delay(250);

    // Navigate back to top-level menu.
    const backLink = document.querySelector('[data-js-menu-back]');
    backLink.click();
    await delay(250);

    expect(onCompleteCallback).toHaveBeenCalled();
    expect(onCompleteCallback).toHaveBeenCalledWith(submenuToBeRevealed, topLevelMenu);
  });

  it('should call the onReset callback when the menu is reset', async () => {
    const onReset = vi.fn();
    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      onReset
    });
    drilldown.init();

    drilldown.reset();

    await delay(250);
    expect(onReset).toHaveBeenCalled();
  });
});

describe('When the menu is resized', () => {
  it('should maintain the correct height', async () => {
    /**
    * The height we expect the menu to be when a resize event occurs.
    * @type {string}
    */
    const heightOfResizedMenu = '400px';

    // We mock the implementation of the Resize Observer because `happy-dom`, whilst
    // mocking this itself, doesn't provide the necessary functionality to test the
    // ResizeObserver callback.
    vi.spyOn(global, 'ResizeObserver').mockImplementation((callback) => {
      callback(
        [
          {
            target: {
              offsetHeight: parseInt(heightOfResizedMenu),
            },
          },
        ],
        this
      );

      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn()
      };
    });

    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
      parentTween: {
        inDuration: 0.01,
        outDuration: 0.01,
      }
    });
    drilldown.init();

    // Open the submenu.
    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');
    linkWithSubmenu.click();

    // Allow time for the menu to open.
    await delay(250);

    expect(menu.style.height).toBe(heightOfResizedMenu);
  });
});
