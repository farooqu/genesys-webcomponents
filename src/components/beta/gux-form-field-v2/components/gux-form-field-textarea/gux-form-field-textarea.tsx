import { Component, Element, h, JSX, Prop, State } from '@stencil/core';

import { OnMutation } from '../../../../../utils/decorator/on-mutation';
import { onDisabledChange } from '../../../../../utils/dom/on-attribute-change';
import { onRequiredChange } from '../../../../../utils/dom/on-attribute-change';
import { preventBrowserValidationStyling } from '../../../../../utils/dom/prevent-browser-validation-styling';
import { trackComponent } from '../../../../../usage-tracking';

import { GuxFormFieldContainer } from '../../functional-components/gux-form-field-container/gux-form-field-container';
import { GuxFormFieldError } from '../../functional-components/gux-form-field-error/gux-form-field-error';
import { GuxFormFieldLabel } from '../../functional-components/gux-form-field-label/gux-form-field-label';

import { GuxFormFieldLabelPosition } from '../../gux-form-field.types';
import {
  hasErrorSlot,
  getComputedLabelPosition,
  validateFormIds
} from '../../gux-form-field.servce';

import { GuxFormFieldTextAreaResize } from './gux-form-field-textarea.types';
/**
 * @slot input - Required slot for input tag
 * @slot label - Required slot for label tag
 * @slot error - Optional slot for error message
 */
@Component({
  styleUrl: 'gux-form-field-textarea.less',
  tag: 'gux-form-field-textarea-beta',
  shadow: true
})
export class GuxFormFieldTextarea {
  private input: HTMLTextAreaElement;
  private label: HTMLLabelElement;
  private disabledObserver: MutationObserver;
  private requiredObserver: MutationObserver;
  private textareaContainerElement: HTMLDivElement;

  @Element()
  private root: HTMLElement;

  @Prop()
  resize: GuxFormFieldTextAreaResize;

  @Prop()
  labelPosition: GuxFormFieldLabelPosition;

  @State()
  private computedLabelPosition: GuxFormFieldLabelPosition = 'above';

  @State()
  private disabled: boolean;

  @State()
  private required: boolean = true;

  @State()
  private hasError: boolean = false;

  @OnMutation({ childList: true, subtree: true })
  onMutation(): void {
    this.hasError = hasErrorSlot(this.root);
  }

  componentWillLoad(): void {
    this.setInput();
    this.setLabel();

    this.hasError = hasErrorSlot(this.root);

    trackComponent(this.root, { variant: this.variant });
  }

  componentDidLoad(): void {
    this.updateHeight(this.textareaContainerElement, this.input, this.resize);
  }

  disconnectedCallback(): void {
    this.disabledObserver.disconnect();
    this.requiredObserver.disconnect();
  }

  render(): JSX.Element {
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
            ref={el => (this.textareaContainerElement = el)}
            class={{
              'gux-input': true,
              [`gux-resize-${this.resize}`]: true,
              'gux-disabled': this.disabled,
              'gux-input-error': this.hasError
            }}
          >
            <slot name="input" />
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

    return `${this.resize}-${labelPositionVariant}`;
  }

  private setInput(): void {
    this.input = this.root.querySelector('textarea[slot="input"]');

    preventBrowserValidationStyling(this.input);

    this.updateHeight(this.textareaContainerElement, this.input, this.resize);

    this.input.addEventListener('input', () => {
      this.updateHeight(this.textareaContainerElement, this.input, this.resize);
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

  private updateHeight(
    container: HTMLElement,
    input: HTMLTextAreaElement,
    resize: GuxFormFieldTextAreaResize
  ): void {
    if (resize === 'auto') {
      if (container) {
        container.dataset.replicatedValue = input.value;
        container.style.maxHeight = input.style.maxHeight;
      }
    }
  }
}
