import { gsap } from 'gsap';

const DEFAULT_DURATION = 0.2;
const DEFAULT_EASE = 'power1.out';

export class Drilldown {
  /**
   * Initializes a new instance of the Drilldown class.
   * @param {HTMLElement} context - The element to initialize the drilldown on.
   * @param {Object} options - Configuration options for the drilldown.
   */
  constructor(context, options = {}) {
    this.bindThisToMemberFunctions();

    this.context = context;
    this.options = {
      backSelector: options.backSelector || '[data-js-menu-back]',
      nextSelector: options.nextSelector || '[data-js-menu-next]',
      submenuSelector: options.submenuSelector || '[data-js-menu-container]',
      itemSelector: options.itemSelector || '[data-js-menu-item]',
      onReset: options.onReset || null,
      childTween: {
        outDuration: options.childTween?.outDuration || DEFAULT_DURATION,
        outEase: options.childTween?.outEase || DEFAULT_EASE,
        outStagger: options.childTween?.outStagger || 0,
        inDuration: options.childTween?.inDuration || DEFAULT_DURATION,
        inEase: options.childTween?.inEase || DEFAULT_EASE,
        inStagger: options.childTween?.inStagger || 0,
        heightDuration: options.childTween?.heightDuration || DEFAULT_DURATION,
        heightEase: options.childTween?.heightEase || DEFAULT_EASE,
        onStart: options.childTween?.onStart || null,
        onComplete: options.childTween?.onComplete || null,
      },
      parentTween: {
        outDuration: options.parentTween?.outDuration || DEFAULT_DURATION,
        outEase: options.parentTween?.outEase || DEFAULT_EASE,
        outStagger: options.parentTween?.outStagger || 0,
        inDuration: options.parentTween?.inDuration || DEFAULT_DURATION,
        inEase: options.parentTween?.inEase || DEFAULT_EASE,
        inStagger: options.parentTween?.inStagger || 0,
        heightDuration: options.parentTween?.heightDuration || DEFAULT_DURATION,
        heightEase: options.parentTween?.heightEase || DEFAULT_EASE,
        onStart: options.parentTween?.onStart || null,
        onComplete: options.parentTween?.onComplete || null,
      }

    };
    /**
     * Store reference to the active menu item
     * @type {HTMLElement}
     */
    this.activeMenuItem = null;
    /**
     * Store reference to the ResizeObserver
     * @type {ResizeObserver | null}
     */
    this.menuResizeObserver = null;
  }

