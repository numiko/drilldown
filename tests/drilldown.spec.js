import { Window } from 'happy-dom';
import { expect, describe, it, vi, beforeEach, afterEach } from 'vitest';
import { Drilldown } from '../lib/Drilldown';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Read the HTML document content
const htmlDocumentContent = `
  <div id="menu" class="overflow-hidden bg-black text-white relative top-full left-0 w-full" data-js-menu-container data-js-menu-container-level="0" aria-hidden="false">
    <ul class="flex flex-col">
      <li data-js-menu-item data-js-menu-item-level="0">
        <a class="flex gap-4 w-full text-left items-center justify-between px-9 py-7 group" href="http://www.example.com" data-js-menu-link data-js-menu-link-level="0">
          <span>Top level 1</span>
        </a>
      </li>
      <li data-js-menu-item data-js-menu-item-level="0">
        <button class="flex gap-4 w-full text-left items-center justify-between px-9 py-7 group" type="button" data-js-menu-link data-js-menu-link-level="0" data-js-menu-next aria-controls="menu_1">
          <span>Top level 2</span>
        </button>
        <div id="menu_1" class="invisible absolute z-10 w-full top-0" data-js-menu-container data-js-menu-container-level="1">
          <button class="flex gap-4 w-full text-left items-center justify-start px-9 py-7 group" data-js-menu-back>
            <span>Go back</span>
          </button>
          <div>
            <a class="flex w-full text-left items-center justify-between px-9 py-7 group" data-js-menu-parent href="http://www.example.com">Top level 2</a>
          </div>
          <ul class="flex flex-col">
            <li data-js-menu-item data-js-menu-item-level="1">
              <a class="flex gap-4 w-full text-left items-center justify-between px-9 py-7 group" href="http://www.example.com" data-js-menu-link data-js-menu-link-level="1">
                <span>Second level 1</span>
              </a>
            </li>
            <li data-js-menu-item data-js-menu-item-level="1">
              <a class="flex gap-4 w-full text-left items-center justify-between px-9 py-7 group" href="http://www.example.com" data-js-menu-link data-js-menu-link-level="1">
                <span>Second level 3</span>
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
`;

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
  vi.unstubAllGlobals();
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
    expect(drilldown.options.childTweenOptions.outDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.childTweenOptions.inDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.childTweenOptions.outEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.childTweenOptions.inEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.childTweenOptions.inStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.childTweenOptions.outStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.parentTweenOptions.outDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.parentTweenOptions.inDuration).toBe(DEFAULT_DURATION);
    expect(drilldown.options.parentTweenOptions.outEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.parentTweenOptions.inEase).toBe(DEFAULT_EASE);
    expect(drilldown.options.parentTweenOptions.inStagger).toBe(DEFAULT_STAGGER);
    expect(drilldown.options.parentTweenOptions.outStagger).toBe(DEFAULT_STAGGER);
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

  it('should correctly initialize with custom childTweenOptions options', () => {
    const menuElement = document.getElementById('menu');
    const IN_DURATION = 0.5;
    const OUT_DURATION = 0.5;
    const IN_EASE = 'power2.in';
    const OUT_EASE = 'power2.out';
    const IN_STAGGER = 0.1;
    const OUT_STAGGER = 0.1;

    drilldown = new Drilldown(menuElement, {
      childTweenOptions: {
        inDuration: 0.5,
        outDuration: 0.5,
        inEase: 'power2.in',
        outEase: 'power2.out',
        inStagger: 0.1,
        outStagger: 0.1,
      },
    });

    expect(drilldown.options.childTweenOptions.outDuration).toBe(IN_DURATION);
    expect(drilldown.options.childTweenOptions.inDuration).toBe(OUT_DURATION);
    expect(drilldown.options.childTweenOptions.outEase).toBe(OUT_EASE);
    expect(drilldown.options.childTweenOptions.inEase).toBe(IN_EASE);
    expect(drilldown.options.childTweenOptions.inStagger).toBe(IN_STAGGER);
    expect(drilldown.options.childTweenOptions.outStagger).toBe(OUT_STAGGER);
  });

  it('should correctly initialize with custom parentTweenOptions options', () => {
    const menuElement = document.getElementById('menu');
    const IN_DURATION = 0.5;
    const OUT_DURATION = 0.5;
    const IN_EASE = 'power2.in';
    const OUT_EASE = 'power2.out';
    const IN_STAGGER = 0.1;
    const OUT_STAGGER = 0.1;

    drilldown = new Drilldown(menuElement, {
      parentTweenOptions: {
        inDuration: 0.5,
        outDuration: 0.5,
        inEase: 'power2.in',
        outEase: 'power2.out',
        inStagger: 0.1,
        outStagger: 0.1,
      },
    });

    expect(drilldown.options.parentTweenOptions.outDuration).toBe(IN_DURATION);
    expect(drilldown.options.parentTweenOptions.inDuration).toBe(OUT_DURATION);
    expect(drilldown.options.parentTweenOptions.outEase).toBe(OUT_EASE);
    expect(drilldown.options.parentTweenOptions.inEase).toBe(IN_EASE);
    expect(drilldown.options.parentTweenOptions.inStagger).toBe(IN_STAGGER);
    expect(drilldown.options.parentTweenOptions.outStagger).toBe(OUT_STAGGER);
  });
});

