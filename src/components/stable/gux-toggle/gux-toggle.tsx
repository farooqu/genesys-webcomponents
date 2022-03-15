import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Listen,
  Prop
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { randomHTMLId } from '../../../utils/dom/random-html-id';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';

import translationResources from './i18n/en.json';

import { GuxToggleLabelPosition } from './gux-toggle.types';

@Component({
  styleUrl: 'gux-toggle.less',
  tag: 'gux-toggle',
  shadow: { delegatesFocus: true }
})
export class GuxToggle {
  private i18n: GetI18nValue;

  @Element()
  private root: HTMLElement;

  private labelId: string = randomHTMLId('gux-toggle-label');
  private errorId: string = randomHTMLId('gux-toggle-error');

  @Prop({ mutable: true })
  checked: boolean = false;

  @Prop()
  disabled: boolean = false;

  @Prop()
  loading: boolean = false;

  @Prop()
  checkedLabel: string;

  @Prop()
  uncheckedLabel: string;

  @Prop()
  labelPosition: GuxToggleLabelPosition = 'right';

  @Prop()
  errorMessage: string;

  @Event()
  check: EventEmitter<boolean>;

  @Listen('click')
  onClick(): void {
    this.toggle();
  }

  @Listen('keydown')
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
    }
  }

  private toggle(): void {
    if (!this.disabled && !this.loading) {
      this.checked = !this.checked;

      this.check.emit(this.checked);
    }
  }

  private getAriaLabel(): string {
    return (
      this.root.getAttribute('aria-label') ||
      this.root.title ||
      this.i18n('defaultAriaLabel')
    );
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, translationResources);

    const variant =
      this.checkedLabel || this.uncheckedLabel ? 'labled' : 'unlabled';

    trackComponent(this.root, { variant });
  }

  private renderLoading(): JSX.Element {
    if (this.loading) {
      return (
        <div class="gux-toggle-label-loading">
          <gux-radial-loading context="input"></gux-radial-loading>
        </div>
      ) as JSX.Element;
    }
  }

  private renderLabel(): JSX.Element {
    if (this.uncheckedLabel && this.checkedLabel) {
      const labelText = this.checked ? this.checkedLabel : this.uncheckedLabel;

      return (
        <div class="gux-toggle-label-and-error">
          <div class="gux-toggle-label">
            <div id={this.labelId} class="gux-toggle-label-text">
              {labelText}
            </div>

            {this.renderLoading()}
          </div>
        </div>
      ) as JSX.Element;
    }
  }

  private renderError(): JSX.Element {
    if (this.errorMessage) {
      return (
        <div id={this.errorId} class="gux-toggle-error">
          <gux-error-message-beta>{this.errorMessage}</gux-error-message-beta>
        </div>
      ) as JSX.Element;
    }
  }

  render(): JSX.Element {
    return (
      <div
        class={{
          'gux-toggle-container': true,
          'gux-toggle-label-left': this.labelPosition === 'left',
          'gux-disabled': this.disabled || this.loading
        }}
      >
        <div class="gux-toggle-input">
          <gux-toggle-slider
            checked={this.checked}
            disabled={this.disabled || this.loading}
            guxAriaLabel={this.getAriaLabel()}
            labelId={
              this.checkedLabel && this.uncheckedLabel ? this.labelId : ''
            }
            errorId={this.errorMessage ? this.errorId : ''}
          ></gux-toggle-slider>
          {this.renderLabel()}
        </div>
        {this.renderError()}
      </div>
    ) as JSX.Element;
  }
}
