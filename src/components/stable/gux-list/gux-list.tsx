import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';

const validChildren = [
  'gux-list-item:not([disabled])',
  'gux-action-item:not([disabled])'
].join(',');

@Component({
  styleUrl: 'gux-list.less',
  tag: 'gux-list',
  shadow: true
})
export class GuxList {
  @Element()
  root: HTMLElement;

  /**
   * The current selection in the list.
   */
  @Prop({ mutable: true })
  value: any;

  /**
   * The highlight value
   */
  @Prop()
  highlight: string;

  /**
   * The currently selected index.
   */
  @State()
  selectedIndex: number = -1;

  /**
   * Triggered when the list's selection is changed.
   */
  @Event()
  changed: EventEmitter<any>;

  /**
   * Using a mutation observer because component loading order is not quite right.
   * In this case we are attempting to update a component that updates a component.
   * What ends up happening is that there is no hook to make sure all components have loaded.
   * When the DOM load order gets fixed we should be able to remove this logic.
   * https://github.com/ionic-team/stencil/issues/1261
   */
  private observer: MutationObserver = new MutationObserver(() => {
    this.performHighlight(this.highlight);
  });

  emitChanged(value: any) {
    this.changed.emit(value);
  }

  @Listen('selected')
  itemSelected(ev: CustomEvent<any>) {
    if (!ev.detail) {
      return;
    }

    this.value = ev.detail;
  }

  @Watch('value')
  valueHandler(newValue) {
    this.emitChanged(newValue);
  }

  /*
   * Sets focus to the fist item in the list.
   */
  @Method()
  async setFocusOnFirstItem(): Promise<void> {
    this.selectedIndex = 0;
    this.updateTabIndexes();
  }

  /*
   * Sets focus to the last item in the list.
   */
  @Method()
  async setFocusOnLastItem(): Promise<void> {
    const filteredList = this.getFilteredList();
    this.selectedIndex = filteredList.length - 1;
    this.updateTabIndexes();
  }

  /**
   * Returns whether the last item in the list is selected.
   */
  @Method()
  async isLastItemSelected(): Promise<boolean> {
    const filteredList = this.getFilteredList();
    return this.selectedIndex === filteredList.length - 1;
  }

  /**
   * Returns whether the first item in the list is selected.
   */
  @Method()
  async isFirstItemSelected(): Promise<boolean> {
    return this.selectedIndex <= 0;
  }

  componentWillLoad(): void {
    trackComponent(this.root);
  }

  /**
   * Once the component is loaded
   */
  componentDidLoad() {
    this.performHighlight(this.highlight);
    this.observer.observe(this.root, { childList: true, subtree: true });
  }

  disconnectedCallback(): void {
    this.observer.disconnect();
  }

  render() {
    this.performHighlight(this.highlight);
    this.updateTabIndexes();
    return (
      <div
        class="gux-list-items-container"
        role="list"
        tabindex={0}
        onKeyDown={e => this.onKeyDown(e)}
      >
        <slot />
      </div>
    );
  }

  private onKeyDown(event: KeyboardEvent): void {
    const validKeys = ['ArrowUp', 'ArrowDown', 'End', 'Home'];
    if (!validKeys.includes(event.key)) {
      return;
    }

    const filteredList = this.getFilteredList();

    let newIndex = -1;
    switch (event.key) {
      case 'ArrowUp':
        if (this.selectedIndex) {
          newIndex = this.selectedIndex - 1;
          event.stopPropagation();
        }
        break;
      case 'Home':
        if (this.selectedIndex) {
          newIndex = 0;
        }
        break;
      case 'ArrowDown':
        if (this.selectedIndex !== filteredList.length - 1) {
          newIndex = this.selectedIndex + 1;
          event.stopPropagation();
        }
        break;
      case 'End':
        if (this.selectedIndex !== filteredList.length - 1) {
          newIndex = filteredList.length - 1;
        }
        break;
    }

    if (newIndex !== -1) {
      this.selectedIndex = newIndex;
    }
  }

  private updateTabIndexes(): void {
    const children = this.getFilteredList();

    if (!children || this.selectedIndex === -1) {
      return;
    }

    children.forEach((element: HTMLGuxListItemElement, index: number) => {
      if (index !== this.selectedIndex) {
        element.setAttribute('tabindex', '-1');
      } else {
        element.setAttribute('tabindex', '0');
        element.focus();
        setTimeout(() => {
          this.value = element.value;
        });
      }
    });
  }

  private performHighlight(value: string): void {
    const items = this.root.querySelectorAll('gux-text-highlight');

    if (!items) {
      return;
    }

    items.forEach((element: HTMLGuxTextHighlightElement) => {
      element.highlight = value;
    });
  }

  private getFilteredList(): Element[] {
    const slot = this.root.querySelector('slot') as HTMLSlotElement;

    if (slot) {
      return slot
        .assignedElements()
        .filter(element => element.matches(validChildren));
    }

    return Array.from(this.root.querySelectorAll(validChildren));
  }
}
