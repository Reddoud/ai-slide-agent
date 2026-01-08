import PptxGenJS from 'pptxgenjs';
import { DiagramData } from '@slide-agent/shared';

export class DiagramRenderer {
  renderDiagram(
    slide: any,
    diagramData: DiagramData,
    position: { x: number; y: number; w: number; h: number }
  ): void {
    // Simple flowchart layout
    const nodePositions = this.calculateNodePositions(diagramData, position);

    // Render nodes
    diagramData.nodes.forEach((node, index) => {
      const pos = nodePositions.get(node.id);
      if (!pos) return;

      const nodeType = node.type || 'rect';

      if (nodeType === 'rect') {
        slide.addShape('rect', {
          x: pos.x,
          y: pos.y,
          w: pos.w,
          h: pos.h,
          fill: { color: 'E8F4F8' },
          line: { color: '0088CC', width: 2 },
        });
      } else if (nodeType === 'circle') {
        slide.addShape('ellipse', {
          x: pos.x,
          y: pos.y,
          w: pos.w,
          h: pos.h,
          fill: { color: 'E8F4F8' },
          line: { color: '0088CC', width: 2 },
        });
      } else if (nodeType === 'diamond') {
        slide.addShape('diamond', {
          x: pos.x,
          y: pos.y,
          w: pos.w,
          h: pos.h,
          fill: { color: 'FFF4E6' },
          line: { color: 'FF8800', width: 2 },
        });
      }

      // Add label
      slide.addText(node.label, {
        x: pos.x,
        y: pos.y,
        w: pos.w,
        h: pos.h,
        align: 'center',
        valign: 'middle',
        fontSize: 12,
        color: '333333',
      });
    });

    // Render edges (arrows)
    diagramData.edges.forEach(edge => {
      const fromPos = nodePositions.get(edge.from);
      const toPos = nodePositions.get(edge.to);

      if (!fromPos || !toPos) return;

      // Draw arrow from center of from-node to center of to-node
      const fromX = fromPos.x + fromPos.w / 2;
      const fromY = fromPos.y + fromPos.h / 2;
      const toX = toPos.x + toPos.w / 2;
      const toY = toPos.y + toPos.h / 2;

      slide.addShape('line', {
        x: fromX,
        y: fromY,
        w: toX - fromX,
        h: toY - fromY,
        line: { color: '666666', width: 2, endArrowType: 'arrow' },
      });

      // Add edge label if present
      if (edge.label) {
        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;

        slide.addText(edge.label, {
          x: midX - 0.5,
          y: midY - 0.2,
          w: 1,
          h: 0.4,
          align: 'center',
          fontSize: 10,
          color: '666666',
          fill: { color: 'FFFFFF' },
        });
      }
    });
  }

  private calculateNodePositions(
    diagramData: DiagramData,
    container: { x: number; y: number; w: number; h: number }
  ): Map<string, { x: number; y: number; w: number; h: number }> {
    const positions = new Map();

    const nodeCount = diagramData.nodes.length;
    if (nodeCount === 0) return positions;

    // Simple horizontal layout
    const nodeWidth = Math.min(1.5, container.w / (nodeCount + 1));
    const nodeHeight = 0.8;
    const spacing = (container.w - nodeCount * nodeWidth) / (nodeCount + 1);

    diagramData.nodes.forEach((node, index) => {
      positions.set(node.id, {
        x: container.x + spacing + index * (nodeWidth + spacing),
        y: container.y + (container.h - nodeHeight) / 2,
        w: nodeWidth,
        h: nodeHeight,
      });
    });

    return positions;
  }
}
