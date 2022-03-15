import {
  Component,
  h,
  Element,
  Event,
  EventEmitter,
  JSX,
  Listen,
  Prop,
  Method
} from '@stencil/core';

import { buildI18nForComponent, GetI18nValue } from '../../../../i18n';
import { randomHTMLId } from '../../../../utils/dom/random-html-id';
import tableResources from '../i18n/en.json';

@Component({
  styleUrl: 'gux-all-row-select.less',
  tag: 'gux-all-row-select'
})
export class GuxAllRowSelect {
  private inputElement: HTMLInputElement;

  @Element()
  root: HTMLElement;

  private id: string = randomHTMLId('gux-all-row-select');
  private i18n: GetI18nValue;

  @Prop({ mutable: true })
  selected: boolean = false;

  @Event()
  internalallrowselectchange: EventEmitter;

  @Listen('input')
  onCheck(event: CustomEvent): void {
    event.stopPropagation();

    const input = event.target as HTMLInputElement;

    this.selected = input.checked;
    this.internalallrowselectchange.emit();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  @Method()
  async setIndeterminate(indeterminate: boolean = true): Promise<void> {
    this.inputElement.indeterminate = indeterminate;
  }

  async componentWillLoad(): Promise<void> {
    this.i18n = await buildI18nForComponent(this.root, tableResources);
  }

  render(): JSX.Element {
    return (
      <gux-form-field>
        <input
          ref={el => (this.inputElement = el)}
          slot="input"
          id={this.id}
          type="checkbox"
          checked={this.selected}
        />
        <label slot="label" htmlFor={this.id}>
          &#8203;
          <span class="gux-label-text">{this.i18n('selectAllTableRows')}</span>
        </label>
      </gux-form-field>
    ) as JSX.Element;
  }
}
