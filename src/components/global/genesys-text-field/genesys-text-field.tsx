import {
  Component,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

enum Types {
  Warning = 'warning',
  Error = 'error'
}

@Component({
  styleUrl: 'genesys-text-field.less',
  tag: 'genesys-text-field'
})
export class GenesysTextField {
  inputElement: HTMLInputElement;

  /**
   * Indicate the input value
   */
  @Prop({ mutable: true, reflectToAttr: true })
  value: string = '';

  /**
   * Disable the input and prevent interactions.
   */
  @Prop()
  disabled: boolean = false;

  /**
   * The input placeholder.
   */
  @Prop()
  placeholder: string;

  /**
   * The input label.
   */
  @Prop()
  label: string;

  /**
   * The input label position (can be left or top) if not defined the position depends of the label width.
   */
  @Prop()
  labelPosition: string;

  /**
   * The input validation.
   */
  @Prop()
  validation: any | `(newValue: string) => any` | RegExp = null;

  /**
   * The message displayed on validation failure.
   */
  @Prop({ mutable: true })
  errorMessage: string = '';

  /**
   * The message type (warning or error)
   */
  @Prop({ mutable: true })
  errorMessageType: string = Types.Error;

  /**
   * Timeout between input and validation.
   */
  @Prop()
  debounceTimeout: number = 500;

  /**
   * The label for the erase button
   */
  @Prop()
  eraseLabel: string = ''

  @State()
  classList: string[] = [];

  @State()
  internalErrorMessage: string;
  firstValue: string;
  timeout: any;

  /**
   * Triggered when user inputs.
   * @return The input value
   */
  @Event()
  input: EventEmitter;
  emitInput(event) {
    event.preventDefault();
    event.stopPropagation();
    this.value = event.target.value;
    this.input.emit(event.target.value);
  }

  @Watch('value')
  watchValue(newValue: string) {
    window.clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      this._testValue(newValue); 
    }, this.debounceTimeout);
  }

  _testValue(value: string) {
    if (!this.validation) {
      return;
    }
    if (this.validation instanceof RegExp) {
      if (!this.validation.test(value)) {
        this.errorMessageType = Types.Error;
        this.errorMessage = this.internalErrorMessage;
      } else {
        this.errorMessage = '';
      }
    } else if (typeof this.validation === 'function') {
      const validation = this.validation(value);
        if (validation) {
          if (validation.warning) {
            this.errorMessageType = Types.Warning;
            this.errorMessage = validation.warning;
          } else if (validation.error) {
            this.errorMessageType = Types.Error;
            this.errorMessage = validation.error;
          } else {
            this.errorMessage = '';
          }
        } else {
          this.errorMessageType = Types.Error;
          this.errorMessage = this.internalErrorMessage;
        }
    }
  }

  getClassList () :string {
    let classList = [];
    if (['left', 'top'].includes(this.labelPosition)) {
      if (this.labelPosition === 'left') {
        classList = [...classList, 'flex'];
      }
    } else if (this.label && this.label.length < 10) {
      classList = [...classList, 'flex'];
    }

    if (this.errorMessage) {
      classList = [...classList, this.errorMessageType];
    }
    return classList.join(' ');
  }

  componentDidLoad() {
    this.internalErrorMessage = this.errorMessage;
    this.firstValue = this.value;
    this._testValue(this.value); 
  }

  getIconByMessageType(type) {
    return (type === 'warning' ? 'genesys-icon-alert-triangle' : 'genesys-icon-alert-octo');
  }

  _clear(event) {
    this.clear();
    this.inputElement.focus();
    this.emitInput(event);
  }

  /**
   * Clears the input.
   */
  @Method()
  clear() {
    this.value = '';
    this.inputElement.value = '';
  }

  render() {
    return (
      <div class={this.getClassList()}>
        <label>{this.label}</label>
        <div class="genesys-field">
          <input
            aria-label={this.label}
            type='text'
            value={this.value}
            ref={el => (this.inputElement = el)}
            disabled={this.disabled}
            placeholder={this.placeholder}
            onInput={e => this.emitInput(e)}
          />
          {this.value && (
            <button
              type="button"
              class="genesys-icon-close"
              title={this.eraseLabel}
              onClick={e => this._clear(e)}
            />
          )}
        </div>
        {this.errorMessage && (
          <div class="genesys-error">
            <i class={this.getIconByMessageType(this.errorMessageType)} />
            <label>{this.errorMessage}</label>
          </div>
        )}
      </div>
    );
  }
}