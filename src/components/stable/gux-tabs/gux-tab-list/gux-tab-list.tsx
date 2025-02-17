import {
  Component,
  Element,
  h,
  JSX,
  Listen,
  Method,
  readTask,
  State,
  writeTask
} from '@stencil/core';

import { OnMutation } from '../../../../utils/decorator/on-mutation';
import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';

import tabsResources from '../i18n/en.json';

@Component({
  styleUrl: 'gux-tab-list.less',
  tag: 'gux-tab-list',
  shadow: false
})
export class GuxTabList {
  private i18n: GetI18nValue;

  @Element()
  root: HTMLElement;

  @State()
  focused: number = 0;

  @State()
  tabTriggers: NodeListOf<HTMLGuxTabElement>;

  @State()
  private hasHorizontalScrollbar: boolean = false;

  @State()
  private hasVerticalScrollbar: boolean = false;

  @State()
  private triggerIds: string;

  @Listen('focusout')
  onFocusout(event: FocusEvent) {
    if (!this.root.contains(event.relatedTarget as Node)) {
      this.tabTriggers.forEach(async (tabTrigger, index) => {
        const activeElement = await tabTrigger.guxGetActive();
        if (activeElement) {
          this.focused = index;
        } else {
          tabTrigger.querySelector('button').setAttribute('tabindex', '-1');
        }
      });
    }
  }

  private resizeObserver?: ResizeObserver;

  private domObserver?: MutationObserver;

