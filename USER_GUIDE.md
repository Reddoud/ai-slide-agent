# AI Slide Agent - User Guide

Welcome to AI Slide Agent, your AI-powered assistant for creating professional, consulting-grade slide decks.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Creating Your First Deck](#creating-your-first-deck)
3. [Understanding Start Modes](#understanding-start-modes)
4. [Working with the Deck Editor](#working-with-the-deck-editor)
5. [Using AI Controls](#using-ai-controls)
6. [Quality Gates](#quality-gates)
7. [Exporting Your Deck](#exporting-your-deck)
8. [Collaboration Features](#collaboration-features)
9. [Templates and Themes](#templates-and-themes)
10. [Best Practices](#best-practices)

## Getting Started

### Accessing the Application
Navigate to your AI Slide Agent instance (e.g., `http://localhost:3000`).

### Home Screen
The home screen shows:
- **Recent Decks**: Your recently edited presentations
- **Quick Actions**: Create new deck, browse templates
- **Statistics**: Deck count, recent activity

### Navigation
- **Decks**: View all your presentations
- **Templates**: Browse available themes
- **Settings**: Manage your profile and organization

## Creating Your First Deck

### Step 1: Click "Create New Deck"
From the home screen or decks page, click the **"Create New Deck"** button.

### Step 2: Choose a Start Mode
Select how you want to begin:

1. **Paste Outline**
   - For when you have a bullet-point outline ready
   - Example:
     ```
     - Introduction to AI
     - Market Opportunity
     - Our Solution
     - Business Model
     - Next Steps
     ```

2. **Upload Document**
   - Supports PDF, DOCX, TXT
   - AI extracts key points and structures them
   - Best for: Meeting notes, reports, white papers

3. **Start Blank**
   - Begin with an empty deck
   - AI generates a basic structure based on your settings

4. **Import Table**
   - Supports CSV, XLSX
   - AI creates data visualization slides
   - Best for: Financial data, metrics, survey results

5. **Meeting Notes to Deck**
   - Paste raw meeting notes
   - AI creates a recap deck with decisions and action items

### Step 3: Configure Settings

**Title**: Give your deck a descriptive name
- ✅ Good: "Q4 Product Strategy Review"
- ❌ Avoid: "Presentation1"

**Audience**: Choose your target audience
- **Executive**: High-level, business-focused
- **Technical**: Detailed, implementation-focused
- **General**: Balanced for mixed audiences

**Goal**: What should this deck accomplish?
- **Persuade**: Convince audience to take action
- **Inform**: Share information and insights
- **Educate**: Teach a concept or process
- **Report**: Present data and findings

**Target Slides**: How many slides do you need?
- Short pitch: 5-8 slides
- Standard deck: 10-15 slides
- Deep dive: 20+ slides

**Theme**: Select a visual style
- Corporate Blue (professional, traditional)
- Modern Minimal (clean, contemporary)
- Custom themes (created by your organization)

### Step 4: Submit and Wait
Click **"Create Deck"**. The system will:
1. ✨ **Plan** your deck (5-15 seconds)
   - AI generates outline and narrative
2. 🎨 **Layout** your slides (2-5 seconds)
   - Applies templates and positions elements
3. ✅ **Ready** for editing
   - Deck opens in the editor

## Understanding Start Modes

### Paste Outline
**When to use**: You already know what you want to say.

**How it works**:
1. Paste your outline (bulleted or numbered list)
2. AI expands each point into a slide
3. Assigns appropriate slide types
4. Generates supporting content

**Tips**:
- Keep outline items concise (5-10 words each)
- Use clear hierarchy (main points vs. sub-points)
- Include 5-15 top-level items

### Upload Document
**When to use**: You have existing content to transform.

**Supported formats**: PDF, DOCX, TXT (up to 50MB)

**How it works**:
1. AI extracts text from document
2. Identifies key themes and structure
3. Creates logical slide flow
4. Compresses content to fit slides

**Tips**:
- Works best with structured documents (headings, sections)
- May need manual editing for very long docs (20+ pages)
- Review AI's interpretation; it may miss nuance

### Start Blank
**When to use**: You want AI to suggest structure.

**How it works**:
1. Based on title, audience, and goal, AI proposes outline
2. Creates standard deck structure:
   - Title slide
   - Agenda
   - Content slides
   - Conclusion/Next Steps

**Tips**:
- Be specific in your title ("Sales Process Optimization" vs. "Presentation")
- Set audience and goal carefully—they guide AI

### Import Table
**When to use**: You have data to visualize.

**Supported formats**: CSV, XLSX (up to 50MB)

**How it works**:
1. Upload file
2. AI previews data and suggests chart types
3. Creates KPI dashboard or data slides
4. Adds context and insights

**Tips**:
- Clean your data first (remove duplicates, fix formatting)
- Use descriptive column headers
- Limit to 10-15 columns for best results

### Meeting Notes to Deck
**When to use**: You need a quick recap deck after a meeting.

**How it works**:
1. Paste raw notes
2. AI identifies:
   - Key decisions made
   - Action items and owners
   - Important discussion points
3. Creates 5-8 slide recap

**Tips**:
- Include timestamps or topics to help AI structure
- Mention names for action item assignment
- Typically generates: Title, Decisions, Actions, Discussion, Next Steps

## Working with the Deck Editor

### Editor Layout

```
┌────────────────────────────────────────────────────────────┐
│  [Deck Title]   [Run Quality Check] [Export PPTX] [⋮]     │
├──────────┬──────────────────────────────┬──────────────────┤
│          │                              │  Inspector       │
│  Slide   │      Slide Preview           │  ┌────────────┐ │
│  List    │                              │  │  Element   │ │
│          │                              │  │  Controls  │ │
│  1. Title│                              │  │            │ │
│  2. Agenda                              │  │  [AI       │ │
│  3. Point 1                             │  │   Buttons] │ │
│  4. Point 2                             │  │            │ │
│  5. Next                                │  │  [Lock]    │ │
│     Steps│                              │  │  [Style]   │ │
│          │                              │  └────────────┘ │
│  [+ New] │                              │                  │
└──────────┴──────────────────────────────┴──────────────────┘
```

### Slide List (Left Panel)
- **Click** a slide to preview it
- **Drag** to reorder slides
- **Right-click** for options:
  - Duplicate slide
  - Delete slide
  - Change slide type
  - Add comment
- **"+ New Slide"** button at bottom

### Slide Preview (Center)
- Shows slide at approximately actual size
- **Click** elements to select them
- **Drag** to reposition (snaps to grid)
- **Resize** using corner handles

### Inspector Panel (Right)
Shows details for selected element:
- **Content**: Edit text, bullets, chart data
- **Style**: Font, color, size, alignment
- **Position**: X, Y, width, height
- **AI Buttons**: Context-aware AI actions
- **Lock Toggle**: Prevent AI from changing this element

## Using AI Controls

### Per-Element AI Buttons
When you select an element, AI buttons appear based on element type:

#### Title Element
- **Rewrite Title**: Make it more impactful
- **Generate Subtitle**: Add clarifying subtitle
- **Suggest Tone Shift**: Change tone (formal/casual/technical)

#### Bullet List
- **Tighten Bullets**: Reduce word count while preserving meaning
- **Expand Points**: Add more detail
- **Change Structure**: Reorder for better flow

#### Text Block
- **Simplify Language**: Reduce jargon
- **Add Examples**: Include concrete examples
- **Suggest Visual**: Recommend chart or diagram

#### Chart
- **Suggest Chart Type**: Better visualization for your data
- **Improve Labels**: Clarify axis labels and legend
- **Add Insight**: Generate key takeaway text

### Global AI Actions (Top Bar)
- **Generate Talk Track**: Creates 60-second script for deck
- **Create Q&A Prep**: Anticipates audience questions with suggested answers
- **Suggest Visuals**: Recommends images or diagrams for all slides

### AI Tone & Style Settings
Click the settings icon to adjust:
- **Tone**: Consulting / Startup / Academic
- **Verbosity**: Concise / Normal / Detailed
- **Jargon Level**: Low / Medium / High
- **Narrative Style**: Data-driven / Storytelling

### Locking Elements
To protect an element from AI changes:
1. Select the element
2. Click **🔒 Lock** in the inspector
3. Locked elements are marked with a lock icon
4. AI will work around locked content

**When to lock**:
- Legal disclaimers
- Specific data points
- Brand messaging
- Finalized content

### Non-Destructive Edits
Every AI action creates a version. You can:
- **Undo**: Revert to previous version
- **Version History**: See all changes, restore any version
- **Compare**: Side-by-side view of versions

## Quality Gates

### Running Quality Checks
Click **"Run Quality Checks"** in the top bar.

The system analyzes:
1. **Text Density**: Too many words per slide/bullet
2. **Consistency**: Capitalization, tense, number formatting
3. **Narrative Flow**: Logical progression, clear takeaways
4. **Chart Readability**: Data point limits, label clarity
5. **Fact Validation**: Claims needing sources

### Quality Score
You'll receive a score (0-100) and categorized issues:

- 🔴 **Errors** (deduct 10 points each): Must fix
  - Missing title slide
  - Slide content extends beyond bounds
  - Chart with mismatched data

- ⚠️ **Warnings** (deduct 5 points each): Should fix
  - Too many bullets (8+)
  - Inconsistent capitalization
  - Slide title too generic

- ℹ️ **Info** (deduct 2 points each): Consider fixing
  - Long bullet point (20+ words)
  - Vague quantifiers ("many", "most")
  - Missing presenter notes

### Fixing Issues
1. Click an issue to jump to that slide
2. Issue is highlighted
3. View suggested fix in the panel
4. Apply fix manually or use AI assist
5. Re-run quality check to verify

### Passing Score
- **90+**: Excellent, ready to present
- **70-89**: Good, minor tweaks recommended
- **50-69**: Needs work
- **Below 50**: Significant issues, review carefully

## Exporting Your Deck

### Export to PPTX
1. Click **"Export PPTX"** in the top bar
2. Job is enqueued (processing begins)
3. Progress bar shows status
4. Download link appears when ready (typically 5-15 seconds)

### PPTX Features
Your exported file includes:
- ✅ **Fully Editable**: All text, charts, images can be edited in PowerPoint
- ✅ **Safe Fonts**: Uses Arial, Calibri, etc. (works on all systems)
- ✅ **Presenter Notes**: Your notes appear in PowerPoint's notes pane
- ✅ **Charts**: Native PowerPoint charts (not images)
- ✅ **Diagrams**: Shapes and connectors (editable)

### Font Fallback
Custom fonts are mapped to safe alternatives:
- Helvetica → Arial
- Roboto → Calibri
- Montserrat → Arial

This ensures your deck looks good on any computer.

### Post-Export Editing
After downloading:
1. Open in PowerPoint, Keynote, or Google Slides
2. Make final tweaks (brand logos, specific formatting)
3. Your PPTX is the source of truth

**Tip**: If you need to make major changes, edit in AI Slide Agent and re-export.

## Collaboration Features

### Comments
Add comments to slides or elements:
1. Right-click slide or element
2. Select "Add Comment"
3. Type your comment
4. Tag teammates with @mentions (future)
5. Mark as resolved when addressed

### Sharing (Future)
- Generate shareable link (view-only or edit access)
- Set expiration date
- Track who viewed

### Team Templates
Admins can create org-wide templates:
1. Design a deck with your brand (colors, fonts, logo)
2. Save as template
3. Team members can use it for new decks

**Benefits**:
- Consistent brand across all decks
- Faster deck creation
- Compliance with company style guides

## Templates and Themes

### Browsing Templates
Navigate to **Templates** page to see:
- **Public Templates**: Available to everyone
- **Organization Templates**: Created by your company
- **Your Templates**: Saved by you

### Applying a Theme
1. Open a deck
2. Click settings icon → "Change Theme"
3. Select new theme
4. Slides are automatically reformatted

### Creating a Custom Theme
(Admin only)
1. Go to Templates → "Create Theme"
2. Configure:
   - **Colors**: Primary, secondary, accent, background, text
   - **Typography**: Heading font, body font, size scale
   - **Spacing**: Margins, padding, line height
   - **Logo**: Upload company logo (appears on every slide)
3. Save and make public or org-only

### Theme Elements
A theme controls:
- **Color Palette**: All slide colors
- **Fonts**: Heading and body fonts
- **Logo Placement**: Top-right corner by default
- **Spacing Rules**: Margins and padding
- **Background**: Solid color or image

## Best Practices

### Planning Your Deck
1. **Define Your Goal**: What action do you want from your audience?
2. **Know Your Audience**: Tailor language and depth
3. **Outline First**: Sketch your flow before using AI
4. **Target 1 Idea per Slide**: Don't cram multiple concepts

### Working with AI
- **Iterate**: AI's first suggestion may not be perfect—refine it
- **Be Specific**: "Tighten to 10 words" works better than "make it shorter"
- **Review Everything**: AI can make mistakes—always review output
- **Lock Finalized Content**: Prevent accidental overwrites

### Slide Design
- **Limit Bullets**: 3-5 per slide maximum
- **Use Visuals**: Charts, diagrams, images > walls of text
- **White Space is Good**: Don't fill every inch
- **Consistent Formatting**: Stick to your theme

### Data Visualization
- **Choose the Right Chart**:
  - **Bar**: Compare categories
  - **Line**: Show trends over time
  - **Pie**: Show proportions (use sparingly, max 5-7 slices)
  - **Scatter**: Show correlations
- **Label Everything**: Axis titles, units, legend
- **Highlight Key Data**: Use color to draw attention

### Presenter Notes
- Write notes for each slide (what to say, not what's on the slide)
- Include transitions ("This leads us to...")
- Note timing (if presenting)
- Add sources for fact-checking

### Quality Checks
- Run quality check **before finalizing**
- Aim for 85+ score
- Pay attention to narrative flow issues
- Fix all errors, most warnings

### Exporting
- Export early and often (test in PowerPoint)
- Check font rendering
- Verify charts are editable
- Test on different devices if presenting remotely

## Troubleshooting

### "AI generation failed"
- **Check**: Is your OpenAI API key valid?
- **Try**: Use a simpler prompt or smaller input
- **Fallback**: System will use default structure

### "Job stuck in progress"
- **Wait**: Some operations take 30-60 seconds
- **Refresh**: Check job status
- **Contact Support**: If stuck for 5+ minutes

### "Exported PPTX looks wrong"
- **Fonts**: Check font fallback (Arial should always work)
- **Charts**: Verify data isn't missing or malformed
- **Re-export**: Sometimes a fresh export fixes issues

### "Quality score is low"
- **Review Issues**: Click each to understand
- **Use AI Assist**: Let AI fix simple issues
- **Manual Edit**: For complex problems

### "Can't upload file"
- **Size Limit**: 50MB max
- **Format**: PDF, DOCX, TXT, CSV, XLSX only
- **Corruption**: Try re-saving the file

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save changes
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Ctrl/Cmd + D**: Duplicate slide
- **Delete**: Delete selected element
- **Arrow Keys**: Nudge element position
- **Shift + Arrow**: Nudge by 10px

## Tips for Success

1. **Start Small**: Create a 5-slide deck to learn the interface
2. **Experiment with AI**: Try different prompts and see what works
3. **Use Templates**: Don't reinvent the wheel
4. **Get Feedback**: Share drafts with colleagues
5. **Iterate**: First draft is rarely final—refine iteratively
6. **Save Often**: Auto-save is enabled, but manual save doesn't hurt
7. **Check Mobile**: If presenting from a device, test export there

## Next Steps

Now that you've learned the basics:
1. ✅ Create your first deck using the wizard
2. ✅ Experiment with AI controls
3. ✅ Run a quality check
4. ✅ Export and review in PowerPoint
5. ✅ Share with your team

**Need Help?**
- Check the [README](./README.md) for technical setup
- Review [ARCHITECTURE](./ARCHITECTURE.md) for system design
- Open an issue on GitHub for bugs or feature requests

Happy presenting! 🎉
