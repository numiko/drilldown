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
declare class Drilldown {
    private readonly context;
    private readonly options;
    private activeMenuItem;
    private menuResizeObserver;
    private isAnimating;
    /**
     * Initializes a new instance of the Drilldown class.
     * @param context - The element to initialize the drilldown on.
     * @param options
     */
    constructor(context: HTMLElement, options?: DrilldownOptions);
    /**
     * Binds instance to member functions to preserve the `this` context.
     */
    private bindThisToMemberFunctions;
    init(): void;
    /**
     * Handles click events on the menu, determining whether a next or back button was clicked,
     * and initiates the appropriate animation to transition between menus.
     * This function prevents navigation if animations are currently running or if navigation is disabled.
     * It also ensures that the default action for the click event is prevented.
     */
    private handleMenuClick;
    /**
     * Determines the target menu based on the element that triggered the event.
     * If the action is to navigate to a next (child) menu, it finds the submenu within the active menu item.
     * If the action is to go back, it finds the parent menu of the current submenu.
     *
     * @param element - The element (typically a button or link) that triggered the navigation action.
     * @param isNextButton - A flag indicating whether the navigation action is moving forward to a child menu.
     * @returns The target menu to navigate to, or null if no target menu can be determined.
   */
    private getTargetMenu;
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
    private createAnimation;
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
    private setupTweenCallbacks;
    /**
     * Creates a ResizeObserver to adjust the height of the drilldown menu.
     * This ensures the menu height matches the content, especially useful when content changes size.
     */
    private createMenuResizeObserver;
    /**
     * Returns the main list items for a given menu. It does not include supplementary items, for
     * example, the parent link or the back button.
     *
     * The list is the menu's own `[data-js-menu-list]` element. Markup without that attribute
     * falls back to the menu's first direct child `ul`, so existing 2.x markup keeps working.
     * @param menu
     */
    private getMenuListItems;
    /**
     * Finds this menu's own element (for example its back button, parent link or list) - not one
     * belonging to a nested submenu - regardless of where it sits in the markup.
     * @param menu - The menu we want the element for.
     * @param selector - Selector for the element.
     */
    private findOwnMenuElement;
    /**
     * Returns the elements that fade in/out when a menu transitions: the back button, the
     * parent link, and each item's link. The root menu has no back button or parent link, so
     * any missing elements are filtered out before returning.
     * @param menu
     */
    private getElementsToHideForMenuTransition;
    /**
     * The callback that is fired when the menu navigates down a level.
     */
    private onShowChildStart;
    /**
     * The callback that is fired after the menu has moved down a level.
     */
    private onShowChildComplete;
    /**
     * The callback that is fired when the menu navigates up a level.
     */
    private onShowParentStart;
    /**
     * The callback that is fired after the menu has moved up a level.
     */
    private onShowParentComplete;
    /**
     * Generates the tween animation for showing a child menu.
     * This method configures the animation sequence for transitioning to a submenu.
     * @param currentMenu - The currently active menu.
     * @param targetMenu - The submenu to be displayed.
     */
    private onShowChildTween;
    /**
     * Generates the tween animation for showing a parent menu.
     * This method configures the animation sequence for transitioning back to a parent menu.
     * @param currentMenu - The currently active submenu.
     * @param targetMenu - The parent menu to be displayed.
     */
    private onShowParentTween;
    /**
     * Removes all inline styles from elements within a given context.
     * This is particularly useful for cleaning up after dynamic style changes during menu animations.
     * @param context - The context within which to remove inline styles.
     */
    private removeInlineStyles;
    /**
     * Calculates the natural height of an element, disregarding any explicitly set heights.
     * This is useful for animations that need to adjust to the content's natural size.
     * @param element - The element to measure.
     */
    private getNaturalHeight;
    /**
     * Resets the menu items to their initial state, removing any dynamic modifications.
     * This method is typically called when the menu is being reset or destroyed.
     */
    private resetMenuListItems;
    /**
     * Resets the drilldown menu to its initial state, removing any dynamic styles or selections.
     * This is useful for cleaning up and preparing the menu for another interaction.
     */
    reset(): void;
    /**
     * Cleans up event listeners and resets the menu, preparing the instance for garbage collection.
     * This method should be called to prevent memory leaks when the drilldown menu is no longer needed.
     */
    destroy(): void;
}
export { Drilldown, type DrilldownOptions, type TweenOptions, type TweenCallback };
