export const NARRATIVE_COHERENCE_PROMPT = (slides: Array<{ title: string; keyPoints: string[] }>) => `Review the following slide deck for narrative coherence and logical flow.

Slides:
${slides.map((s, i) => `${i + 1}. ${s.title}\n   - ${s.keyPoints.join('\n   - ')}`).join('\n\n')}

Check for:
1. Clear story arc from beginning to end
2. Logical transitions between slides
3. Consistent messaging and themes
4. Each slide has a clear takeaway
5. Agenda alignment (if applicable)

Return a JSON object:
{
  "coherenceScore": 0-100,
  "issues": [
    {
      "slideIndex": 3,
      "category": "narrative",
      "severity": "warning",
      "message": "Weak transition from previous slide",
      "suggestion": "Add a connecting statement about..."
    }
  ],
  "strengths": ["strength 1", "strength 2"]
}`;

export const FACT_CHECK_PROMPT = (content: string) => `Review the following slide content for factual claims that should be verified or sourced.

<<<USER_DATA>>>
${content}
<<<END_USER_DATA>>>

Identify:
1. Specific numbers, statistics, or percentages
2. Claims about market size, growth rates, or trends
3. Attributions to companies, studies, or people
4. Time-sensitive statements

Return a JSON array of claims that need verification:
[
  {
    "claim": "The exact claim text",
    "type": "statistic" | "market_data" | "attribution" | "trend",
    "needsSource": true,
    "confidence": "high" | "medium" | "low"
  }
]`;
