import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
  Watch
} from '@stencil/core';

import { trackComponent } from '../../../usage-tracking';
@Component({
  styleUrl: 'gux-tabs-advanced.less',
  tag: 'gux-tabs-advanced',
  shadow: true
})
export class GuxTabsAdvanced {
  @Element()
  private root: HTMLElement;

  @State()
  tabList: HTMLGuxTabAdvancedListElement;

  @State()
  tabPanels: HTMLGuxTabAdvancedPanelElement[] = [];

  /**
   * tabId of the currently selected tab
   */
  @Prop({ mutable: true })
  activeTab: string;

  /**
   * Triggers when the active tab changes.
   */
  @Event()
  guxactivetabchange: EventEmitter<string>;

  @Watch('activeTab')
  watchActiveTab(newValue: string) {
    this.guxactivetabchange.emit(newValue);
  }

  @Listen('internalactivatetabpanel')
  onInternalActivateTabPanel(event: CustomEvent): void {
    event.stopPropagation();

    this.activateTab(event.detail, this.tabList, this.tabPanels);
  }

  @Method()
  async guxActivate(tabId: string): Promise<void> {
    this.activateTab(tabId, this.tabList, this.tabPanels);
  }

  private onSlotchange(): void {
    const [tabListSlot, defaultSlot] = Array.from(
      this.root.shadowRoot.querySelectorAll('slot')
    );

    this.tabList =
      tabListSlot.assignedElements()[0] as HTMLGuxTabAdvancedListElement;
    this.tabPanels =
      defaultSlot.assignedElements() as HTMLGuxTabAdvancedPanelElement[];

    this.activateTab(this.activeTab, this.tabList, this.tabPanels);
  }

  private activateTab(
    tabId: string,
    tabList: HTMLGuxTabAdvancedListElement,
    panels: HTMLGuxTabAdvancedPanelElement[]
  ): void {
    if (tabId) {
      this.activeTab = tabId;
    } else {
      this.activeTab = tabList
        .querySelector('gux-tab-advanced')
        .getAttribute('tab-id');
    }

    tabList.guxSetActive(this.activeTab);
    panels.forEach(panel => panel.guxSetActive(panel.tabId === this.activeTab));
  }

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);
  }

  render() {
    return (
      <Host>
        <div class="gux-tabs">
          <slot name="tab-list"></slot>
          <div>
            <slot onSlotchange={this.onSlotchange.bind(this)}></slot>
          </div>
        </div>
      </Host>
    );
  }
}
