import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../../i18n';
import setInputValue from '../../../../../utils/dom/set-input-value';
import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';

import componentResources from './i18n/en.json';

/**
 * @slot input - Required slot for input[type="text" | type="email" | type="password"]
 */
@Component({
  styleUrl: 'gux-input-text-like.less',
  tag: 'gux-input-text-like'
})
export class GuxInputTextLike {
  private input: HTMLInputElement;
  private getI18nValue: GetI18nValue;
  private disabledObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  @Prop()
  clearable: boolean;

  @State()
  private hasContent: boolean = false;

  @State()
  private disabled: boolean;

  private clearInput(): void {
    setInputValue(this.input, '', true);
  }

  private setHasContent(): void {
    this.hasContent = Boolean(this.input.value);
  }

  private renderClearButton(): JSX.Element {
    if (this.clearable && this.hasContent && !this.disabled) {
      return (
        <button
          class="gux-clear-button"
          tabIndex={-1}
          type="button"
          title={this.getI18nValue('clear')}
          disabled={this.disabled}
          onClick={this.clearInput.bind(this)}
        >
          <gux-icon icon-name="close" decorative></gux-icon>
        </button>
      ) as JSX.Element;
    }

    return null;
  }

  async componentWillLoad(): Promise<void> {
    this.getI18nValue = await buildI18nForComponent(
      this.root,
      componentResources
    );

    this.input = this.root.querySelector('input[slot="input"]');

    this.setHasContent();
    this.disabled = this.input.disabled;

    this.input.addEventListener('input', () => {
      this.setHasContent();
    });
    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );
  }

  disconnectedCallback(): void {
    this.disabledObserver.disconnect();
  }

  render(): JSX.Element {
    return (
      <div
        class={{
          'gux-input-container': true,
          'gux-disabled': this.disabled
        }}
      >
        <slot name="input" />
        {this.renderClearButton()}
      </div>
    ) as JSX.Element;
  }
}