  @OnMutation({ childList: true, subtree: true })
  onMutation(): void {
    this.setTriggerIds();
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        this.handleKeyboardScroll('forward');
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.handleKeyboardScroll('backward');
        break;
      case 'Escape':
        event.preventDefault();
        this.focusTab(this.focused);
      case 'Home':
        event.preventDefault();
        this.focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        this.focusTab(this.tabTriggers.length - 1);
        break;
    }
  }

  @Method()
  async guxSetActive(activeTab: string): Promise<void> {
    this.tabTriggers.forEach((tabTrigger, index) => {
      const active = tabTrigger.tabId === activeTab;

      tabTrigger.guxSetActive(active);

      if (active) {
        this.focused = index;
      }
    });
  }

  private focusTab(tabIndex: number): void {
    this.focused = tabIndex;
    this.tabTriggers.forEach(async (tabTrigger, index) => {
      const activeElement = await tabTrigger.guxGetActive();
      if (this.focused !== index && !activeElement) {
        tabTrigger.querySelector('button').setAttribute('tabindex', '-1');
      }
    });
    this.tabTriggers[this.focused]
      .querySelector('button')
      .setAttribute('tabindex', '0');
    this.tabTriggers[this.focused].guxFocus();
  }

  setTriggerIds() {
    if (this.tabTriggers) {
      this.triggerIds = Array.from(this.tabTriggers)
        .map(trigger => `gux-${trigger.getAttribute('tab-id')}-tab`)
        .join(' ');
    } else {
      this.triggerIds = '';
    }
  }

  checkForScrollbarHideOrShow() {
    readTask(() => {
      const el = this.root.querySelector('.gux-scrollable-section');
      const hasHorizontalScrollbar = el.clientWidth !== el.scrollWidth;
      const hasVerticalScrollbar = el.clientHeight !== el.scrollHeight;

      if (hasHorizontalScrollbar !== this.hasHorizontalScrollbar) {
        this.hasHorizontalScrollbar = hasHorizontalScrollbar;
      }

      if (hasVerticalScrollbar !== this.hasVerticalScrollbar) {
        this.hasVerticalScrollbar = hasVerticalScrollbar;
      }
    });
  }

  handleKeyboardScroll(direction: 'forward' | 'backward'): void {
    const scrollableSection = this.root.querySelector(
      '.gux-scrollable-section'
    );
    const currentTab = this.root.querySelectorAll('gux-tab')[this.focused];

    if (direction === 'forward') {
      if (this.focused < this.tabTriggers.length - 1) {
        writeTask(() => {
          this.hasHorizontalScrollbar
            ? scrollableSection.scrollBy(currentTab.clientWidth, 0)
            : scrollableSection.scrollBy(0, currentTab.clientHeight);
        });
        this.focusTab(this.focused + 1);
      } else {
        writeTask(() => {
          this.hasHorizontalScrollbar
            ? scrollableSection.scrollBy(-scrollableSection.scrollWidth, 0)
            : scrollableSection.scrollBy(0, -scrollableSection.scrollHeight);
        });
        this.focusTab(0);
      }
    } else if (direction === 'backward') {
      if (this.focused > 0) {
        writeTask(() => {
          this.hasHorizontalScrollbar
            ? scrollableSection.scrollBy(-currentTab.clientWidth, 0)
            : scrollableSection.scrollBy(0, -currentTab.clientHeight);
        });
        this.focusTab(this.focused - 1);
      } else {
        writeTask(() => {
          this.hasHorizontalScrollbar
            ? scrollableSection.scrollBy(scrollableSection.scrollWidth, 0)
            : scrollableSection.scrollBy(0, scrollableSection.scrollHeight);
        });
        this.focusTab(this.tabTriggers.length - 1);
      }
    }
  }

  disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(
        this.root.querySelector('.gux-tab-container')
      );
    }

    if (this.domObserver) {
      this.domObserver.disconnect();
    }
  }

  async componentWillLoad(): Promise<void> {
    this.tabTriggers = this.root.querySelectorAll('gux-tab');
    this.i18n = await buildI18nForComponent(this.root, tabsResources);
  }

  componentDidLoad() {
    if (!this.resizeObserver && window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    if (this.resizeObserver) {
      this.resizeObserver.observe(
        this.root.querySelector('.gux-scrollable-section')
      );
    }

    if (!this.domObserver && window.MutationObserver) {
      this.domObserver = new MutationObserver(
        this.checkForScrollbarHideOrShow.bind(this)
      );
    }

    if (this.domObserver) {
      this.domObserver.observe(this.root, {
        childList: true,
        attributes: false,
        subtree: true
      });
    }

    setTimeout(() => {
      this.checkForScrollbarHideOrShow();
    }, 500);
  }

  scrollLeft() {
    writeTask(() => {
      this.root.querySelector('.gux-scrollable-section').scrollBy(-100, 0);
    });
  }

  scrollRight() {
    writeTask(() => {
      this.root.querySelector('.gux-scrollable-section').scrollBy(100, 0);
    });
  }

  scrollUp() {
    writeTask(() => {
      this.root.querySelector('.gux-scrollable-section').scrollBy(0, -100);
    });
  }

  scrollDown() {
    writeTask(() => {
      this.root.querySelector('.gux-scrollable-section').scrollBy(0, 100);
    });
  }

  render(): JSX.Element {
    return (
      <div class="gux-tab-container">
        {this.hasHorizontalScrollbar
          ? this.renderScrollButton('scrollLeft')
          : this.renderScrollButton('scrollUp')}

        <div
          role="tablist"
          class="gux-scrollable-section"
          aria-owns={this.triggerIds}
        >
          <slot></slot>
        </div>
        {this.hasHorizontalScrollbar
          ? this.renderScrollButton('scrollRight')
          : this.renderScrollButton('scrollDown')}
      </div>
    );
  }

  private renderScrollButton(direction: string): JSX.Element {
    return (
      <div class="gux-scroll-button-container">
        {this.hasHorizontalScrollbar || this.hasVerticalScrollbar ? (
          <button
            tabindex="-1"
            title={this.i18n(direction)}
            aria-label={this.i18n(direction)}
            class="gux-scroll-button"
            onClick={() => this.getScrollDirection(direction)}
          >
            <gux-icon
              icon-name={this.getChevronIconName(direction)}
              decorative={true}
            />
          </button>
        ) : null}
      </div>
    );
  }

  private getScrollDirection(direction: string): void {
    switch (direction) {
      case 'scrollLeft':
        this.scrollLeft();
        break;
      case 'scrollRight':
        this.scrollRight();
        break;
      case 'scrollUp':
        this.scrollUp();
        break;
      case 'scrollDown':
        this.scrollDown();
    }
  }

  private getChevronIconName(direction: string): string {
    switch (direction) {
      case 'scrollLeft':
        return 'chevron-left';
      case 'scrollRight':
        return 'chevron-right';
      case 'scrollUp':
        return 'chevron-up';
      case 'scrollDown':
        return 'chevron-down';
    }
  }
}
