import { createPopper, Instance } from '@popperjs/core';
import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { OnClickOutside } from '../../../utils/decorator/on-click-outside';
import { onHiddenChange } from '../../../utils/dom/on-attribute-change';
import { trackComponent } from '../../../usage-tracking';

import { PopperPosition } from './gux-popover.types';

@Component({
  styleUrl: 'gux-popover.less',
  tag: 'gux-popover'
})
export class GuxPopover {
  private popperInstance: Instance;
  private hiddenObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  /**
   * Indicates the id of the element the popover should anchor to
   */
  @Prop()
  for: string;

  /**
   * Indicate position of popover element arrow (follow popper js position attribute api)
   */
  @Prop()
  position: PopperPosition = 'bottom';

  /**
   * Indicate if the dismiss button is displayed
   */
  @Prop()
  displayDismissButton: boolean;

  /**
   * Close popover when the user clicks outside of its bounds
   */
  @Prop()
  closeOnClickOutside: boolean = false;

  /**
   * Fired when a user dismisses the popover
   */
  @Event()
  guxdismiss: EventEmitter<void>;

  @State()
  hidden: boolean = true;

  @Watch('hidden')
  hiddenHandler(hidden: boolean) {
    if (!hidden && !this.popperInstance) {
      this.runPopper();
    } else if (!hidden && this.popperInstance) {
      this.popperInstance.forceUpdate();
    }
  }

  @OnClickOutside({ triggerEvents: 'mousedown' })
  checkForClickOutside(event: MouseEvent) {
    const clickPath = event.composedPath();
    const forElement = document.getElementById(this.for);
    const clickedForElement = clickPath.includes(forElement);

    if (
      (this.closeOnClickOutside || !this.displayDismissButton) &&
      !this.hidden &&
      !clickedForElement
    ) {
      this.dismiss();
    }
  }

  private runPopper(): void {
    const forElement = document.getElementById(this.for);

    if (forElement) {
      this.popperInstance = createPopper(forElement, this.root, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 7]
            }
          },
          {
            name: 'arrow',
            options: {
              padding: 16
            }
          }
        ],
        placement: this.position
      });
    } else {
      console.error(
        `GUX-Popover: invalid "for" attribute. No element in page with the id "${this.for}"`
      );
    }
  }

  private destroyPopper(): void {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  private dismiss(): void {
    const dismissEvent = this.guxdismiss.emit();
    if (!dismissEvent.defaultPrevented) {
      this.root.setAttribute('hidden', '');
    }
  }

  async connectedCallback(): Promise<void> {
    trackComponent(this.root, { variant: this.position });

    this.hiddenObserver = onHiddenChange(this.root, (hidden: boolean) => {
      this.hidden = hidden;
    });

    this.hidden = this.root.hidden;
  }

  componentDidLoad(): void {
    this.runPopper();
  }

  disconnectedCallback(): void {
    this.destroyPopper();
    this.hiddenObserver.disconnect();
  }

  render(): JSX.Element {
    return (
      <div class="gux-popover-wrapper">
        <div class="gux-arrow" data-popper-arrow />
        {this.displayDismissButton && (
          <gux-dismiss-button-beta
            onClick={this.dismiss.bind(this)}
          ></gux-dismiss-button-beta>
        )}
        <div class="gux-popover-content">
          <slot />
        </div>
      </div>
    );
  }
}