describe('Interacting with the menu', () => {
  it('should reveal a submenu when a link is clicked that has a submenu', async () => {
    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTweenOptions: {
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
      childTweenOptions: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
      parentTweenOptions: {
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
      childTweenOptions: {
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

  it('should remove inline styles on root menu and all children when reset', async () => {
    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTweenOptions: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
    });
    drilldown.init();

    const elementsWithStyles = Array.from(menu.querySelectorAll('[style]'));
    elementsWithStyles.push(menu);

    const linkWithSubmenu = document.querySelector('[data-js-menu-next]');

    linkWithSubmenu.click();
    await delay(250);
    drilldown.reset();

    elementsWithStyles.forEach((element) => {
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
      childTweenOptions: {
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
      childTweenOptions: {
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
      childTweenOptions: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
      parentTweenOptions: {
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
      childTweenOptions: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
      parentTweenOptions: {
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

    vi.stubGlobal('ResizeObserver', class {
      constructor(callback) {
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
      }

      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    });

    const menu = document.getElementById('menu');
    const drilldown = new Drilldown(menu, {
      childTweenOptions: {
        inDuration: 0.01,
        outDuration: 0.01,
      },
      parentTweenOptions: {
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

describe('When the back button is not the first element in a submenu', () => {
  // The level 1 back button sits after the list, so the nested level 2 menu (and its
  // back button and parent link) come before it in the markup.
  const backButtonAfterListMarkup = `
    <div id="menu" data-js-menu-container data-js-menu-container-level="0">
      <ul>
        <li data-js-menu-item data-js-menu-item-level="0">
          <a href="http://www.example.com" data-js-menu-link data-js-menu-link-level="0">Top level 1</a>
        </li>
        <li data-js-menu-item data-js-menu-item-level="0">
          <button type="button" data-js-menu-link data-js-menu-link-level="0" data-js-menu-next>Top level 2</button>
          <div data-js-menu-container data-js-menu-container-level="1">
            <div>
              <a href="http://www.example.com" data-js-menu-parent data-js-menu-parent-level="1">Top level 2</a>
            </div>
            <ul>
              <li data-js-menu-item data-js-menu-item-level="1">
                <button type="button" data-js-menu-link data-js-menu-link-level="1" data-js-menu-next>Second level 1</button>
                <div data-js-menu-container data-js-menu-container-level="2">
                  <div>
                    <a href="http://www.example.com" data-js-menu-parent data-js-menu-parent-level="2">Second level 1</a>
                  </div>
                  <button type="button" data-js-menu-back data-js-menu-back-level="2">Go back</button>
                  <ul>
                    <li data-js-menu-item data-js-menu-item-level="2">
                      <a href="http://www.example.com" data-js-menu-link data-js-menu-link-level="2">Third level 1</a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
            <button type="button" data-js-menu-back data-js-menu-back-level="1">Go back</button>
          </div>
        </li>
      </ul>
    </div>
  `;

  const fastTweens = {
    childTweenOptions: { inDuration: 0.01, outDuration: 0.01 },
    parentTweenOptions: { inDuration: 0.01, outDuration: 0.01 },
  };

  beforeEach(() => {
    document.body.innerHTML = backButtonAfterListMarkup;
  });

  it('should animate in the submenu\'s own back button and leave nested ones untouched', async () => {
    const drilldown = new Drilldown(document.getElementById('menu'), fastTweens);
    drilldown.init();

    document.querySelector('[data-js-menu-next]').click();
    await delay(250);

    const ownBackButton = document.querySelector('[data-js-menu-back-level="1"]');
    expect(ownBackButton.style.opacity).toBe('1');
    expect(ownBackButton.style.visibility).toBe('inherit');

    // The level 2 back button and parent link belong to a menu that has not been opened.
    expect(document.querySelector('[data-js-menu-back-level="2"]').getAttribute('style')).toBe(null);
    expect(document.querySelector('[data-js-menu-parent-level="2"]').getAttribute('style')).toBe(null);
  });

  it('should animate out the submenu\'s own back button when going back', async () => {
    const drilldown = new Drilldown(document.getElementById('menu'), fastTweens);
    drilldown.init();

    document.querySelector('[data-js-menu-next]').click();
    await delay(250);

    const ownBackButton = document.querySelector('[data-js-menu-back-level="1"]');
    ownBackButton.click();
    await delay(250);

    expect(ownBackButton.style.opacity).toBe('0');
    expect(ownBackButton.style.visibility).toBe('hidden');
    expect(document.querySelector('[data-js-menu-back-level="2"]').getAttribute('style')).toBe(null);
  });
});
