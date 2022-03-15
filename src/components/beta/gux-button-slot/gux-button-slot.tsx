import { Component, Element, h, Host, JSX, Prop } from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { logError } from '../../../utils/error/log-error';
import { GuxButtonAccent } from '../../stable/gux-button/gux-button.types';

/**
 * @slot - button, input[type="button"] or input[type="submit"] element
 */
@Component({
  styleUrl: 'gux-button-slot.less',
  tag: 'gux-button-slot-beta',
  shadow: true
})
export class GuxButtonSlot {
  @Element() root: HTMLElement;

  @Prop()
  accent: GuxButtonAccent = 'secondary';

  private validateSlotContent(): void {
    const slottedElement = this.root.children[0];
    const slottedTagName = slottedElement.tagName;

    if (slottedTagName === 'BUTTON') {
      return;
    } else if (slottedTagName === 'INPUT') {
      const slottedType = slottedElement.getAttribute('type');

      if (slottedType === 'button' || slottedType === 'submit') {
        return;
      }
    }

    logError(
      'gux-button-slot',
      'You must slot a button, input[type="button"] or input[type="submit"] element.'
    );
  }

  componentWillLoad(): void {
    trackComponent(this.root);

    this.validateSlotContent();
  }

  render(): JSX.Element {
    return (
      <Host accent={this.accent}>
        <slot />
      </Host>
    ) as JSX.Element;
  }
}
