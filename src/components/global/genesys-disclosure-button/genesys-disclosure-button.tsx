import { Event, EventEmitter, Component, Prop, State } from '@stencil/core';

@Component({
  tag: 'genesys-disclosure-button',
  styleUrl: 'genesys-disclosure-button.less'
})
export class GenesysDisclosureButton {
  /**
   * Indicates the position of the button panel (right or left)
   **/
  @Prop()
  position: string = 'left';

  /**
   * Denotes state of discloseure panel
   **/
  @State()
  isPanelActive: boolean = false;

  buttonImg: string = 'genesys-icon-expand-right';

  /**
   * Return the state of the components panel on state chenge
   * @return the panel state
   */
  @Event()
  active: EventEmitter;

  togglePanel() {
    this.isPanelActive = !this.isPanelActive;
    this.setButtonImg();
    this.active.emit(this.isPanelActive);
  }

  setButtonImg() {
    if (this.position === 'right') {
      this.buttonImg = this.isPanelActive
        ? 'genesys-icon-expand-right'
        : 'genesys-icon-expand-left';
    } else {
      this.buttonImg = this.isPanelActive
        ? 'genesys-icon-expand-left'
        : 'genesys-icon-expand-right';
    }
  }

  componentDidLoad() {
    this.setButtonImg();
  }

  render() {
    const activeClass = this.isPanelActive ? 'active' : '';
    return (
      <div class={`disclosure-button-container ${this.position}`}>
        <button class={this.buttonImg} onClick={() => this.togglePanel()} />
        <div class={`disclosure-panel ${this.position} ${activeClass}`}>
          <slot name="panel-content" />
        </div>
      </div>
    );
  }
}
