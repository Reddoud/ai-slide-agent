import { QualityIssue, ChartData } from '@slide-agent/shared';

export const checkChartReadability = (params: {
  slideId: string;
  elementId: string;
  chartData: ChartData;
  chartWidth: number;
  chartHeight: number;
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  // Check number of data points
  const dataPointCount = params.chartData.labels.length;

  if (params.chartData.type === 'pie' && dataPointCount > 7) {
    issues.push({
      id: `chart-${params.elementId}-too-many-slices`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'warning',
      category: 'chart',
      message: `Pie chart has too many slices (${dataPointCount})`,
      suggestion: 'Consolidate into 5-7 categories or use a different chart type',
    });
  }

  if ((params.chartData.type === 'bar' || params.chartData.type === 'line') && dataPointCount > 15) {
    issues.push({
      id: `chart-${params.elementId}-too-many-points`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'warning',
      category: 'chart',
      message: `Chart has too many data points (${dataPointCount})`,
      suggestion: 'Aggregate data or show only key points',
    });
  }

  // Check for too many datasets
  if (params.chartData.datasets.length > 5) {
    issues.push({
      id: `chart-${params.elementId}-too-many-series`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'warning',
      category: 'chart',
      message: `Chart has too many data series (${params.chartData.datasets.length})`,
      suggestion: 'Show only the most important 3-5 series',
    });
  }

  // Check label length
  const longLabels = params.chartData.labels.filter(label => label.length > 20);
  if (longLabels.length > 0) {
    issues.push({
      id: `chart-${params.elementId}-long-labels`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'info',
      category: 'chart',
      message: 'Some chart labels are very long',
      suggestion: 'Abbreviate labels or rotate them',
    });
  }

  // Check for missing data
  for (let i = 0; i < params.chartData.datasets.length; i++) {
    const dataset = params.chartData.datasets[i];
    if (dataset.data.length !== dataPointCount) {
      issues.push({
        id: `chart-${params.elementId}-missing-data-${i}`,
        slideId: params.slideId,
        elementId: params.elementId,
        severity: 'error',
        category: 'chart',
        message: `Dataset "${dataset.label}" has mismatched data points`,
        suggestion: 'Ensure all datasets have the same number of points as labels',
      });
    }
  }

  // Warn if chart is too small
  const minChartSize = 300;
  if (params.chartWidth < minChartSize || params.chartHeight < minChartSize) {
    issues.push({
      id: `chart-${params.elementId}-too-small`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'warning',
      category: 'chart',
      message: 'Chart may be too small to read clearly',
      suggestion: 'Increase chart size or simplify data',
    });
  }

  return issues;
};

export const checkDataQuality = (params: {
  slideId: string;
  elementId: string;
  values: number[];
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  // Check for all zeros
  if (params.values.every(v => v === 0)) {
    issues.push({
      id: `chart-${params.elementId}-all-zeros`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'error',
      category: 'chart',
      message: 'Chart contains only zero values',
      suggestion: 'Verify data source',
    });
  }

  // Check for extreme outliers
  const mean = params.values.reduce((a, b) => a + b, 0) / params.values.length;
  const stdDev = Math.sqrt(
    params.values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / params.values.length
  );

  const outliers = params.values.filter(v => Math.abs(v - mean) > 3 * stdDev);

  if (outliers.length > 0) {
    issues.push({
      id: `chart-${params.elementId}-outliers`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'info',
      category: 'chart',
      message: 'Chart contains extreme outliers that may skew visualization',
      suggestion: 'Consider using a logarithmic scale or separate chart',
    });
  }

  return issues;
};