  /**
   * Binds instance to member functions to preserve the `this` context.
   */
  bindThisToMemberFunctions() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods.forEach(method => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });
  }

  init() {
    this.context.addEventListener('click', this.handleMenuClick);
  }

  /**
   * Handles click events on the menu, determining whether a next or back button was clicked,
   * and initiates the appropriate animation to transition between menus.
   * This function prevents navigation if animations are currently running or if navigation is disabled.
   * It also ensures that the default action for the click event is prevented.
   *
   * @param {MouseEvent} e - The mouse event triggered by clicking on a menu item.
   * @returns {void}
   */
  handleMenuClick(e) {
    if (this.isAnimating) return;
    const target = e.target.closest(this.options.nextSelector) || e.target.closest(this.options.backSelector);
    if (!target) return;

    e.preventDefault();
    const isNextButton = !!target.closest(this.options.nextSelector);
    const currentMenu = target.closest(this.options.submenuSelector);
    const targetMenu = this.getTargetMenu(target, isNextButton);

    if (!targetMenu) return;

    const animation = isNextButton
      ? this.createAnimation(currentMenu, targetMenu, true)
      : this.createAnimation(currentMenu, targetMenu, false);

    animation?.play();
  }

  /**
   * Determines the target menu based on the element that triggered the event.
   * If the action is to navigate to a next (child) menu, it finds the submenu within the active menu item.
   * If the action is to go back, it finds the parent menu of the current submenu.
   *
   * @param {Element} element - The element (typically a button or link) that triggered the navigation action.
   * @param {boolean} isNextButton - A flag indicating whether the navigation action is moving forward to a child menu.
   * @returns {HTMLElement|null} The target menu to navigate to, or null if no target menu can be determined.
 */
  getTargetMenu(element, isNextButton) {
    if (isNextButton) {
      this.activeMenuItem = element.closest(this.options.itemSelector);
      return this.activeMenuItem.querySelector(this.options.submenuSelector);
    }
    else {
      this.activeMenuItem = element.closest(this.options.itemSelector);
      return this.activeMenuItem.closest(this.options.submenuSelector);
    }
  }

  /**
   * Creates the animation for transitioning between menus.
   * This function initializes a GSAP tween for either showing a child menu (next) or a parent menu (back),
   * depending on the direction of navigation. It also sets up onStart and onComplete callbacks for the animation.
   *
   * @param {HTMLElement} currentMenu - The currently active menu that is being transitioned from.
   * @param {HTMLElement} targetMenu - The target menu that is being transitioned to.
   * @param {boolean} isChild - Determines the type of animation to create; true for child menu, false for parent menu.
   * @returns {gsap.core.Timeline} The GSAP timeline instance for the created animation.
   */
  createAnimation(currentMenu, targetMenu, isChild) {
    const tween = isChild ? this.onShowChildTween(currentMenu, targetMenu) : this.onShowParentTween(currentMenu, targetMenu);
    this.setupTweenCallbacks(tween, currentMenu, targetMenu, isChild);
    tween.pause();
    return tween;
  }

  /**
   * Sets up GSAP tween callbacks for menu animations. This method configures onStart and onComplete callbacks
   * for the tween animation based on whether it's an animation for showing a child menu or a parent menu.
   * It integrates both custom callback functions provided via options and internal logic defined in the class.
   *
   * @param {gsap.core.Tween} tween - The GSAP tween instance that controls the menu animation.
   * @param {HTMLElement} currentMenu - The currently active menu element that is being transitioned from.
   * @param {HTMLElement} targetMenu - The target menu element that is being transitioned to.
   * @param {boolean} isChild - Flag to determine if the animation is for showing a child menu (true) or a parent menu (false).
   */
  setupTweenCallbacks(tween, currentMenu, targetMenu, isChild) {
    const tweenOptions = isChild ? this.options.childTween : this.options.parentTween;
    const onShowStart = isChild ? this.onShowChildStart : this.onShowParentStart;
    const onShowComplete = isChild ? this.onShowChildComplete : this.onShowParentComplete;

    tween.eventCallback('onStart', () => {
      if (tweenOptions.onStart) tweenOptions.onStart(currentMenu, targetMenu);
      onShowStart(currentMenu, targetMenu);
    });

    tween.eventCallback('onComplete', () => {
      if (tweenOptions.onComplete) tweenOptions.onComplete(currentMenu, targetMenu);
      onShowComplete(currentMenu, targetMenu);
    });
  }

  /**
   * Creates a ResizeObserver to adjust the height of the drilldown menu.
   * This ensures the menu height matches the content, especially useful when content changes size.
   * @returns {ResizeObserver} The created ResizeObserver instance.
   */
  createMenuResizeObserver() {
    if (!this.menuResizeObserver) {
      this.menuResizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          // Make the root menu dropdown height the same height as the child menu if it resizes in anyway e.g. wraps on new lines, fontsize increase.
          this.context.style.height = entry.target.offsetHeight + 'px';
        }
      });
    }

    return this.menuResizeObserver;
  }

  /**
   * Returns the main list items for a given menu. It does not include supplementary items, for
   * example, the parent link or the back button.
   * @param {HTMLElement} menu
   * @returns {NodeList}
   */
  getMenuListItems(menu) {
    const items = menu.querySelectorAll(`:scope > ul > ${this.options.itemSelector}`);

    return items;
  }

  /**
   * Returns the elements that will be hidden when a menu is transitioning.
   * @param {HTMLElement} menu
   * @returns {NodeList}
   */
  getElementsToHideForMenuTransition(menu) {
    const menuItemLinks = menu.querySelectorAll(`:scope > ul > ${this.options.itemSelector} > [data-js-menu-link]`);
    const backButton = menu.querySelector(`${this.options.backSelector}`);
    const parentLink = menu.querySelector('[data-js-menu-parent]');
    const combinedMenuItems = [backButton, parentLink, ...menuItemLinks];

    return combinedMenuItems;
  }


  /**
   * Calls a user-specified callback if it exists. This module has its own
   * internal callbacks, but we also allow the user to specify their own.
   * @param {String} callback The name of the callback to call.
   * @param {Object} args The arguments to pass to the callback.
   * @returns {Void}
  */
  callUserSpecifiedCallback(callback, args) {
    if (this?.options?.[callback]) {
      this.options[callback](args);
    }
  }

  /**
   * A combination of the module's own onShowChildStart callback and, if supplied,
   * the user's onShowChildStart callback. The onShowChildStart callback will fire at the beginning
   * of the animation that is responsible for revealing a submenu.
   * @param {Object}
   */
  onShowChildStart(currentMenu, targetmenu) {
    currentMenu.scrollTop = 0;
    targetmenu.scrollTop = 0;
    this.isAnimating = true;

    this.callUserSpecifiedCallback('onShowChildStart', {
      currentMenu,
      targetmenu,
    });
  }

  /**
   * A combination of the module's own onShowChildComplete callback and, if supplied,
   * the user's onShowChildComplete callback. The onShowChildComplete callback will fire at the end
   * of the animation that is responsible for revealing a submenu.
   * @param {Object}
   */
  onShowChildComplete(currentMenu, targetMenu) {
    this.isAnimating = false;

    /**
    * Hide the currentMenu items so that it's never longer than the new targetMenu which comes over the top.
    */
    const currentMenuItems = this.getMenuListItems(this.activeMenuItem);
    currentMenuItems.forEach((currentMenuItem) => {
      if (currentMenuItem !== this.activeMenuItem) {
        currentMenuItem.classList.add('hidden');
      }
    });

    // Stop observing the previous menu
    if (this.menuResizeObserver) {
      this.menuResizeObserver.unobserve(currentMenu);
    }

    // Set up resizeObserver on the new targetMenu
    const menuResizeObserver = this.createMenuResizeObserver();
    menuResizeObserver.observe(targetMenu);

    this.callUserSpecifiedCallback('onShowChildComplete', {
      currentMenu,
      targetMenu,
    });
  }

  /**
   * A combination of the module's own onShowParentStart callback and, if supplied,
   * the user's onShowParentStart callback. The onShowParentStart callback will fire at the start
   * of the animation that is responsible for revealing a parent menu / hiding the current menu.
   * @param {Object}
   */
  onShowParentStart(currentMenu, targetMenu) {
    this.isAnimating = true;

    const targetMenuItems = this.getMenuListItems(targetMenu);
    targetMenuItems.forEach((targetMenuItem) => {
      targetMenuItem.classList.remove('hidden');
    });

    this.callUserSpecifiedCallback('onShowParentStart', {
      currentMenu,
      targetMenu,
    });
  }

  /**
   * A combination of the module's own onShowParentComplete callback and, if supplied,
   * the user's onShowParentComplete callback. The onShowParentComplete callback will fire at the end
   * of the animation that is responsible for revealing a parent menu / hiding the current menu.
   * @param {Object}
   */
  onShowParentComplete(currentMenu, targetMenu) {
    this.isAnimating = false;

    // Stop observing the current menu
    if (this.menuResizeObserver) {
      this.menuResizeObserver.unobserve(currentMenu);
    }

    // We only need to set up a new resizeObserve for menus that are NOT the root menu because we need to tell
    // the root menu of content height changes.  The root menu isn't position:absolute so it will grow with the content.
    if (targetMenu == this.context) {
      this.context.style.height = 'auto';
    } else {
      const menuResizeObserver = this.createMenuResizeObserver();
      menuResizeObserver.observe(targetMenu);
    }

    this.callUserSpecifiedCallback('onShowParentComplete', {
      currentMenu,
      targetMenu,
    });
  }

  /**
   * Generates the tween animation for showing a child menu.
   * This method configures the animation sequence for transitioning to a submenu.
   * @param {HTMLElement} currentMenu - The currently active menu.
   * @param {HTMLElement} targetMenu - The submenu to be displayed.
   * @returns {gsap.core.Timeline} The GSAP timeline for the animation.
   */
  onShowChildTween(currentMenu, targetMenu) {
    const submenuHeight = targetMenu.offsetHeight;
    const currentMenuItems = this.getElementsToHideForMenuTransition(currentMenu);
    const submenuItems = this.getElementsToHideForMenuTransition(targetMenu);
    const tl = new gsap.timeline();

    tl.to(currentMenuItems, {
      autoAlpha: 0,
      x: -20,
      duration: this.options.childTween.outDuration,
      ease: this.options.childTween.outEase,
      stagger: this.options.childTween.outStagger,
    });

    tl.to(this.context, {
      height: `${submenuHeight}px`,
      duration: this.options.childTween.heightDuration,
      ease: this.options.childTween.heightEase,
    });

    tl.set(targetMenu, {
      autoAlpha: 1,
    });

    tl.fromTo(submenuItems, {
      autoAlpha: 0,
      x: 20,
    }, {
      autoAlpha: 1,
      x: 0,
      duration: this.options.childTween.inDuration,
      ease: this.options.childTween.inEase,
      stagger: this.options.childTween.inStagger,
    });

    return tl;
  }

  /**
   * Generates the tween animation for showing a parent menu.
   * This method configures the animation sequence for transitioning back to a parent menu.
   * @param {HTMLElement} currentMenu - The currently active submenu.
   * @param {HTMLElement} targetMenu - The parent menu to be displayed.
   * @returns {gsap.core.Timeline} The GSAP timeline for the animation.
   */
  onShowParentTween = (currentMenu, targetMenu) => {
    const parentMenuItems = this.getElementsToHideForMenuTransition(targetMenu);
    const currentMenuItems = this.getElementsToHideForMenuTransition(currentMenu);

    const tl = new gsap.timeline();

    tl.to(currentMenuItems, {
      x: 20,
      autoAlpha: 0,
      duration: this.options.parentTween.outDuration,
      ease: this.options.parentTween.outEase,
      stagger: this.options.parentTween.outStagger,
    });

    tl.to(this.context, {
      // This is calculated at runtime because the height of the parent menu changes
      // just before we animate it in: see the 'onShowParentStart' callback.
      height: () => {
        // We need to get the natural height of the targetMenu because we're animating the height of the root menu and eventually
        // when traversing up we need to read the natural height of the root menu
        const naturalHeight = this.getNaturalHeight(targetMenu);
        return `${naturalHeight}px`;
      },
      duration: this.options.parentTween.heightDuration,
      ease: this.options.parentTween.heightEase,
    });

    tl.set(currentMenu, {
      autoAlpha: 0,
    });

    tl.to(parentMenuItems, {
      autoAlpha: 1,
      x: 0,
      duration: this.options.parentTween.inDuration,
      ease: this.options.parentTween.inEase,
      stagger: this.options.parentTween.inStagger,
    });

    return tl;
  };

  /**
   * Removes all inline styles from elements within a given context.
   * This is particularly useful for cleaning up after dynamic style changes during menu animations.
   * @param {HTMLElement} context - The context within which to remove inline styles.
   */
  removeInlineStylesFromChildren(context) {
    context.querySelectorAll('[style]').forEach((element) => {
      gsap.set(element, {
        clearProps: 'all',
        overwrite: true,
      });
    });
  }

  /**
   * Calculates the natural height of an element, disregarding any explicitly set heights.
   * This is useful for animations that need to adjust to the content's natural size.
   * @param {HTMLElement} element - The element to measure.
   * @returns {number} The natural height of the element.
   */
  getNaturalHeight(element) {
    const cachedHeight = element.offsetHeight;
    element.style.height = 'auto';
    const naturalHeight = element.offsetHeight;
    element.style.height = `${cachedHeight}px`;

    return naturalHeight;
  }

  /**
   * Resets the menu items to their initial state, removing any dynamic modifications.
   * This method is typically called when the menu is being reset or destroyed.
   */
  resetMenuListItems() {
    const listItems = this.context.querySelectorAll(this.options.itemSelector);
    listItems.forEach((listItem) => {
      listItem.classList.remove('hidden');
    });
  }

  /**
   * Resets the drilldown menu to its initial state, removing any dynamic styles or selections.
   * This is useful for cleaning up and preparing the menu for another interaction.
   */
  reset() {
    this.isAnimating = false;
    this.callUserSpecifiedCallback('onReset');
    this.resetMenuListItems();
    this.removeInlineStylesFromChildren(this.context);

    /**
    * There's a chance that the menuResizeObserver is still observing a menu if the user as gone down a level
    * therefore we want to disconnect it to prevent it firing when the menu is reset (dropdown is closed)
    */
    if (this.menuResizeObserver) {
      this.menuResizeObserver.disconnect();
    }
  }

  /**
   * Cleans up event listeners and resets the menu, preparing the instance for garbage collection.
   * This method should be called to prevent memory leaks when the drilldown menu is no longer needed.
   */
  destroy() {
    this.context.removeEventListener('click', this.handleMenuClick);
    this.reset();
  }
}
