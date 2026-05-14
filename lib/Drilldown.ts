import { gsap } from 'gsap';

const DEFAULT_DURATION = 0.2 as const;
const DEFAULT_EASE = 'power1.out' as const;

type TweenCallback = (currentMenu: HTMLElement, targetMenu: HTMLElement) => void;

type TweenOptions = {
  outDuration: number;
  outEase: string;
  outStagger: number;
  inDuration: number;
  inEase: string;
  inStagger: number;
  /**
   * Duration in seconds for height transition animations.
   */
  heightDuration: number;
  /**
   * Easing function for height transition animations.
   */
  heightEase: string;
  onStart?: TweenCallback | null;
  onComplete?: TweenCallback | null;
};

/**
 * Configuration options for initializing a Drilldown instance.
 * Defines selectors for menu elements and animation behavior customization.
 */
type DrilldownOptions = {
  backSelector?: string;
  nextSelector?: string;
  submenuSelector?: string;
  itemSelector?: string;
  /**
   * Callback function executed when the drilldown menu is reset.
   * Useful for custom cleanup or state management.
   */
  onReset?: (() => void) | null;
  /**
   * Animation configuration (options) for child menu transitions.
   * Partial TweenOptions allowing selective override of default values.
   */
  childTweenOptions?: Partial<TweenOptions>;
  /**
   * Animation configuration (options) for parent menu transitions.
   * Partial TweenOptions allowing selective override of default values.
   */
  parentTweenOptions?: Partial<TweenOptions>;
};

type ResolvedDrilldownOptions = {
  readonly backSelector: string;
  readonly nextSelector: string;
  readonly submenuSelector: string;
  readonly itemSelector: string;
  readonly onReset: (() => void) | null;
  readonly childTweenOptions: TweenOptions;
  readonly parentTweenOptions: TweenOptions;
};

class Drilldown {
  private readonly context: HTMLElement;
  private readonly options: ResolvedDrilldownOptions;
  private activeMenuItem: HTMLElement | null = null;
  private menuResizeObserver: ResizeObserver | null = null;
  private isAnimating = false;

  /**
   * Initializes a new instance of the Drilldown class.
   * @param context - The element to initialize the drilldown on.
   * @param options
   */
  constructor(context: HTMLElement, options: DrilldownOptions = {}) {
    this.bindThisToMemberFunctions();

    this.context = context;

    const childTweenOptions = options.childTweenOptions;
    const parentTweenOptions = options.parentTweenOptions;

    this.options = {
      backSelector: options.backSelector || '[data-js-menu-back]',
      nextSelector: options.nextSelector || '[data-js-menu-next]',
      submenuSelector: options.submenuSelector || '[data-js-menu-container]',
      itemSelector: options.itemSelector || '[data-js-menu-item]',
      onReset: options.onReset || null,
      childTweenOptions: {
        outDuration: childTweenOptions?.outDuration || DEFAULT_DURATION,
        outEase: childTweenOptions?.outEase || DEFAULT_EASE,
        outStagger: childTweenOptions?.outStagger || 0,
        inDuration: childTweenOptions?.inDuration || DEFAULT_DURATION,
        inEase: childTweenOptions?.inEase || DEFAULT_EASE,
        inStagger: childTweenOptions?.inStagger || 0,
        heightDuration: childTweenOptions?.heightDuration || DEFAULT_DURATION,
        heightEase: childTweenOptions?.heightEase || DEFAULT_EASE,
        onStart: childTweenOptions?.onStart || null,
        onComplete: childTweenOptions?.onComplete || null,
      },
      parentTweenOptions: {
        outDuration: parentTweenOptions?.outDuration || DEFAULT_DURATION,
        outEase: parentTweenOptions?.outEase || DEFAULT_EASE,
        outStagger: parentTweenOptions?.outStagger || 0,
        inDuration: parentTweenOptions?.inDuration || DEFAULT_DURATION,
        inEase: parentTweenOptions?.inEase || DEFAULT_EASE,
        inStagger: parentTweenOptions?.inStagger || 0,
        heightDuration: parentTweenOptions?.heightDuration || DEFAULT_DURATION,
        heightEase: parentTweenOptions?.heightEase || DEFAULT_EASE,
        onStart: parentTweenOptions?.onStart || null,
        onComplete: parentTweenOptions?.onComplete || null,
      }
    };

    /**
     * Store reference to the active menu item
     */
    this.activeMenuItem = null;
    /**
     * Store reference to the ResizeObserver
     */
    this.menuResizeObserver = null;
  }

