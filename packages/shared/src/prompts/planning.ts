export const DECK_PLANNING_PROMPT = (params: {
  title: string;
  audience: string;
  goal: string;
  targetSlides: number;
  inputContent?: string;
}) => `Create a strategic slide deck outline with the following parameters:

Title: ${params.title}
Audience: ${params.audience}
Goal: ${params.goal}
Target slide count: ${params.targetSlides}

${params.inputContent ? `Input content:\n<<<USER_DATA>>>\n${params.inputContent}\n<<<END_USER_DATA>>>` : ''}

Generate a structured deck outline with:
1. A compelling narrative arc
2. Logical flow and transitions
3. Appropriate slide types for each section
4. Key points for each slide (3-5 bullets max)
5. A 60-second talk track summary

Return a JSON object with:
{
  "outline": [
    {
      "title": "Slide title",
      "type": "slide_type",
      "keyPoints": ["point 1", "point 2", "point 3"],
      "notes": "presenter notes or context"
    }
  ],
  "narrative": "Overall story arc in 2-3 sentences",
  "agenda": ["Section 1", "Section 2", "Section 3"],
  "talkTrack": "60-second verbal summary"
}`;

export const MEETING_NOTES_TO_DECK_PROMPT = (notes: string) => `Convert the following meeting notes into a concise recap deck.

<<<USER_DATA>>>
${notes}
<<<END_USER_DATA>>>

Create slides that:
1. Start with a title slide
2. Include key decisions made
3. Highlight action items with owners
4. Note important discussion points
5. End with next steps

Keep it to 5-8 slides maximum.`;

export const OUTLINE_TO_PLAN_PROMPT = (outline: string) => `Convert this outline into a detailed slide deck plan.

<<<USER_DATA>>>
${outline}
<<<END_USER_DATA>>>

Assign appropriate slide types and expand each point into actionable content.`;
