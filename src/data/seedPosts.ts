import { Post } from '../types';

export const SEED_POSTS: Post[] = [
  {
    id: 'post-quiet-rooms',
    title: 'On Keeping a Quiet Notebook in an Age of Perpetual Drafts',
    subtitle: 'Why unhurried margins, paper friction, and deliberate revision still produce clearer thought than instant feeds.',
    category: 'Essays',
    coverImage: '/src/assets/images/hero_editorial_desk_1795001124075.jpg',
    coverCaption: 'Fig. 1 — Morning shadows across a linen-bound journal and brass pen.',
    authorName: 'Clara Vance',
    authorEmail: 'clara.vance@folio.press',
    status: 'published',
    createdAt: '2026-11-10T08:30:00.000Z',
    updatedAt: '2026-11-10T09:15:00.000Z',
    publishedAt: '2026-11-10T09:15:00.000Z',
    views: 1420,
    applause: 94,
  content: `Every serious writer eventually discovers that speed is rarely the bottleneck of good prose. More often, the true scarcity is an uninterrupted hour in which a sentence can sit on the page long enough to reveal its flaws.

When we compose exclusively inside streams built for immediate reaction, our paragraphs begin to mirror the rhythm of conversation rather than deliberation. We trade structural patience for punchy openings and tidy endings.

> Clarity is seldom a gift of the first impulse; it arrives during the third pass, after the ornamental phrases have been crossed out.

### The discipline of slow revision

Consider the physical resistance of ink on cotton paper. Because you cannot erase a paragraph with a single keystroke, you think half a beat longer before committing a clause. That slight pause changes the architecture of an argument.

- **Separate drafting from editing.** Let the first pass stay messy and honest, then return a day later as an unsentimental reader.
- **Read aloud for cadence.** The ear catches bloated transitions and monotone sentence lengths faster than the eye ever will.
- **Trim the throat-clearing.** Most essays truly begin in their third paragraph.

### Returning to a shared reading table

Digital publishing does not have to imitate a ticker tape. A clean page, generous margins, and typography proportioned for human eyes restore a measure of permanence to independent writing. What survives in memory is almost never what arrived fastest—it is what was built to endure a second reading.`
  },
  {
    id: 'post-architecture-of-daylight',
    title: 'The Architecture of Daylight: Designing Rooms That Measure Time',
    subtitle: 'How concrete galleries and deep window reveals turn shifting afternoon sun into a quiet structural material.',
    category: 'Architecture',
    coverImage: '/src/assets/images/story_architecture_light_1795001124453.jpg',
    coverCaption: 'Fig. 2 — Diagonal afternoon light traversing travertine stone.',
    authorName: 'Julian Mercer',
    authorEmail: 'julian.mercer@folio.press',
    status: 'published',
    createdAt: '2026-11-08T14:20:00.000Z',
    updatedAt: '2026-11-08T16:00:00.000Z',
    publishedAt: '2026-11-08T16:00:00.000Z',
    views: 1185,
    applause: 76,
    content: `Before artificial illumination flattened every room into uniform brightness, architects worked with an instrument that changed hour by hour: the angle of the sun.

Walk through an unadorned concrete gallery at three in the afternoon and the room feels alive without a single moving part. A sharp blade of light slides across the travertine floor, grazes the edge of a plinth, and softens into cool shadow along the opposite wall.

> Light does not merely reveal form; when framed with restraint, it becomes the primary proportion of the room.

### Three lessons from quiet civic spaces

1. **Deep reveals soften glare.** Thick masonry walls act as natural baffles, turning harsh midday sun into a gradual gradient across plaster and stone.
2. **Matte surfaces hold shadow.** High-gloss finishes reflect clutter; honed limestone and board-formed concrete absorb light quietly.
3. **Orientation is an editorial choice.** Facing a reading room north gives steady, shadowless clarity, while an east window marks the morning ritual.

| Time of Day | Solar Angle | Spatial Character |
| :--- | :--- | :--- |
| 08:00 AM | Low East | Long crisp shadows, warm brass tones |
| 12:30 PM | Overhead | Clerestory wash, even wall luminance |
| 04:15 PM | Low West | Deep diagonal relief across stone |

Good rooms, like good essays, leave enough open space for the reader's attention to breathe.`
  },
  {
    id: 'post-mechanical-precision',
    title: 'Notes on Mechanical Precision and Tactile Tools',
    subtitle: 'What seventy-year-old typewriters and hand-ground nibs teach us about software interfaces that stay out of the way.',
    category: 'Craft',
    coverImage: '/src/assets/images/story_analog_craft_1795001125448.jpg',
    coverCaption: 'Fig. 3 — Mechanical escapement and rag paper on walnut.',
    authorName: 'Elena Rostova',
    authorEmail: 'elena.rostova@folio.press',
    status: 'published',
    createdAt: '2026-11-05T11:00:00.000Z',
    updatedAt: '2026-11-05T12:10:00.000Z',
    publishedAt: '2026-11-05T12:10:00.000Z',
    views: 964,
    applause: 68,
    content: `A well-tuned mechanical typewriter has no notification drawer, no sidebar begging for attention, and no ambiguous toggle. Every lever corresponds to one physical outcome.

When you press a key, a typebar swings upward, strikes an inked ribbon against cotton rag paper, and advances the carriage by a single crisp notch. The feedback loop is instantaneous and unmistakable.

### Designing software with analog honesty

Modern writing tools often confuse capability with clutter. Yet the tools writers return to decade after decade share three traits:

- **Direct manipulation:** What you adjust is immediately visible on the page.
- **Predictable state:** You always know whether a document is saved as a draft or published to readers.
- **Zero visual noise:** Controls recede the moment composition begins.

~~~markdown
# A minimal writing cadence
1. Open a blank sheet.
2. Draft without formatting distractions.
3. Preview the typography before publishing.
~~~

Whether carved in brass or rendered in clean CSS, craft is measured by how gracefully a tool disappears once your work is underway.`
  },
  {
    id: 'post-botanical-indexing',
    title: 'Herbarium Margins: The Forgotten Art of Patient Observation',
    subtitle: 'Inside nineteenth-century botanical archives where pressed leaves and handwritten field notes outlasted empires.',
    category: 'Culture',
    coverImage: '/src/assets/images/story_botanical_archive_1795001125852.jpg',
    coverCaption: 'Fig. 4 — Mounted flora specimens cataloged with ink field notes.',
    authorName: 'Marcus Chen',
    authorEmail: 'marcus.chen@folio.press',
    status: 'published',
    createdAt: '2026-11-02T09:40:00.000Z',
    updatedAt: '2026-11-02T10:30:00.000Z',
    publishedAt: '2026-11-02T10:30:00.000Z',
    views: 812,
    applause: 54,
    content: `Open an archival herbarium cabinet and you are greeted by sheets of heavy rag paper, each holding a single pressed plant alongside neat copperplate ink noting altitude, soil, and date of collection.

Nothing about these specimens was hurried. A collector walked a hillside, recorded the weather in a pocket notebook, pressed the stem between blotting sheets for weeks, and only then mounted it for future scholars.

> To name a specimen carefully is to promise the future that someone paid attention here.

### Why field notes still matter

Our digital archives are vast, yet remarkably fragile. Links rot and platforms vanish, while disciplined personal catalogs—plain text, Markdown, structured dates, clear attributions—remain legible across generations of hardware.

Keeping an orderly index of what you observe is not nostalgia; it is intellectual stewardship.`
  },
  {
    id: 'post-short-letters',
    title: 'In Praise of the Three-Minute Essay',
    subtitle: 'Brevity is not a compromise when an idea has a sharp edge and nowhere to hide.',
    category: 'Notes',
    authorName: 'Clara Vance',
    authorEmail: 'clara.vance@folio.press',
    status: 'published',
    createdAt: '2026-10-28T17:15:00.000Z',
    updatedAt: '2026-10-28T17:45:00.000Z',
    publishedAt: '2026-10-28T17:45:00.000Z',
    views: 645,
    applause: 49,
    content: `Not every observation needs three thousand words to earn its keep. Some of the sharpest essays in literary history read like an extended letter written over morning coffee.

When you commit to five hundred well-chosen words, every paragraph has to carry its own weight. There is no room for filler anecdotes or repetitive summaries.

### A checklist for short dispatches

- Start with a concrete image or observation.
- Make one clear turn in the middle.
- Stop the moment the point lands.

Short essays respect the reader's morning—and often linger far longer than sprawling treatises.`
  }
];