  /**
   * Binds instance to member functions to preserve the `this` context.
   */
  private bindThisToMemberFunctions(): void {
    type InstanceType = Record<string, unknown>;

    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    const instance = this as InstanceType;

    methods.forEach((method: string) => {
      const property = instance[method];
      if (typeof property === 'function') {
        instance[method] = (property as (...args: unknown[]) => unknown).bind(this);
      }
    });
  }

  public init(): void {
    this.context.addEventListener('click', this.handleMenuClick);
  }

  /**
   * Handles click events on the menu, determining whether a next or back button was clicked,
   * and initiates the appropriate animation to transition between menus.
   * This function prevents navigation if animations are currently running or if navigation is disabled.
   * It also ensures that the default action for the click event is prevented.
   */
  private handleMenuClick = (e: MouseEvent): void => {
    if (this.isAnimating) return;

    const clickedElement = e.target as HTMLElement;
    const target = clickedElement.closest<HTMLElement>(this.options.nextSelector) ?? clickedElement.closest(this.options.backSelector);
    if (!target) return;

    e.preventDefault();
    const isNextButton = !!target.closest(this.options.nextSelector);
    const currentMenu = target.closest<HTMLElement>(this.options.submenuSelector);
    if (!currentMenu) return;

    const targetMenu = this.getTargetMenu(target, isNextButton);
    if (!targetMenu) return;

    const animation = isNextButton
      ? this.createAnimation(currentMenu, targetMenu, true)
      : this.createAnimation(currentMenu, targetMenu, false);

    animation.play();
  };

  /**
   * Determines the target menu based on the element that triggered the event.
   * If the action is to navigate to a next (child) menu, it finds the submenu within the active menu item.
   * If the action is to go back, it finds the parent menu of the current submenu.
   *
   * @param element - The element (typically a button or link) that triggered the navigation action.
   * @param isNextButton - A flag indicating whether the navigation action is moving forward to a child menu.
   * @returns The target menu to navigate to, or null if no target menu can be determined.
 */
  private getTargetMenu(element: HTMLElement, isNextButton: boolean): HTMLElement | null {
    this.activeMenuItem = element.closest<HTMLElement>(this.options.itemSelector);
    if (!this.activeMenuItem) return null;

    if (isNextButton) {
      return this.activeMenuItem.querySelector(this.options.submenuSelector);
    } else {
      return this.activeMenuItem.closest(this.options.submenuSelector);
    }
  }

