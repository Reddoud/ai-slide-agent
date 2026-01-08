export const LAYOUT_ASSIGNMENT_PROMPT = (slideData: {
  title: string;
  type: string;
  keyPoints: string[];
}) => `Given this slide content, determine the optimal layout and element positioning.

Slide title: ${slideData.title}
Intended type: ${slideData.type}
Key points: ${slideData.keyPoints.join(', ')}

Return a JSON object describing the elements and their positions:
{
  "elements": [
    {
      "type": "title" | "bullet_list" | "text" | "chart" | "diagram",
      "content": "content here",
      "gridPosition": { "row": 0, "col": 0, "rowSpan": 1, "colSpan": 12 }
    }
  ],
  "recommendedVisuals": ["suggestion 1", "suggestion 2"]
}`;

export const CONTENT_COMPRESSION_PROMPT = (text: string, maxBullets: number = 5) => `Compress the following content into ${maxBullets} concise, impactful bullet points suitable for a consulting slide.

<<<USER_DATA>>>
${text}
<<<END_USER_DATA>>>

Rules:
- Start each bullet with a strong action verb or key insight
- Keep each bullet to 10-15 words maximum
- Focus on insights, not descriptions
- Maintain logical flow

Return only the bullet points as a JSON array: ["bullet 1", "bullet 2", ...]`;
