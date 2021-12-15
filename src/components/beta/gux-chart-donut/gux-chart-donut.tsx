/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Component, Element, h, JSX, Prop, Watch } from '@stencil/core';
import { EmbedOptions, VisualizationSpec } from 'vega-embed';

import { trackComponent } from '../../../usage-tracking';

import { logError } from '../../../utils/error/log-error';

import { VISUALIZATION_COLORS } from '../../../utils/theme/color-palette';

const DEFAULT_COLOR_FIELD_NAME = 'category';
const DEFAULT_LABEL_FIELD_NAME = 'value';
@Component({
  styleUrl: 'gux-chart-donut.less',
  tag: 'gux-chart-donut-beta'
})
export class GuxDonutChart {
  @Element()
  root: HTMLElement;

  private visualizationSpec: VisualizationSpec;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private baseChartSpec: Record<string, any> = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    encoding: {
      theta: { field: 'value', type: 'quantitative', stack: true },
      color: {
        field: DEFAULT_COLOR_FIELD_NAME,
        type: 'nominal',
        scale: { range: VISUALIZATION_COLORS },
        legend: null
      },
      tooltip: { aggregate: 'count', type: 'quantitative' }
    },
    layer: [
      {
        mark: { type: 'arc', outerRadius: 80 }
      },
      {
        mark: { type: 'text', radius: 90 },
        encoding: {
          text: { field: DEFAULT_LABEL_FIELD_NAME, type: 'quantitative' }
        }
      }
    ],
    view: { stroke: null }
  };

  /**
   * Data to be rendered in the chart.
   * Data field names must match the values you set in xFieldName and yFieldName
   */
  @Prop()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartData: Record<string, any>;

  @Prop()
  includeLegend: boolean;

  @Prop()
  legendTitle: string;

  @Prop()
  colorFieldName: string;

  @Prop()
  outerRadius: number;

  @Prop()
  innerRadius: number;

  @Prop()
  labelRadius: number;

  @Prop()
  labelField: string;

  @Prop()
  embedOptions: EmbedOptions;

  @Watch('chartData')
  parseData() {
    if (!this.outerRadius || !this.innerRadius) {
      logError(
        'gux-chart-donut',
        '[gux-chart-donut] requires outer-radius and inner-radius'
      );
    }

    let chartData = {};
    if (this.chartData) {
      chartData = { data: this.chartData };
    }

    if (this.includeLegend) {
      this.baseChartSpec.encoding.color.legend = true;
    }

    const colorFieldName = this.colorFieldName || DEFAULT_COLOR_FIELD_NAME;

    if (colorFieldName) {
      this.baseChartSpec.encoding.color.field = colorFieldName;
    }

    const legendTitle = this.legendTitle;
    if (legendTitle) {
      this.baseChartSpec.encoding.color.title = legendTitle;
    }

    const outerRadius = this.outerRadius;
    const innerRadius = this.innerRadius;

    this.baseChartSpec.layer = [
      {
        mark: { type: 'arc', outerRadius, innerRadius }
      },
      {
        mark: { type: 'arc', innerRadius, stroke: '#fff' }
      }
    ];

    const labelRadius = this.labelRadius;
    const labelField = this.labelField || DEFAULT_LABEL_FIELD_NAME;
    if (labelRadius) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.baseChartSpec.layer.push({
        mark: { type: 'text', radius: labelRadius },
        encoding: {
          text: { field: labelField, type: 'quantitative' }
        }
      });
    }

    const spec = Object.assign(this.baseChartSpec, chartData);
    this.visualizationSpec = spec;
  }

  componentWillLoad(): void {
    trackComponent(this.root);
    this.parseData();
  }

  render(): JSX.Element {
    return (
      <gux-visualization-beta
        visualizationSpec={this.visualizationSpec}
      ></gux-visualization-beta>
    ) as JSX.Element;
  }
}
