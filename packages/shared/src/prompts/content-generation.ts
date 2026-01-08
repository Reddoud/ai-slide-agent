export const REWRITE_TITLE_PROMPT = (currentTitle: string, context: string, tone: string = 'consulting') => `Rewrite this slide title to be more impactful and clear.

Current title: ${currentTitle}
Context: ${context}
Tone: ${tone}

Rules:
- Use active voice
- Be specific and concrete
- Aim for 5-10 words
- Front-load the key insight

Return only the new title as plain text.`;

export const TIGHTEN_BULLETS_PROMPT = (bullets: string[], tone: string = 'consulting') => `Tighten these bullet points to be more concise and impactful.

Current bullets:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Tone: ${tone}

Rules:
- Maximum 12 words per bullet
- Start with action verbs or key insights
- Remove filler words
- Maintain parallel structure

Return a JSON array: ["bullet 1", "bullet 2", ...]`;

export const GENERATE_SUBTITLE_PROMPT = (title: string, context: string) => `Generate a compelling subtitle for this slide.

Title: ${title}
Context: ${context}

The subtitle should:
- Clarify or expand on the title
- Be 5-12 words
- Add value, not redundancy

Return only the subtitle as plain text.`;

export const SUGGEST_VISUAL_PROMPT = (slideContent: {
  title: string;
  bullets: string[];
  type: string;
}) => `Suggest the most effective visual aid for this slide.

Title: ${slideContent.title}
Type: ${slideContent.type}
Content: ${slideContent.bullets.join('; ')}

Consider: charts, diagrams, icons, images, or data visualizations.

Return a JSON object:
{
  "visualType": "chart" | "diagram" | "icon" | "image" | "none",
  "specificType": "bar_chart" | "flowchart" | "icon_grid" | etc,
  "rationale": "Why this visual works best",
  "dataNeeded": "What data or elements are required"
}`;

export const CREATE_DIAGRAM_PROMPT = (description: string) => `Create a diagram structure based on this description.

<<<USER_DATA>>>
${description}
<<<END_USER_DATA>>>

Return a JSON object with nodes and edges:
{
  "nodes": [
    { "id": "node1", "label": "Label text", "type": "rect" | "circle" | "diamond" }
  ],
  "edges": [
    { "from": "node1", "to": "node2", "label": "optional label" }
  ]
}`;

export const GENERATE_PRESENTER_NOTES_PROMPT = (slideContent: {
  title: string;
  elements: Array<{ type: string; content: any }>;
}) => `Generate concise presenter notes for this slide.

Title: ${slideContent.title}
Content: ${JSON.stringify(slideContent.elements, null, 2)}

Notes should:
- Expand on key points without repeating verbatim
- Include transitions to next slide
- Highlight important data or insights
- Be 3-5 sentences maximum
- Use natural speaking language

Return only the notes as plain text.`;

export const TALK_TRACK_PROMPT = (deckOutline: any) => `Create a 60-second talk track for this presentation.

Deck outline:
${JSON.stringify(deckOutline, null, 2)}

The talk track should:
- Hit the main narrative arc
- Be speakable in 60 seconds
- Include a clear opening and close
- Emphasize key insights

Return only the talk track as plain text.`;

export const QA_PREP_PROMPT = (deckContent: any) => `Generate Q&A preparation notes based on this deck.

Deck content:
${JSON.stringify(deckContent, null, 2)}

Provide:
1. 5 likely questions the audience will ask
2. Suggested answers for each
3. Potential objections and responses

Return a JSON object:
{
  "questions": [
    {
      "question": "The question text",
      "suggestedAnswer": "How to respond",
      "keyPoints": ["point 1", "point 2"]
    }
  ],
  "objections": [
    {
      "objection": "Potential pushback",
      "response": "How to address it"
    }
  ]
}`;
