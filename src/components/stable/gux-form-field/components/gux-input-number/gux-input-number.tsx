import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../../i18n';
import setInputValue from '../../../../../utils/dom/set-input-value';
import simulateNativeEvent from '../../../../../utils/dom/simulate-native-event';
import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';

import componentResources from './i18n/en.json';

/**
 * @slot input - Required slot for input[type="radio"]
 */
@Component({
  styleUrl: 'gux-input-number.less',
  tag: 'gux-input-number'
})
export class GuxInputNumber {
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

  private simulateNativeInputAndChangeEvents(): void {
    simulateNativeEvent(this.input, 'input');
    simulateNativeEvent(this.input, 'change');
  }

  private stepUp(): void {
    if (this.input.value === '') {
      setInputValue(this.input, this.input.min || '0', false);
    } else {
      this.input.stepUp();
      this.simulateNativeInputAndChangeEvents();
    }
  }

  private stepDown(): void {
    if (this.input.value === '') {
      setInputValue(this.input, this.input.min || '0', false);
    } else {
      this.input.stepDown();
      this.simulateNativeInputAndChangeEvents();
    }
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

  private renderStepButtons(): JSX.Element {
    return (
      <div class="gux-step-buttons-container">
        <button
          class="gux-step-button"
          tabIndex={-1}
          type="button"
          title={this.getI18nValue('increment')}
          disabled={this.disabled}
          onClick={() => this.stepUp()}
        >
          <gux-icon icon-name="chevron-small-up" decorative></gux-icon>
        </button>

        <button
          class="gux-step-button"
          tabIndex={-1}
          type="button"
          title={this.getI18nValue('decrement')}
          disabled={this.disabled}
          onClick={() => this.stepDown()}
        >
          <gux-icon icon-name="chevron-small-down" decorative></gux-icon>
        </button>
      </div>
    ) as JSX.Element;
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
          'gux-input-number-container': true,
          'gux-disabled': this.disabled
        }}
      >
        <div class="gux-input-container">
          <slot name="input" />
          {this.renderClearButton()}
        </div>
        {this.renderStepButtons()}
      </div>
    ) as JSX.Element;
  }
}
