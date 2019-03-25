import {
  Component,
  Event,
  EventEmitter,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';
import { GuxDropdown } from '../../gux-dropdown/gux-dropdown';

@Component({
  styleUrl: 'gux-pagination-items-per-page.less',
  tag: 'gux-pagination-items-per-page'
})
export class GuxPaginationItemsPerPage {
  @Prop()
  i18n: (resourceKey: string, context?: any) => string;

  @State()
  itemsPerPage: number = 25;
  @State()
  itemsPerPageOptions: number[] = [25, 50, 100];

  @Event()
  itemsPerPageChanged: EventEmitter<number>;

  private dropdown: GuxDropdown;

  @Method()
  setItemsPerPage(value: number, options: number[]): void {
    this.itemsPerPageOptions = options;
    this.itemsPerPage = value;
  }

  @Watch('itemsPerPageOptions')
  itemsPerPageOptionsChanged(newValue: number[]) {
    this.dropdown.items = newValue.map(option => ({ text: option + '' }));
  }

  componentDidLoad() {
    this.itemsPerPageOptionsChanged(this.itemsPerPageOptions);
  }

  render() {
    return (
      <div class="pagination-item-counts">
        <gux-dropdown
          class="pagination-items-per-page"
          ref={dropdown => (this.dropdown = dropdown as any)}
          value={this.itemsPerPage + ''}
          onChange={() =>
            this.itemsPerPageChanged.emit(parseInt(this.dropdown.value, 10))
          }
        >
          {/* {(this.itemsPerPageOptions || []).map(opt => (
            <option selected={opt === this.itemsPerPage}>{opt}</option>
          ))} */}
        </gux-dropdown>
        <span>{this.i18n && this.i18n('perPage')}</span>
      </div>
    );
  }
}