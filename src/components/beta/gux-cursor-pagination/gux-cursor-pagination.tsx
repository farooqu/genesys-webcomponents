import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  JSX,
  Prop
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
import { buildI18nForComponent, GetI18nValue } from '../../../i18n';

import paginationResources from './i18n/en.json';
import { GuxCursorPaginationDetail } from './gux-cursor-pagination.types';

@Component({
  styleUrl: 'gux-cursor-pagination.less',
  tag: 'gux-cursor-pagination-beta'
})
export class GuxCursorPagination {
  @Element()
  private root: HTMLElement;

  private i18n: GetI18nValue;

  @Prop()
  hasPrevious: boolean = false;

  @Prop()
  hasNext: boolean = false;

  @Event()
  private guxcursorpaginationchange: EventEmitter<GuxCursorPaginationDetail>;

  private onButtonClick(paginationDetail: GuxCursorPaginationDetail): void {
    this.guxcursorpaginationchange.emit(paginationDetail);
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);

    this.i18n = await buildI18nForComponent(this.root, paginationResources);
  }

  render(): JSX.Element {
    return (
      <div class={`gux-cursor-pagination-buttons-container`}>
        <gux-button
          accent="secondary"
          title={this.i18n('previous')}
          disabled={!this.hasPrevious}
          onClick={() => this.onButtonClick('previous')}
        >
          <gux-icon decorative iconName="ic-chevron-small-left"></gux-icon>
        </gux-button>

        <gux-button
          accent="secondary"
          title={this.i18n('next')}
          disabled={!this.hasNext}
          onClick={() => this.onButtonClick('next')}
        >
          <gux-icon decorative iconName="ic-chevron-small-right"></gux-icon>
        </gux-button>
      </div>
    );
  }
}
