import PptxGenJS from 'pptxgenjs';
import { ChartData, ChartType } from '@slide-agent/shared';

export class ChartRenderer {
  renderChart(
    slide: any,
    chartData: ChartData,
    position: { x: number; y: number; w: number; h: number }
  ): void {
    const chartType = this.mapChartType(chartData.type);

    // Convert to PptxGenJS format
    const chartOptions: any = {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      chartColors: this.getChartColors(chartData),
      showLegend: true,
      showTitle: false,
      ...chartData.options,
    };

    // Prepare data in PptxGenJS format
    const pptxData = this.formatDataForPptx(chartData);

    slide.addChart(chartType, pptxData, chartOptions);
  }

  private mapChartType(type: ChartType): any {
    const mapping: Record<ChartType, any> = {
      bar: 'bar',
      line: 'line',
      pie: 'pie',
      scatter: 'scatter',
      area: 'area',
    };
    return mapping[type] || 'bar';
  }

  private formatDataForPptx(chartData: ChartData): any[] {
    return chartData.datasets.map(dataset => ({
      name: dataset.label,
      labels: chartData.labels,
      values: dataset.data,
    }));
  }

  private getChartColors(chartData: ChartData): string[] {
    // Use custom colors if provided, otherwise use default palette
    const customColors = chartData.datasets
      .map(ds => ds.color)
      .filter(c => c !== undefined) as string[];

    if (customColors.length === chartData.datasets.length) {
      return customColors;
    }

    // Default professional color palette
    return [
      '0088CC', // Blue
      '00C851', // Green
      'FF8800', // Orange
      'CC0000', // Red
      '9933CC', // Purple
      '00BCD4', // Cyan
      'FF6F00', // Deep Orange
      '4CAF50', // Light Green
    ];
  }
}