  /**
   * Creates the animation for transitioning between menus.
   * This function initializes a GSAP tween for either showing a child menu (next) or a parent menu (back),
   * depending on the direction of navigation. It also sets up onStart and onComplete callbacks for the animation.
   *
   * @param currentMenu - The currently active menu that is being transitioned from.
   * @param targetMenu - The target menu that is being transitioned to.
   * @param isChild - Determines the type of animation to create; true for child menu, false for parent menu.
   * @returns The GSAP timeline instance for the created animation.
   */
  private createAnimation(currentMenu: HTMLElement, targetMenu: HTMLElement, isChild: boolean): gsap.core.Timeline {
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
   * @param tween - The GSAP tween instance that controls the menu animation.
   * @param currentMenu - The currently active menu element that is being transitioned from.
   * @param targetMenu - The target menu element that is being transitioned to.
   * @param isChild - Flag to determine if the animation is for showing a child menu (true) or a parent menu (false).
   */
  private setupTweenCallbacks(tween: gsap.core.Timeline, currentMenu: HTMLElement, targetMenu: HTMLElement, isChild: boolean): void {
    const tweenOptions = isChild ? this.options.childTweenOptions : this.options.parentTweenOptions;
    const onShowStart = isChild ? this.onShowChildStart : this.onShowParentStart;
    const onShowComplete = isChild ? this.onShowChildComplete : this.onShowParentComplete;

    tween.eventCallback('onStart', () => {
      tweenOptions.onStart?.(currentMenu, targetMenu);
      onShowStart(currentMenu, targetMenu);
    });

    tween.eventCallback('onComplete', () => {
      tweenOptions.onComplete?.(currentMenu, targetMenu);
      onShowComplete(currentMenu, targetMenu);
    });
  }

  /**
   * Creates a ResizeObserver to adjust the height of the drilldown menu.
   * This ensures the menu height matches the content, especially useful when content changes size.
   */
  private createMenuResizeObserver(): ResizeObserver {
    if (!this.menuResizeObserver) {
      this.menuResizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          // Make the root menu dropdown height the same height as the child menu if it resizes in anyway e.g. wraps on new lines, fontsize increase.
          const target = entry.target as HTMLElement;
          this.context.style.height = `${target.offsetHeight}px`;
        }
      });
    }

    return this.menuResizeObserver;
  }

  /**
   * Returns the main list items for a given menu. It does not include supplementary items, for
   * example, the parent link or the back button.
   * @param menu
   */
  private getMenuListItems(menu: HTMLElement): HTMLElement[] {
    const childMenu = menu.querySelector<HTMLElement>('[data-js-menu-list]');

    if (!childMenu) return [];

    const childMenuitems = Array.from(childMenu.children).filter((item) => (item as HTMLElement).matches(this.options.itemSelector)) as HTMLElement[];

    return childMenuitems;
  }

  /**
   * Finds this menu's own back button (or parent link) - not one belonging to a nested
   * submenu - regardless of where it sits in the markup.
   * @param menu - The menu we want the element for.
   * @param selector - Selector for the back button or parent link.
   */
  private findOwnMenuElement(menu: HTMLElement, selector: string): HTMLElement | null {
    const matches = Array.from(menu.querySelectorAll<HTMLElement>(selector));
    return matches.find((match) => match.closest(this.options.submenuSelector) === menu) ?? null;
  }

  /**
   * Returns the elements that fade in/out when a menu transitions: the back button, the
   * parent link, and each item's link. The root menu has no back button or parent link, so
   * any missing elements are filtered out before returning.
   * @param menu
   */
  private getElementsToHideForMenuTransition(menu: HTMLElement): HTMLElement[] {
    const menuItems = this.getMenuListItems(menu);
    const menuItemLinks = menuItems.map((item) => item.querySelector<HTMLElement>('[data-js-menu-link]'));

    const backButton = this.findOwnMenuElement(menu, this.options.backSelector);
    const parentLink = this.findOwnMenuElement(menu, '[data-js-menu-parent]');
    return [backButton, parentLink, ...menuItemLinks].filter((element): element is HTMLElement => element !== null);
  }

  /**
   * The callback that is fired when the menu navigates down a level.
   */
  private onShowChildStart(currentMenu: HTMLElement, targetMenu: HTMLElement): void {
    currentMenu.scrollTop = 0;
    targetMenu.scrollTop = 0;
    this.isAnimating = true;
  }

  /**
   * The callback that is fired after the menu has moved down a level.
   */
  private onShowChildComplete(currentMenu: HTMLElement, targetMenu: HTMLElement): void {
    this.isAnimating = false;

    /**
    * Hide the currentMenu items so that it's never longer than the new targetMenu which comes over the top.
    */
    const currentMenuItems = this.getMenuListItems(currentMenu);
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
  }

  /**
   * The callback that is fired when the menu navigates up a level.
   */
  private onShowParentStart(_currentMenu: HTMLElement, targetMenu: HTMLElement): void {
    this.isAnimating = true;

    const targetMenuItems = this.getMenuListItems(targetMenu);
    targetMenuItems.forEach((targetMenuItem) => {
      targetMenuItem.classList.remove('hidden');
    });
  }

  /**
   * The callback that is fired after the menu has moved up a level.
   */
  private onShowParentComplete(currentMenu: HTMLElement, targetMenu: HTMLElement): void {
    this.isAnimating = false;

    // Stop observing the current menu
    if (this.menuResizeObserver) {
      this.menuResizeObserver.unobserve(currentMenu);
    }

    // We only need to set up a new resizeObserve for menus that are NOT the root menu because we need to tell
    // the root menu of content height changes.  The root menu isn't position:absolute so it will grow with the content.
    if (targetMenu === this.context) {
      this.context.style.height = 'auto';
    } else {
      const menuResizeObserver = this.createMenuResizeObserver();
      menuResizeObserver.observe(targetMenu);
    }
  }

  /**
   * Generates the tween animation for showing a child menu.
   * This method configures the animation sequence for transitioning to a submenu.
   * @param currentMenu - The currently active menu.
   * @param targetMenu - The submenu to be displayed.
   */
  private onShowChildTween(currentMenu: HTMLElement, targetMenu: HTMLElement): gsap.core.Timeline {
    const submenuHeight = targetMenu.offsetHeight;
    const currentMenuItems = this.getElementsToHideForMenuTransition(currentMenu);
    const submenuItems = this.getElementsToHideForMenuTransition(targetMenu);
    const tl = gsap.timeline();

    tl.to(currentMenuItems, {
      autoAlpha: 0,
      x: -20,
      duration: this.options.childTweenOptions.outDuration,
      ease: this.options.childTweenOptions.outEase,
      stagger: this.options.childTweenOptions.outStagger,
    });

    tl.to(this.context, {
      height: `${submenuHeight}px`,
      duration: this.options.childTweenOptions.heightDuration,
      ease: this.options.childTweenOptions.heightEase,
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
      duration: this.options.childTweenOptions.inDuration,
      ease: this.options.childTweenOptions.inEase,
      stagger: this.options.childTweenOptions.inStagger,
    });

    return tl;
  }

  /**
   * Generates the tween animation for showing a parent menu.
   * This method configures the animation sequence for transitioning back to a parent menu.
   * @param currentMenu - The currently active submenu.
   * @param targetMenu - The parent menu to be displayed.
   */
  private onShowParentTween = (currentMenu: HTMLElement, targetMenu: HTMLElement): gsap.core.Timeline => {
    const parentMenuItems = this.getElementsToHideForMenuTransition(targetMenu);
    const currentMenuItems = this.getElementsToHideForMenuTransition(currentMenu);

    const tl = gsap.timeline();

    tl.to(currentMenuItems, {
      x: 20,
      autoAlpha: 0,
      duration: this.options.parentTweenOptions.outDuration,
      ease: this.options.parentTweenOptions.outEase,
      stagger: this.options.parentTweenOptions.outStagger,
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
      duration: this.options.parentTweenOptions.heightDuration,
      ease: this.options.parentTweenOptions.heightEase,
    });

    tl.set(currentMenu, {
      autoAlpha: 0,
    });

    tl.to(parentMenuItems, {
      autoAlpha: 1,
      x: 0,
      duration: this.options.parentTweenOptions.inDuration,
      ease: this.options.parentTweenOptions.inEase,
      stagger: this.options.parentTweenOptions.inStagger,
    });

    return tl;
  };

  /**
   * Removes all inline styles from elements within a given context.
   * This is particularly useful for cleaning up after dynamic style changes during menu animations.
   * @param context - The context within which to remove inline styles.
   */
  private removeInlineStyles(context: HTMLElement): void {
    // Create an array of child elements with inline styles as we might need to also add the context element
    const elementsWithStyles = Array.from(context.querySelectorAll<HTMLElement>('[style]'));

    // Include the context element if it has inline styles
    if (context.hasAttribute('style')) {
      elementsWithStyles.push(context);
    }

    elementsWithStyles.forEach((element) => {
      gsap.set(element, {
        clearProps: 'all',
        overwrite: true,
      });
    });
  }

  /**
   * Calculates the natural height of an element, disregarding any explicitly set heights.
   * This is useful for animations that need to adjust to the content's natural size.
   * @param element - The element to measure.
   */
  private getNaturalHeight(element: HTMLElement): number {
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
  private resetMenuListItems(): void {
    const listItems = this.context.querySelectorAll<HTMLElement>(this.options.itemSelector);
    listItems.forEach((listItem) => {
      listItem.classList.remove('hidden');
    });
  }

  /**
   * Resets the drilldown menu to its initial state, removing any dynamic styles or selections.
   * This is useful for cleaning up and preparing the menu for another interaction.
   */
  public reset(): void {
    this.isAnimating = false;

    if (typeof this.options.onReset === 'function') {
      this.options.onReset();
    }

    this.resetMenuListItems();
    this.removeInlineStyles(this.context);

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
  public destroy(): void {
    this.context.removeEventListener('click', this.handleMenuClick);
    this.reset();
  }
}

export { Drilldown, type DrilldownOptions, type TweenOptions, type TweenCallback };
