import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../../i18n';
import { ILocalizedComponentResources } from '../../../../../i18n/fetchResources';
import { OnMutation } from '../../../../../utils/decorator/on-mutation';
import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';
import { onRequiredChange } from '../../../../../utils/dom/on-attribute-change';
import { preventBrowserValidationStyling } from '../../../../../utils/dom/prevent-browser-validation-styling';
import { trackComponent } from '../../../../../usage-tracking';
import setInputValue from '../../../../../utils/dom/set-input-value';
import simulateNativeEvent from '../../../../../utils/dom/simulate-native-event';

import { GuxFormFieldContainer } from '../../functional-components/gux-form-field-container/gux-form-field-container';
import { GuxFormFieldError } from '../../functional-components/gux-form-field-error/gux-form-field-error';
import { GuxFormFieldLabel } from '../../functional-components/gux-form-field-label/gux-form-field-label';

import { GuxFormFieldLabelPosition } from '../../gux-form-field.types';
import {
  clearInput,
  hasErrorSlot,
  hasContent,
  getComputedLabelPosition,
  validateFormIds
} from '../../gux-form-field.servce';

import componentResources from './i18n/en.json';

/**
 * @slot input - Required slot for input tag
 * @slot label - Required slot for label tag
 * @slot error - Optional slot for error message
 */
@Component({
  styleUrl: 'gux-form-field-number.less',
  tag: 'gux-form-field-number-beta',
  shadow: true
})
export class GuxFormFieldNumber {
  private getI18nValue: GetI18nValue;
  private input: HTMLInputElement;
  private label: HTMLLabelElement;
  private disabledObserver: MutationObserver;
  private requiredObserver: MutationObserver;

  @Element()
  private root: HTMLElement;

  @Prop()
  clearable: boolean;

  @Prop()
  labelPosition: GuxFormFieldLabelPosition;

  @State()
  private computedLabelPosition: GuxFormFieldLabelPosition = 'above';

  @State()
  private disabled: boolean;

  @State()
  private required: boolean;

  @State()
  private hasContent: boolean = false;

  @State()
  private hasError: boolean = false;

  @OnMutation({ childList: true, subtree: true })
  onMutation(): void {
    this.hasError = hasErrorSlot(this.root);
  }

  async componentWillLoad(): Promise<void> {
    this.getI18nValue = await buildI18nForComponent(
      this.root,
      componentResources as ILocalizedComponentResources
    );

    this.setInput();
    this.setLabel();

    this.hasError = hasErrorSlot(this.root);

    trackComponent(this.root, { variant: this.variant });
  }

  disconnectedCallback(): void {
    this.disabledObserver.disconnect();
    this.requiredObserver.disconnect();
  }

  render(): JSX.Element {
    const showClearButton = this.clearable && this.hasContent && !this.disabled;

    return (
      <GuxFormFieldContainer labelPosition={this.computedLabelPosition}>
        <GuxFormFieldLabel
          position={this.computedLabelPosition}
          required={this.required}
        >
          <slot name="label" onSlotchange={() => this.setLabel()} />
        </GuxFormFieldLabel>
        <div class="gux-input-and-error-container">
          <div
            class={{
              'gux-input': true,
              'gux-input-error': this.hasError
            }}
          >
            <div
              class={{
                'gux-input-container': true,
                'gux-disabled': this.disabled,
                'gux-clear': showClearButton
              }}
            >
              <slot name="input" onSlotchange={() => this.setInput()} />
              {showClearButton && (
                <gux-form-field-input-clear-button
                  onClick={() => clearInput(this.input)}
                ></gux-form-field-input-clear-button>
              )}
            </div>
            {this.renderStepButtons(
              this.input,
              this.getI18nValue,
              this.disabled
            )}
          </div>
          <GuxFormFieldError hasError={this.hasError}>
            <slot name="error" />
          </GuxFormFieldError>
        </div>
      </GuxFormFieldContainer>
    ) as JSX.Element;
  }

  private get variant(): string {
    const labelPositionVariant = this.labelPosition
      ? this.labelPosition.toLowerCase()
      : 'none';
    const clearableVariant = this.clearable ? 'clearable' : 'unclearable';

    return `${clearableVariant}-${labelPositionVariant}`;
  }

  private setInput(): void {
    this.input = this.root.querySelector('input[type="number"][slot="input"]');

    this.hasContent = hasContent(this.input);

    preventBrowserValidationStyling(this.input);

    this.input.addEventListener('input', () => {
      this.hasContent = hasContent(this.input);
    });

    this.disabled = this.input.disabled;
    this.required = this.input.required;

    this.disabledObserver = onDisabledChange(
      this.input,
      (disabled: boolean) => {
        this.disabled = disabled;
      }
    );
    this.requiredObserver = onRequiredChange(
      this.input,
      (required: boolean) => {
        this.required = required;
      }
    );

    validateFormIds(this.root, this.input);
  }

  private setLabel(): void {
    this.label = this.root.querySelector('label[slot="label"]');

    this.computedLabelPosition = getComputedLabelPosition(
      this.label,
      this.labelPosition
    );
  }

  private renderStepButtons(
    input: HTMLInputElement,
    getI18nValue: GetI18nValue,
    disabled: boolean
  ): JSX.Element {
    return (
      <div class="gux-step-buttons-container">
        <button
          class="gux-step-button"
          tabIndex={-1}
          type="button"
          title={getI18nValue('increment')}
          disabled={disabled}
          onClick={() => this.stepUp(input)}
        >
          <gux-icon icon-name="chevron-small-up" decorative></gux-icon>
        </button>

        <button
          class="gux-step-button"
          tabIndex={-1}
          type="button"
          title={getI18nValue('decrement')}
          disabled={disabled}
          onClick={() => this.stepDown(input)}
        >
          <gux-icon icon-name="chevron-small-down" decorative></gux-icon>
        </button>
      </div>
    ) as JSX.Element;
  }

  private stepDown(input: HTMLInputElement): void {
    if (input.value === '') {
      setInputValue(input, input.min || '0', false);
    } else {
      input.stepDown();
      this.simulateNativeInputAndChangeEvents(input);
    }
  }

  private stepUp(input: HTMLInputElement): void {
    if (input.value === '') {
      setInputValue(input, input.min || '0', false);
    } else {
      input.stepUp();
      this.simulateNativeInputAndChangeEvents(input);
    }
  }

  private simulateNativeInputAndChangeEvents(input: HTMLInputElement): void {
    simulateNativeEvent(input, 'input');
    simulateNativeEvent(input, 'change');
  }
}
