import { Component, Element, h, Host, JSX } from '@stencil/core';
import { default as embed, VisualizationSpec } from 'vega-embed';

import { buildI18nForComponent, GetI18nValue } from '../../../i18n';
import { trackComponent } from '../../../usage-tracking';

import localeResources from './i18n/en.json';

@Component({
  styleUrl: 'gux-chart-graph.less',
  tag: 'gux-chart-graph-beta'
})
export class GuxChartGraph {
  private i18n: GetI18nValue;

  @Element()
  root: HTMLElement;

  async componentWillLoad(): Promise<void> {
    trackComponent(this.root);

    this.i18n = await buildI18nForComponent(this.root, localeResources);

    const chartSpec: VisualizationSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      title: this.i18n('title'),
      description: this.i18n('description'),
      width: {
        step: 40
      },
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
          { a: 'C', b: 43 },
          { a: 'D', b: 91 },
          { a: 'E', b: 81 },
          { a: 'F', b: 53 },
          { a: 'G', b: 19 },
          { a: 'H', b: 87 },
          { a: 'I', b: 52 }
        ]
      },
      mark: 'bar',
      encoding: {
        x: { field: 'a', type: 'ordinal', title: this.i18n('letters') },
        y: { field: 'b', type: 'quantitative', title: this.i18n('count') }
      }
    };

    embed(this.root, chartSpec);
  }

  render(): JSX.Element {
    return <Host></Host>;
  }
}
