import { gsap as T } from "gsap";
const u = 0.2, c = "power1.out";
class H {
  /**
   * Initializes a new instance of the Drilldown class.
   * @param context - The element to initialize the drilldown on.
   * @param options - Configuration options for the drilldown.
   */
  constructor(t, e = {}) {
    var n, s, i, o, h, a, S, w, b, f, v, E, I, A, y, M, x, R, D, C;
    this.activeMenuItem = null, this.menuResizeObserver = null, this.isAnimating = !1, this.handleMenuClick = (m) => {
      if (this.isAnimating) return;
      const g = m.target, l = g.closest(this.options.nextSelector) ?? g.closest(this.options.backSelector);
      if (!l) return;
      m.preventDefault();
      const p = !!l.closest(this.options.nextSelector), r = l.closest(this.options.submenuSelector);
      if (!r) return;
      const d = this.getTargetMenu(l, p);
      if (!d) return;
      (p ? this.createAnimation(r, d, !0) : this.createAnimation(r, d, !1)).play();
    }, this.onShowParentTween = (m, g) => {
      const l = this.getElementsToHideForMenuTransition(g), p = this.getElementsToHideForMenuTransition(m), r = T.timeline();
      return r.to(p, {
        x: 20,
        autoAlpha: 0,
        duration: this.options.parentTween.outDuration,
        ease: this.options.parentTween.outEase,
        stagger: this.options.parentTween.outStagger
      }), r.to(this.context, {
        // This is calculated at runtime because the height of the parent menu changes
        // just before we animate it in: see the 'onShowParentStart' callback.
        height: () => `${this.getNaturalHeight(g)}px`,
        duration: this.options.parentTween.heightDuration,
        ease: this.options.parentTween.heightEase
      }), r.set(m, {
        autoAlpha: 0
      }), r.to(l, {
        autoAlpha: 1,
        x: 0,
        duration: this.options.parentTween.inDuration,
        ease: this.options.parentTween.inEase,
        stagger: this.options.parentTween.inStagger
      }), r;
    }, this.bindThisToMemberFunctions(), this.context = t, this.options = {
      backSelector: e.backSelector || "[data-js-menu-back]",
      nextSelector: e.nextSelector || "[data-js-menu-next]",
      submenuSelector: e.submenuSelector || "[data-js-menu-container]",
      itemSelector: e.itemSelector || "[data-js-menu-item]",
      onReset: e.onReset || null,
      childTween: {
        outDuration: ((n = e.childTween) == null ? void 0 : n.outDuration) || u,
        outEase: ((s = e.childTween) == null ? void 0 : s.outEase) || c,
        outStagger: ((i = e.childTween) == null ? void 0 : i.outStagger) || 0,
        inDuration: ((o = e.childTween) == null ? void 0 : o.inDuration) || u,
        inEase: ((h = e.childTween) == null ? void 0 : h.inEase) || c,
        inStagger: ((a = e.childTween) == null ? void 0 : a.inStagger) || 0,
        heightDuration: ((S = e.childTween) == null ? void 0 : S.heightDuration) || u,
        heightEase: ((w = e.childTween) == null ? void 0 : w.heightEase) || c,
        onStart: ((b = e.childTween) == null ? void 0 : b.onStart) || null,
        onComplete: ((f = e.childTween) == null ? void 0 : f.onComplete) || null
      },
      parentTween: {
        outDuration: ((v = e.parentTween) == null ? void 0 : v.outDuration) || u,
        outEase: ((E = e.parentTween) == null ? void 0 : E.outEase) || c,
        outStagger: ((I = e.parentTween) == null ? void 0 : I.outStagger) || 0,
        inDuration: ((A = e.parentTween) == null ? void 0 : A.inDuration) || u,
        inEase: ((y = e.parentTween) == null ? void 0 : y.inEase) || c,
        inStagger: ((M = e.parentTween) == null ? void 0 : M.inStagger) || 0,
        heightDuration: ((x = e.parentTween) == null ? void 0 : x.heightDuration) || u,
        heightEase: ((R = e.parentTween) == null ? void 0 : R.heightEase) || c,
        onStart: ((D = e.parentTween) == null ? void 0 : D.onStart) || null,
        onComplete: ((C = e.parentTween) == null ? void 0 : C.onComplete) || null
      }
    }, this.activeMenuItem = null, this.menuResizeObserver = null;
  }
  /**
   * Binds instance to member functions to preserve the `this` context.
   */
  bindThisToMemberFunctions() {
    const t = Object.getOwnPropertyNames(Object.getPrototypeOf(this)), e = this;
    t.forEach((n) => {
      const s = e[n];
      typeof s == "function" && (e[n] = s.bind(this));
    });
  }
  init() {
    this.context.addEventListener("click", this.handleMenuClick);
  }
  /**
    * Determines the target menu based on the element that triggered the event.
    * If the action is to navigate to a next (child) menu, it finds the submenu within the active menu item.
    * If the action is to go back, it finds the parent menu of the current submenu.
    *
    * @param element - The element (typically a button or link) that triggered the navigation action.
    * @param isNextButton - A flag indicating whether the navigation action is moving forward to a child menu.
    * @returns The target menu to navigate to, or null if no target menu can be determined.
  */
  getTargetMenu(t, e) {
    return this.activeMenuItem = t.closest(this.options.itemSelector), this.activeMenuItem ? e ? this.activeMenuItem.querySelector(this.options.submenuSelector) : this.activeMenuItem.closest(this.options.submenuSelector) : null;
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
  createAnimation(t, e, n) {
    const s = n ? this.onShowChildTween(t, e) : this.onShowParentTween(t, e);
    return this.setupTweenCallbacks(s, t, e, n), s.pause(), s;
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
  setupTweenCallbacks(t, e, n, s) {
    const i = s ? this.options.childTween : this.options.parentTween, o = s ? this.onShowChildStart : this.onShowParentStart, h = s ? this.onShowChildComplete : this.onShowParentComplete;
    t.eventCallback("onStart", () => {
      var a;
      (a = i.onStart) == null || a.call(i, e, n), o(e, n);
    }), t.eventCallback("onComplete", () => {
      var a;
      (a = i.onComplete) == null || a.call(i, e, n), h(e, n);
    });
  }
  /**
   * Creates a ResizeObserver to adjust the height of the drilldown menu.
   * This ensures the menu height matches the content, especially useful when content changes size.
   * @returns The created ResizeObserver instance.
   */
  createMenuResizeObserver() {
    return this.menuResizeObserver || (this.menuResizeObserver = new ResizeObserver((t) => {
      for (const e of t) {
        const n = e.target;
        this.context.style.height = `${n.offsetHeight}px`;
      }
    })), this.menuResizeObserver;
  }
  /**
   * Returns the main list items for a given menu. It does not include supplementary items, for
   * example, the parent link or the back button.
   * @param menu
   * @returns Array of menu item elements
   */
  getMenuListItems(t) {
    const e = Array.from(t.children).filter((s) => s.matches("ul"))[0];
    return e ? Array.from(e.children).filter((s) => s.matches(this.options.itemSelector)) : [];
  }
  /**
   * Returns the elements that will be hidden when a menu is transitioning.
   * @param menu
   * @returns Array of elements to hide
   */
  getElementsToHideForMenuTransition(t) {
    const n = this.getMenuListItems(t).map((h) => h.querySelector("[data-js-menu-link]")), s = t.querySelector(this.options.backSelector), i = t.querySelector("[data-js-menu-parent]");
    return [s, i, ...n];
  }
  /**
   * The callback that is fired when the menu navigates down a level.
   */
  onShowChildStart(t, e) {
    t.scrollTop = 0, e.scrollTop = 0, this.isAnimating = !0;
  }
  /**
   * The callback that is fired after the menu has moved down a level.
   */
  onShowChildComplete(t, e) {
    this.isAnimating = !1, this.getMenuListItems(t).forEach((i) => {
      i !== this.activeMenuItem && i.classList.add("hidden");
    }), this.menuResizeObserver && this.menuResizeObserver.unobserve(t), this.createMenuResizeObserver().observe(e);
  }
  /**
   * The callback that is fired when the menu navigates up a level.
   */
  onShowParentStart(t, e) {
    this.isAnimating = !0, this.getMenuListItems(e).forEach((s) => {
      s.classList.remove("hidden");
    });
  }
  /**
   * The callback that is fired after the menu has moved up a level.
   */
  onShowParentComplete(t, e) {
    this.isAnimating = !1, this.menuResizeObserver && this.menuResizeObserver.unobserve(t), e === this.context ? this.context.style.height = "auto" : this.createMenuResizeObserver().observe(e);
  }
  /**
   * Generates the tween animation for showing a child menu.
   * This method configures the animation sequence for transitioning to a submenu.
   * @param currentMenu - The currently active menu.
   * @param targetMenu - The submenu to be displayed.
   * @returns The GSAP timeline for the animation.
   */
  onShowChildTween(t, e) {
    const n = e.offsetHeight, s = this.getElementsToHideForMenuTransition(t), i = this.getElementsToHideForMenuTransition(e), o = T.timeline();
    return o.to(s, {
      autoAlpha: 0,
      x: -20,
      duration: this.options.childTween.outDuration,
      ease: this.options.childTween.outEase,
      stagger: this.options.childTween.outStagger
    }), o.to(this.context, {
      height: `${n}px`,
      duration: this.options.childTween.heightDuration,
      ease: this.options.childTween.heightEase
    }), o.set(e, {
      autoAlpha: 1
    }), o.fromTo(i, {
      autoAlpha: 0,
      x: 20
    }, {
      autoAlpha: 1,
      x: 0,
      duration: this.options.childTween.inDuration,
      ease: this.options.childTween.inEase,
      stagger: this.options.childTween.inStagger
    }), o;
  }
  /**
   * Removes all inline styles from elements within a given context.
   * This is particularly useful for cleaning up after dynamic style changes during menu animations.
   * @param context - The context within which to remove inline styles.
   */
  removeInlineStyles(t) {
    const e = Array.from(t.querySelectorAll("[style]"));
    t.hasAttribute("style") && e.push(t), e.forEach((n) => {
      T.set(n, {
        clearProps: "all",
        overwrite: !0
      });
    });
  }
  /**
   * Calculates the natural height of an element, disregarding any explicitly set heights.
   * This is useful for animations that need to adjust to the content's natural size.
   * @param element - The element to measure.
   * @returns The natural height of the element.
   */
  getNaturalHeight(t) {
    const e = t.offsetHeight;
    t.style.height = "auto";
    const n = t.offsetHeight;
    return t.style.height = `${e}px`, n;
  }
  /**
   * Resets the menu items to their initial state, removing any dynamic modifications.
   * This method is typically called when the menu is being reset or destroyed.
   */
  resetMenuListItems() {
    this.context.querySelectorAll(this.options.itemSelector).forEach((e) => {
      e.classList.remove("hidden");
    });
  }
  /**
   * Resets the drilldown menu to its initial state, removing any dynamic styles or selections.
   * This is useful for cleaning up and preparing the menu for another interaction.
   */
  reset() {
    this.isAnimating = !1, typeof this.options.onReset == "function" && this.options.onReset(), this.resetMenuListItems(), this.removeInlineStyles(this.context), this.menuResizeObserver && this.menuResizeObserver.disconnect();
  }
  /**
   * Cleans up event listeners and resets the menu, preparing the instance for garbage collection.
   * This method should be called to prevent memory leaks when the drilldown menu is no longer needed.
   */
  destroy() {
    this.context.removeEventListener("click", this.handleMenuClick), this.reset();
  }
}
export {
  H as Drilldown
};
