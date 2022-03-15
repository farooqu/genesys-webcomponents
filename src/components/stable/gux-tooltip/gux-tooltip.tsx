import { createPopper, Instance } from '@popperjs/core';
import {
  Component,
  Element,
  h,
  Host,
  Listen,
  JSX,
  Prop,
  State
} from '@stencil/core';

import { randomHTMLId } from '../../../utils/dom/random-html-id';
import { trackComponent } from '../../../usage-tracking';

/**
 * @slot - Content of the tooltip
 */
@Component({
  styleUrl: 'gux-tooltip.less',
  tag: 'gux-tooltip',
  shadow: true
})
export class GuxTooltip {
  private delayTimeout: NodeJS.Timer;
  private forElement: HTMLElement;
  private tooltipActive: boolean;
  private mouseenterHandler: () => void = () => this.show();
  private mouseleaveHandler: () => void = () => this.hide();
  private focusinHandler: () => void = () => this.show();
  private focusoutHandler: () => void = () => this.hide();
  private popperInstance: Instance;
  private id: string = randomHTMLId('gux-tooltip');

  @Element()
  private root: HTMLElement;

  /**
   * Indicates the id of the element the popover should anchor to. (If not supplied the parent element is used)
   */
  @Prop()
  for: string;

  /**
   * If tooltip is shown or not
   */
  @State()
  isShown: boolean = false;

  @Listen('keydown', { target: 'window', passive: true })
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isShown) {
      this.hide();
    }
  }

  private show(): void {
    this.tooltipActive = true;
    this.popperInstance.forceUpdate();
    this.delayTimeout = setTimeout(() => {
      if (this.tooltipActive) {
        this.isShown = true;
      }
    }, 750); // the css transition is 250ms
  }

  private hide(): void {
    this.tooltipActive = false;
    clearTimeout(this.delayTimeout);
    this.isShown = false;
  }

  componentWillLoad(): void {
    trackComponent(this.root);

    if (this.for) {
      this.forElement = document.getElementById(this.for);
    } else {
      this.forElement = this.root.parentElement;
    }
  }

  componentDidLoad(): void {
    if (this.forElement) {
      this.forElement.setAttribute('aria-describedby', this.id);

      this.popperInstance = createPopper(this.forElement, this.root, {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 16]
            }
          }
        ],
        placement: 'bottom-start',
        strategy: 'fixed'
      });

      this.forElement.addEventListener('mouseenter', this.mouseenterHandler);
      this.forElement.addEventListener('mouseleave', this.mouseleaveHandler);
      this.forElement.addEventListener('focusin', this.focusinHandler);
      this.forElement.addEventListener('focusout', this.focusoutHandler);
    } else {
      console.error(
        `gux-tooltip: invalid element supplied to 'for': "${this.for}"`
      );
    }
  }

  disconnectedCallback(): void {
    this.forElement.removeAttribute('aria-describedby');

    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }

    this.forElement.removeEventListener('mouseenter', this.mouseenterHandler);
    this.forElement.removeEventListener('mouseleave', this.mouseleaveHandler);
    this.forElement.removeEventListener('focusin', this.focusinHandler);
    this.forElement.removeEventListener('focusout', this.focusoutHandler);
  }

  render(): JSX.Element {
    return (
      <Host
        id={this.id}
        class={{ 'gux-show': this.isShown }}
        tabindex="0"
        role="tooltip"
      >
        <slot />
      </Host>
    ) as JSX.Element;
  }
}
