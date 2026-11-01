# AI MYSTERY ROOM
## Product Requirements & Technical Specification
**Document type:** Spec-Driven Development Master Specification  
**Version:** 1.0.0  
**Status:** Approved baseline for implementation  
**Project:** AI Mystery Room  
**Architecture:** MERN Stack  
**AI Provider:** Google Gemini  
**Primary implementation agent:** OpenAI Codex

---

# 1. PRODUCT OVERVIEW

## 1.1 Product Vision

AI Mystery Room is an interactive, AI-powered mystery investigation website where users become detectives and solve fictional crimes using AI-generated evidence.

Users provide a short scenario, story idea, or mystery premise. The backend uses Google Gemini to transform that input into a complete fictional investigation.

The AI creates:
- A fictional crime or mysterious incident.
- A list of suspects.
- A predetermined culprit.
- Character backgrounds and motives.
- An investigation timeline.
- Evidence such as WhatsApp conversations, photographs, CCTV records, documents, and witness statements.
- A logical explanation connecting the evidence to the culprit.

The user investigates the case, examines the available evidence, identifies inconsistencies, and finally selects the person they believe is responsible.

The system then evaluates the accusation and reveals the actual solution with an explanation.

## 1.2 Core Product Objective

Build an immersive detective experience that combines:
1. AI-generated storytelling.
2. Interactive evidence investigation.
3. Logical reasoning and deduction.
4. AI-generated visual assets.
5. A final culprit-selection mechanism.

The application should feel like an actual investigation interface rather than a conventional chatbot.

## 1.3 Core User Journey

**Scenario → AI Case Generation → Investigation Room → Evidence Analysis → Culprit Selection → Verdict → Case Resolution**

## 1.4 Product Principles

- Every mystery must have exactly one actual culprit.
- All evidence must belong to the same fictional universe.
- Evidence must be logically consistent with the predetermined solution.
- The culprit must not be revealed before the user submits an accusation.
- Users must be able to investigate at their own pace.
- The application must not depend on the frontend to determine the correct answer.
- AI output must be validated before it becomes playable.
- The investigation must remain interesting without requiring the user to interact with an AI chatbot.

---

# 2. TARGET USERS

## Primary Users
- People interested in detective stories.
- Mystery and crime-fiction enthusiasts.
- Casual gamers.
- People who enjoy puzzles and logical reasoning.
- Users interested in interactive AI experiences.

## User Expectations
- Interesting and believable mysteries.
- Multiple suspects with believable motives.
- Evidence that requires actual thinking.
- A clear investigation interface.
- A satisfying final reveal.
- Reasonably fast case generation.

---

# 3. MVP FEATURE SCOPE

## 3.1 Features Included in MVP

| Feature | Description | Priority |
|---|---|---|
| Landing page | Introduces the game | P0 |
| Scenario input | User describes a mystery premise | P0 |
| Difficulty selection | Easy, Medium, Hard | P0 |
| Case generation | Gemini generates the investigation | P0 |
| Suspect profiles | Displays suspects and backgrounds | P0 |
| Investigation dashboard | Central investigation workspace | P0 |
| Evidence management | Displays all generated evidence | P0 |
| WhatsApp evidence | Fictional chat conversations | P0 |
| Image evidence | AI-generated investigation photographs | P0 |
| CCTV evidence | CCTV-style records and visual evidence | P0 |
| Document evidence | Reports, notes, receipts, etc. | P1 |
| Culprit selection | User submits an accusation | P0 |
| Verdict | Evaluates the user's answer | P0 |
| Solution reveal | Explains the complete mystery | P0 |
| Case history | Lists previously generated cases | P1 |
| Responsive design | Supports mobile and desktop | P0 |

## 3.2 Features Excluded from MVP

Do not implement these unless explicitly requested in a later specification:

- Multiplayer investigations.
- Live multiplayer rooms.
- User-to-user messaging.
- Subscription and payment systems.
- Public case marketplace.
- User-created case publishing.
- Global leaderboards.
- Social media integrations.
- Voice-controlled investigations.
- Real-world police database integrations.
- Real-time AI detective chat.
- User-uploaded image analysis.

The architecture should not prevent future implementation of these features.

---

# 4. USER EXPERIENCE AND APPLICATION FLOW

## 4.1 Landing Page

Purpose: Introduce the product and encourage users to start an investigation.

### Required elements

1. Navigation bar.
   - Logo: AI Mystery Room.
   - Home.
   - How It Works.
   - My Cases (only when authenticated).
   - Login / Sign Up (if authentication is enabled).

2. Hero section.
   - Main heading: "Every Mystery Has a Truth. Can You Find It?"
   - Supporting description.
   - Primary CTA: "Start Investigating".
   - Atmospheric mystery-themed visual.

3. How It Works section.
   - Create a mystery.
   - Examine the evidence.
   - Identify the culprit.

4. Features section.
   - AI-generated mysteries.
   - Interactive evidence.
   - Multiple suspects.
   - Different difficulty levels.

5. Footer.
   - About.
   - Privacy.
   - Terms.
   - Copyright.

### Behaviour

Clicking Start Investigating navigates to the case creation page.

---

## 4.2 Case Creation Page

Purpose: Collect the user's mystery premise and preferences.

### Inputs

**A. Mystery Scenario**

Required multiline text input.

Placeholder:
"Describe your mystery. Example: A businessman is found dead in his locked office during a company party. Four employees had access to the building, and everyone has something to hide."

Validation:
- Minimum 30 characters.
- Maximum 1,000 characters.
- Must not be empty.
- Trim whitespace.
- Reject prompts requesting real-world harm instructions or targeting real people.

**B. Difficulty**

Three options:

| Difficulty | Expected complexity |
|---|---|
| Easy | 3 suspects, 5–7 evidence items, direct clues |
| Medium | 4 suspects, 8–10 evidence items, indirect clues |
| Hard | 5 suspects, 11–14 evidence items, misleading clues and interconnected timelines |

**C. Mystery Category**

Options:
- Murder Mystery.
- Theft.
- Missing Person.
- Corporate Espionage.
- Blackmail.
- General Mystery.

Default: General Mystery.

The AI must respect the category and premise where possible.

### Primary Action

Button: "Generate Mystery"

On click:
1. Validate inputs.
2. Disable repeated submissions.
3. Send the scenario and settings to the backend.
4. Create a case generation job.
5. Show a loading experience.
6. Redirect to the investigation room after successful generation.

### Loading Experience

Display meaningful stages:

- Creating your mystery...
- Building suspect profiles...
- Developing the investigation timeline...
- Generating evidence...
- Checking the clues...
- Preparing your investigation room...

These are interface progress indicators, not claims that each stage has completed. Update them based on actual backend job progress where possible.

If generation fails, display an error and allow retry without creating duplicate cases.

---

## 4.3 Investigation Room

This is the main gameplay interface.

The investigation room must feel like a detective's workspace.

### Layout

**Desktop layout:**

- Left sidebar: Case navigation.
- Main area: Evidence and investigation workspace.
- Right panel: Suspect profiles and case information.

**Mobile layout:**

- Collapsible navigation.
- Stacked content.
- Evidence displayed in cards.
- Suspect panel accessible through a tab or drawer.

### Header

Display:
- Case title.
- Case ID.
- Difficulty.
- Case status.
- Investigation progress.

### Investigation Tabs

1. Case Overview.
2. Suspects.
3. Evidence.
4. Timeline.
5. Final Accusation.

### Case Overview

Display:
- Incident description.
- Victim information, if applicable.
- Incident location.
- Incident date and time.
- Initial investigation report.
- Important case details.

Do not expose the actual culprit or hidden solution.

### Suspect Profiles

Each suspect should contain:

- Unique suspect ID.
- Full name.
- Age.
- Occupation.
- Relationship to the incident or victim.
- Background.
- Possible motive.
- Claimed alibi.
- Photograph or avatar.
- Relevant known information.

Suspect motives and alibis should be available to users, but the actual culprit field must never be exposed.

Each suspect should have a distinct personality and believable background.

---

# 5. EVIDENCE SYSTEM

The evidence system is the most important gameplay component.

Every evidence item must contribute to the investigation.

## 5.1 Evidence Categories

### A. WhatsApp Conversations

Display fictional WhatsApp-style conversations.

Each conversation should include:
- Sender.
- Receiver or group participants.
- Message content.
- Timestamp.
- Message status where relevant.
- Conversation title.
- Related suspect.
- Evidence description.

UI requirements:
- Chat bubble interface.
- Different bubble alignment for different participants.
- Realistic timestamps.
- Scrollable conversations.
- Clear participant identities.

The chat must be fictional and must not impersonate real accounts.

### B. Image Evidence

Examples:
- Crime scene photographs.
- Objects found at the location.
- Suspicious items.
- Photographs from the incident.
- Damaged property.
- Photographs containing visual clues.

Each image must contain:
- Evidence ID.
- Image URL.
- Evidence title.
- Description.
- Capture time, if known.
- Location, if known.
- Related suspects.
- Clue significance stored privately.

Images should be generated using Gemini image-generation capabilities where supported.

Do not ask the image model to independently invent investigation facts. Supply a controlled visual description derived from the approved case data.

### C. CCTV Evidence

CCTV evidence should include:
- Camera ID.
- Camera location.
- Recording date.
- Recording time.
- Relevant time interval.
- Visual description.
- Observed individuals.
- Important observations.
- Related suspects.

**MVP implementation:**

Support CCTV-style still images, multiple sequential frames, and written recording logs.

Actual generated video is optional and must not block the MVP.

If a video-generation model is available and configured, it can be added through a separate media-generation adapter.

Do not represent a static image as an actual video recording.

### D. Documents and Reports

Examples:
- Police investigation report.
- Medical report.
- Handwritten notes.
- Receipts.
- Entry logs.
- Emails.
- Access records.
- Witness statements.

Display documents in a readable document viewer.

## 5.2 Evidence Interaction

Users must be able to:
- Open an evidence item.
- View its complete details.
- Zoom into images.
- Read complete conversations.
- Inspect timestamps.
- Return to the evidence collection.
- Filter evidence by category.
- Search evidence by title or description.

Each evidence card should display:
- Evidence type.
- Title.
- Short description.
- Associated date/time.
- View Evidence action.

## 5.3 Evidence Classification

Internally classify each clue as:

- **Critical:** Necessary to establish the correct solution.
- **Supporting:** Strengthens an existing deduction.
- **Red Herring:** Plausible but ultimately non-decisive or misleading.
- **Neutral:** Provides context without directly determining guilt.

The classification must never be displayed to the player.

## 5.4 Evidence Consistency Rules

Every case must satisfy:

1. All timestamps must use a consistent case timezone.
2. Suspect identities must remain consistent across all evidence.
3. A suspect cannot be in two places at the same time unless the story explicitly explains it.
4. Evidence must not contradict the predetermined culprit.
5. At least two independent clues must support the correct culprit.
6. Red herrings must have a logical explanation.
7. Evidence must not directly disclose the culprit in its title or description.
8. The final solution must explain all critical evidence.
9. Evidence IDs must be unique within a case.
10. Evidence must be linked to valid suspect IDs.

---

# 6. FINAL ACCUSATION AND VERDICT

## 6.1 Accusation Interface

Display all available suspects.

Each suspect should have:
- Profile image.
- Name.
- Short description.
- Select option.

User must select exactly one suspect.

### Optional Reasoning

Provide an optional text field:

"Why do you think this person is responsible?"

Maximum: 1,000 characters.

### Submit Action

Button: "Submit Final Accusation"

Before submission, show a confirmation dialog:

"Are you sure? Your investigation will be submitted."

Once submitted:
- Save the accusation.
- Prevent duplicate submissions.
- Compare the selected suspect against the stored actual culprit.
- Change the case status to completed.
- Reveal the result.

## 6.2 Verdict Page

Two possible outcomes.

### Correct Accusation

Display:
- Success animation.
- "Case Solved!"
- Selected culprit.
- Actual motive.
- How the crime was committed.
- Critical evidence.
- Explanation of the timeline.
- Explanation of red herrings.

### Incorrect Accusation

Display:
- "Investigation Incomplete."
- The selected suspect.
- Actual culprit.
- Why the accusation was incorrect.
- Important missed clues.
- Complete solution.

Do not simply display Correct or Incorrect. Provide an educational explanation.

## 6.3 Solution Reveal

The solution must be generated and stored during case creation, not generated from scratch after the user makes an accusation.

The verdict should use the stored solution.

This prevents the AI from changing the culprit or inventing new explanations during evaluation.

---

# 7. AI AND GEMINI INTEGRATION

## 7.1 AI Responsibilities

Gemini is responsible for:

1. Understanding the user's scenario.
2. Developing the fictional investigation.
3. Creating suspects.
4. Selecting exactly one culprit.
5. Creating a coherent motive.
6. Developing a chronological timeline.
7. Creating evidence.
8. Creating clues and red herrings.
9. Writing the final solution.
10. Generating visual evidence through supported image-generation capabilities.

The backend, not the frontend, controls the actual solution.

## 7.2 AI Generation Architecture

Use a staged generation pipeline.

**Stage 1: Case Blueprint**

Generate a complete structured mystery blueprint containing:

- Case metadata.
- Crime description.
- Victim information.
- Suspect profiles.
- Actual culprit ID.
- Motive.
- Method.
- Timeline.
- Investigation facts.
- Expected evidence.
- Solution explanation.

**Stage 2: Evidence Generation**

Generate evidence using the approved blueprint.

Each evidence item must be derived from the existing case facts.

**Stage 3: Consistency Validation**

Validate:
- Correct culprit exists.
- All suspect IDs are valid.
- Evidence references existing suspects.
- Timeline is logically possible.
- Critical clues support the culprit.
- Solution explains the evidence.
- Evidence does not accidentally reveal the answer.

**Stage 4: Visual Generation**

Generate required images using the approved evidence descriptions.

Use stable visual descriptions for recurring characters and locations.

**Stage 5: Final Case Assembly**

Combine the validated blueprint, textual evidence, and generated media.

Store the complete case in MongoDB only after it passes validation.

If image generation fails, the case may still be playable with textual evidence and clearly identified media-generation fallbacks.

## 7.3 Structured AI Output

Gemini must return structured JSON for the case blueprint and evidence.

Use JSON Schema or Zod validation on the backend.

Never directly trust raw AI output.

Required behaviour:
- Parse JSON.
- Validate the schema.
- Validate semantic consistency.
- Retry invalid generations with a bounded retry count.
- Fail gracefully if validation continues to fail.
- Log AI errors without exposing internal prompts or secrets.

## 7.4 AI Model Configuration

Do not hardcode model names throughout the application.

Use environment variables:

```env
GEMINI_API_KEY=
GEMINI_TEXT_MODEL=
GEMINI_IMAGE_MODEL=
GEMINI_VIDEO_MODEL=
```

Model names must be configurable independently.

Use the official Google Gen AI JavaScript SDK.

Use text-generation and image-generation capabilities separately where necessary.

The application must continue to work in text-only mode if image generation is unavailable.

Video generation is an optional future integration.

## 7.5 AI Prompt Requirements

The system prompt must instruct Gemini to:

- Generate fictional events only.
- Follow the user-provided premise.
- Produce exactly one culprit.
- Create believable suspects.
- Create a coherent chronological timeline.
- Ensure the evidence supports the actual culprit.
- Avoid impossible events.
- Create realistic but fictional messages and documents.
- Avoid directly revealing the culprit through public-facing evidence.
- Ensure red herrings have logical explanations.
- Return output conforming to the supplied schema.
- Keep the mystery solvable using the available evidence.

## 7.6 Secret Information Separation

The backend must distinguish between:

**Public case data**
- Case overview.
- Suspect profiles.
- Evidence.
- Timeline.
- Public investigation details.

**Private solution data**
- Actual culprit ID.
- Actual motive.
- Crime method.
- Hidden clue interpretation.
- Correct solution.
- Validation metadata.

Never send private solution data to frontend API responses before accusation submission.

Do not rely on CSS hiding, frontend conditions, or hidden HTML elements for security.

---

# 8. TECHNICAL ARCHITECTURE

## 8.1 Technology Stack

### Frontend

| Technology | Responsibility |
|---|---|
| React.js | UI development |
| Vite | Frontend build tool |
| React Router | Navigation |
| Axios | API communication |
| Bootstrap | Responsive layout |
| Plain CSS | Custom styling |
| Context API | Shared application state |

Do not use Tailwind CSS.

Use reusable React components.

### Backend

| Technology | Responsibility |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| Mongoose | MongoDB ODM |
| Google Gen AI SDK | Gemini integration |
| Zod | Data validation |
| JWT | Authentication, if enabled |
| bcrypt | Password hashing, if authentication is enabled |
| Multer | File handling only where required |

### Database

MongoDB Atlas is the preferred database deployment.

Use Mongoose schemas and references where appropriate.

### Media Storage

Use Cloudinary or an equivalent object-storage provider for generated images and media.

Do not store large base64 image strings directly in MongoDB.

Store media URLs and relevant metadata in the database.

### Deployment

- Frontend: Vercel or equivalent.
- Backend: Render, Railway, or equivalent.
- Database: MongoDB Atlas.
- Media: Cloudinary.

Deployment configuration must remain separate from application logic.

---

# 9. SYSTEM ARCHITECTURE

```text
                    USER
                      |
                      v
             REACT FRONTEND
                      |
                 Axios API
                      |
                      v
             EXPRESS BACKEND
                      |
           ---------------------
           |         |         |
           v         v         v
        AUTH      CASE       AI SERVICE
       SERVICE   SERVICE        |
           |         |          v
           |         |       GEMINI
           |         |          |
           |         |    -------------
           |         |    |     |     |
           |         |  Text  Image  Video
           |         |    |     |     |
           |         |    -------------
           |         |          |
           |         |          v
           |         |     MEDIA STORAGE
           |         |          |
           --------- | ----------
                     |
                     v
                  MONGODB
```

The AI service must be isolated from route controllers.

Business logic must not be placed directly inside Express route files.

---

# 10. DATABASE DESIGN

Use the following collections.

## 10.1 Users

Collection: `users`

```json
{
  "_id": "ObjectId",
  "username": "detective123",
  "email": "user@example.com",
  "passwordHash": "hashed_password",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Authentication is optional for the first playable version. If enabled, implement it completely rather than creating placeholder authentication.

## 10.2 Cases

Collection: `cases`

```json
{
  "_id": "ObjectId",
  "caseCode": "MR-2026-0001",
  "userId": "ObjectId",
  "title": "The Midnight Incident",
  "scenario": "Original user scenario",
  "category": "murder",
  "difficulty": "medium",
  "status": "ready",
  "generationStatus": "completed",
  "publicData": {
    "description": "Public case description",
    "victim": {},
    "location": "Pune",
    "incidentDate": "Date"
  },
  "privateSolution": {
    "culpritSuspectId": "SUS-002",
    "motive": "Hidden motive",
    "method": "Hidden method",
    "explanation": "Complete solution"
  },
  "timeline": [],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

The example is illustrative. Use actual MongoDB ObjectIds and proper schema types.

## 10.3 Suspects

Collection: `suspects`

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "suspectId": "SUS-001",
  "name": "Alex Morgan",
  "age": 32,
  "occupation": "Manager",
  "relationship": "Business partner",
  "background": "Public background",
  "motive": "Possible motive",
  "alibi": "Claimed alibi",
  "imageUrl": "https://...",
  "isCulprit": false
}
```

Important: `isCulprit` must never be included in public API responses.

## 10.4 Evidence

Collection: `evidence`

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "evidenceId": "EVD-001",
  "type": "whatsapp",
  "title": "Suspicious Conversation",
  "description": "Public evidence description",
  "content": {},
  "mediaUrl": null,
  "timestamp": "Date",
  "relatedSuspectIds": ["SUS-001"],
  "isCritical": true,
  "clueExplanation": "Private clue explanation",
  "createdAt": "Date"
}
```

Supported evidence types:

- `whatsapp`
- `image`
- `cctv`
- `document`
- `witness_statement`
- `report`

`isCritical` and `clueExplanation` are private fields and must not be exposed to the frontend.

Use a flexible validated `content` structure depending on evidence type.

## 10.5 Accusations

Collection: `accusations`

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "userId": "ObjectId",
  "selectedSuspectId": "SUS-002",
  "reasoning": "The evidence suggests...",
  "isCorrect": true,
  "submittedAt": "Date"
}
```

One final accusation per case per user in the MVP.

## 10.6 Case Generation Jobs

Collection: `generationjobs`

```json
{
  "_id": "ObjectId",
  "caseId": "ObjectId",
  "status": "processing",
  "currentStage": "generating_evidence",
  "progress": 50,
  "error": null,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

Valid job statuses:
- `queued`
- `processing`
- `completed`
- `failed`

Progress should reflect actual backend stages and must not be fabricated.

---

# 11. API SPECIFICATION

Base URL:

`/api/v1`

All API responses should follow a consistent structure.

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Failure:

```json
{
  "success": false,
  "message": "Something went wrong",
  "error": {
    "code": "ERROR_CODE"
  }
}
```

## 11.1 Case APIs

### POST `/cases`

Create a case generation job.

Request:

```json
{
  "scenario": "A businessman is found dead...",
  "difficulty": "medium",
  "category": "murder"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "caseId": "CASE_ID",
    "jobId": "JOB_ID",
    "status": "queued"
  }
}
```

### GET `/cases`

Return the authenticated user's case history.

### GET `/cases/:caseId`

Return the public case information.

Never expose the actual culprit or private solution.

### GET `/cases/:caseId/status`

Return case-generation status and current stage.

### GET `/cases/:caseId/suspects`

Return public suspect profiles only.

### GET `/cases/:caseId/evidence`

Return available public evidence.

Support optional filters:

`?type=whatsapp`

`?type=image`

`?search=conversation`

### GET `/cases/:caseId/timeline`

Return the public investigation timeline.

## 11.2 Accusation APIs

### POST `/cases/:caseId/accusation`

Request:

```json
{
  "selectedSuspectId": "SUS-002",
  "reasoning": "The CCTV timestamp contradicts the alibi."
}
```

Backend must:
1. Verify the case exists.
2. Verify the case is ready.
3. Verify the selected suspect belongs to the case.
4. Check whether the user has already submitted an accusation.
5. Compare the selected suspect against the private solution.
6. Save the accusation.
7. Mark the case as completed.
8. Return the verdict and solution.

### GET `/cases/:caseId/result`

Return the verdict for an already completed case.

Do not allow users to retrieve the solution before submission.

## 11.3 API Security

- Validate all request bodies.
- Validate MongoDB ObjectIds.
- Protect private case information.
- Add rate limiting to generation endpoints.
- Prevent users from accessing another user's private cases.
- Sanitize user inputs.
- Use centralized error handling.
- Keep API keys in environment variables.
- Never expose Gemini API credentials to React.
- Do not allow duplicate generation requests for the same active job.

---

# 12. FRONTEND DESIGN SYSTEM

## 12.1 Design Direction

Theme: Modern Detective Investigation Room.

The application should feel cinematic, mysterious, immersive, and premium.

Avoid a generic SaaS dashboard appearance.

## 12.2 Visual Style

Recommended design:
- Dark charcoal background.
- Deep navy surfaces.
- Muted grey text.
- Warm amber highlights.
- Red accents for warnings.
- Subtle gradients.
- Soft shadows.
- Thin borders.
- Restrained glow effects.

Suggested color palette:

| Token | Value |
|---|---|
| Background | `#0B0E13` |
| Surface | `#141A23` |
| Secondary Surface | `#1C2430` |
| Primary Text | `#F1F3F5` |
| Secondary Text | `#A0A9B5` |
| Accent | `#D6A44B` |
| Danger | `#C94C4C` |
| Success | `#4DAB78` |
| Border | `#2B3442` |

## 12.3 Typography

Use:
- Inter or similar readable font for UI.
- A distinctive serif font for selected headings.
- Clear hierarchy between headings, descriptions, metadata, and evidence content.

## 12.4 Components

Create reusable components:

- Navbar
- Footer
- Button
- Input
- Textarea
- DifficultySelector
- CategorySelector
- CaseCard
- SuspectCard
- EvidenceCard
- WhatsAppChat
- ImageViewer
- CCTVViewer
- DocumentViewer
- Timeline
- ProgressIndicator
- LoadingScreen
- ConfirmationModal
- VerdictCard
- ErrorState
- EmptyState

## 12.5 UI Behaviour

- All buttons must perform actual actions.
- Show loading states during API requests.
- Disable repeated submissions.
- Show validation messages near relevant inputs.
- Use toast notifications for temporary feedback.
- Provide empty states when no cases or evidence exist.
- Provide fallback UI for failed image loading.
- Maintain consistent spacing and component styling.
- Ensure keyboard navigation and readable contrast.

---

# 13. PROJECT STRUCTURE

Use a clean monorepo-style structure.

```text
ai-mystery-room/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── evidence/
│       │   ├── suspects/
│       │   └── investigation/
│       ├── pages/
│       │   ├── Home/
│       │   ├── CreateCase/
│       │   ├── Investigation/
│       │   ├── Verdict/
│       │   ├── MyCases/
│       │   └── Auth/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       ├── utils/
│       ├── styles/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   ├── case/
│   │   │   ├── evidence/
│   │   │   └── media/
│   │   ├── validators/
│   │   ├── utils/
│   │   ├── prompts/
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── docs/
│   ├── SPEC.md
│   ├── ARCHITECTURE.md
│   └── API.md
│
├── .gitignore
├── README.md
└── package.json
```

The exact structure may be adjusted when justified, but separation of frontend, backend, AI services, database models, and validation is mandatory.

---

# 14. NON-FUNCTIONAL REQUIREMENTS

## Performance

- Initial frontend load should be optimized.
- Avoid unnecessarily large image assets.
- Use lazy loading for evidence images.
- Paginate case history when necessary.
- Do not block the server while waiting for long media-generation tasks.
- Use asynchronous case-generation jobs.
- Set request timeouts and bounded AI retries.

## Reliability

- A failed generation must not produce a playable incomplete case.
- Failed image generation should not destroy an otherwise valid case.
- Cases must persist after page refresh.
- Users should be able to reopen an investigation.
- Accusations must be stored reliably.
- Prevent duplicate accusations.

## Security

- Environment variables for all secrets.
- Backend-only Gemini API access.
- Authentication and ownership checks where accounts are enabled.
- Rate limiting.
- Input validation.
- Secure password hashing.
- Safe error responses.
- No private solution data in public responses.

## Accessibility

- Responsive design.
- Keyboard navigation.
- Accessible labels.
- Appropriate contrast.
- Alternative text for images.
- Clear error messages.

## Maintainability

- Modular code.
- Reusable components.
- Centralized API handling.
- Centralized error handling.
- Consistent naming conventions.
- No duplicated business logic.
- Document important architectural decisions.

---

# 15. ERROR HANDLING

The application must handle these situations:

| Scenario | Expected behaviour |
|---|---|
| Empty scenario | Show validation error |
| Invalid difficulty | Reject request |
| Invalid category | Reject request |
| Gemini unavailable | Mark job failed and show retry |
| Invalid AI JSON | Retry generation within configured limit |
| Inconsistent mystery | Regenerate or fail safely |
| Image generation failure | Use textual fallback |
| Storage upload failure | Retry or omit optional media |
| Database unavailable | Return service error |
| Invalid case ID | Return 404 |
| Unauthorized case access | Return 401/403 |
| Evidence not found | Return 404 |
| Duplicate accusation | Reject duplicate |
| Repeated generation request | Prevent duplicate active job |

Never expose stack traces, private prompts, API keys, or database credentials to the frontend.

---

# 16. ENVIRONMENT VARIABLES

Backend `.env.example`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=

GEMINI_API_KEY=
GEMINI_TEXT_MODEL=
GEMINI_IMAGE_MODEL=
GEMINI_VIDEO_MODEL=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

Frontend `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Never commit actual `.env` files.

Only expose public configuration variables through Vite.

---

# 17. ACCEPTANCE CRITERIA

The MVP is considered complete only when all of the following work.

### Landing Page
- [ ] Website opens successfully.
- [ ] Navigation works.
- [ ] Start Investigating opens case creation.
- [ ] Layout works on mobile and desktop.

### Case Creation
- [ ] User can enter a scenario.
- [ ] User can select difficulty.
- [ ] User can select category.
- [ ] Invalid inputs are rejected.
- [ ] Case generation starts successfully.
- [ ] Loading progress reflects actual job status.

### AI Generation
- [ ] Gemini receives the user's scenario.
- [ ] A complete structured case is generated.
- [ ] Exactly one culprit is selected.
- [ ] Suspects are generated correctly.
- [ ] Evidence is generated from the same blueprint.
- [ ] Timeline is consistent.
- [ ] AI output passes backend validation.
- [ ] Private solution data is protected.

### Investigation
- [ ] Users can view the case overview.
- [ ] Users can inspect all suspects.
- [ ] Users can view evidence.
- [ ] WhatsApp conversations render correctly.
- [ ] Images open in a viewer.
- [ ] CCTV evidence is displayed correctly.
- [ ] Timeline is accessible.
- [ ] Evidence filtering works.
- [ ] Case data persists after refresh.

### Accusation
- [ ] User can select a suspect.
- [ ] User can optionally explain their reasoning.
- [ ] User can submit the accusation.
- [ ] Backend validates the selection.
- [ ] Duplicate submissions are blocked.
- [ ] Correct and incorrect answers produce different outcomes.
- [ ] Full solution is revealed after submission.

### Reliability
- [ ] API errors are handled.
- [ ] Generation failures are handled.
- [ ] Invalid cases are not published.
- [ ] No secrets are exposed.
- [ ] No private solution data is exposed before verdict.

---

# 18. DEVELOPMENT PHASES

Codex must implement the application incrementally.

## Phase 1 — Project Foundation

Tasks:
- Initialize MERN project.
- Configure Vite.
- Configure Express.
- Connect MongoDB.
- Set up environment variables.
- Configure API structure.
- Configure frontend routing.
- Establish design tokens.
- Create reusable components.

Deliverable: Running frontend and backend with successful database connection.

## Phase 2 — Frontend Foundation

Tasks:
- Build landing page.
- Build case creation page.
- Implement difficulty selection.
- Implement category selection.
- Create investigation dashboard layout.
- Create suspect cards.
- Create evidence cards.
- Create responsive navigation.

For initial UI development, use temporary mock data.

Deliverable: Complete navigable frontend.

## Phase 3 — Backend and Database

Tasks:
- Create Mongoose models.
- Implement case APIs.
- Implement evidence APIs.
- Implement suspect APIs.
- Implement generation job model.
- Add validation.
- Add error handling.
- Add ownership and access controls.

Deliverable: Functional backend using mock case data.

## Phase 4 — Gemini Integration

Tasks:
- Configure Google Gen AI SDK.
- Create case-generation service.
- Implement structured case blueprint generation.
- Implement evidence generation.
- Implement Zod validation.
- Implement consistency checks.
- Implement bounded retries.
- Store validated cases in MongoDB.

Deliverable: Dynamically generated mystery cases.

## Phase 5 — Media Generation

Tasks:
- Generate image evidence.
- Create suspect image assets.
- Configure media storage.
- Link generated assets to evidence records.
- Add image loading fallbacks.
- Add CCTV-style image and frame support.
- Keep actual video generation optional.

Deliverable: AI-generated visual investigation evidence.

## Phase 6 — Gameplay

Tasks:
- Connect frontend to case APIs.
- Load real suspects.
- Load real evidence.
- Implement evidence viewers.
- Implement timeline.
- Implement suspect selection.
- Implement final accusation.
- Implement verdict page.
- Implement solution reveal.

Deliverable: Fully playable investigation.

## Phase 7 — Testing and Refinement

Tasks:
- Test all API endpoints.
- Test AI generation.
- Test invalid AI responses.
- Test contradictory evidence detection.
- Test private-data protection.
- Test duplicate accusations.
- Test responsive UI.
- Test page refresh and persistence.
- Fix bugs.
- Optimize performance.

Deliverable: MVP ready for deployment.

## Phase 8 — Deployment

Tasks:
- Configure production environment variables.
- Deploy frontend.
- Deploy backend.
- Configure MongoDB Atlas.
- Configure media storage.
- Configure CORS.
- Test production APIs.
- Test complete user journey.

Deliverable: Publicly accessible working website.

---

# 19. CODEX IMPLEMENTATION RULES

These rules are mandatory.

## 19.1 Specification Authority

This document is the single source of truth.

Before implementing any feature:
1. Read the relevant section of `docs/SPEC.md`.
2. Understand the expected behaviour.
3. Identify the affected components and services.
4. Implement according to the specification.
5. Test the feature.
6. Update documentation if a specification change is explicitly approved.

Do not silently change product requirements.

## 19.2 Implementation Discipline

- Do not build the entire application in one massive code-generation step.
- Work phase by phase.
- Complete and test each phase before moving to the next.
- Do not leave placeholder buttons.
- Do not create non-functional UI.
- Do not hardcode generated case data into production components.
- Do not put Gemini calls inside frontend code.
- Do not mix AI prompts with Express controllers.
- Do not expose private solution fields.
- Do not create unnecessary abstractions.
- Do not introduce unnecessary dependencies.
- Do not use Tailwind CSS.
- Use JavaScript and JSX unless TypeScript is explicitly approved later.
- Keep the code readable and beginner-maintainable.

## 19.3 Git Workflow

Use Git throughout development.

After completing each phase:
1. Verify the application runs.
2. Run relevant tests.
3. Review changed files.
4. Fix errors.
5. Create a meaningful Git commit.

Suggested commits:

```text
chore: initialize MERN project
feat: build landing page
feat: implement case creation
feat: add investigation dashboard
feat: implement database models
feat: integrate Gemini case generation
feat: add evidence generation
feat: implement accusation and verdict
test: add application tests
chore: prepare production deployment
```

Do not push secrets, environment files, generated private credentials, or unnecessary build artifacts to GitHub.

## 19.4 Definition of Done

A feature is complete only when:
- Its functionality is implemented.
- Its UI is connected to the backend where applicable.
- Validation is implemented.
- Errors are handled.
- It works in the expected user journey.
- Relevant tests pass.
- Documentation is updated if needed.

A visually complete page is not considered a completed feature if its actions do not work.

---

# 20. FUTURE ROADMAP

These features are intentionally outside the MVP.

### Version 2
- Actual AI-generated CCTV videos.
- More sophisticated evidence viewers.
- Detective notes and bookmarking.
- Investigation scoring.
- Multiple endings and optional challenges.
- More mystery categories.

### Version 3
- User authentication and profiles if not implemented in MVP.
- Case history and statistics.
- Daily mystery challenges.
- Difficulty-based ranking.
- Shareable case results.

### Version 4
- Multiplayer investigations.
- Collaborative detective rooms.
- Live investigation sessions.
- Community-created mysteries.
- Premium case packs.

Future features must not compromise the stability of the MVP.

---

# 21. FINAL PRODUCT DEFINITION

AI Mystery Room is a MERN-based interactive mystery investigation platform powered by Google Gemini.

A user provides a mystery premise. The system creates a coherent fictional case with suspects, one predetermined culprit, a timeline, and multiple pieces of evidence.

The user investigates the case through an immersive detective interface, examines messages, images, CCTV-style records, and documents, and submits a final accusation.

The backend compares the accusation against the previously established solution and reveals the complete explanation.

**The central product requirement is not simply generating interesting stories. It is generating solvable, internally consistent investigations in which the evidence logically leads to one predetermined culprit.**

---

# END OF MASTER SPECIFICATION

**Version:** 1.0.0  
**Document authority:** Product and engineering baseline  
**Implementation status:** Not yet implemented  
**Change policy:** Changes to scope, architecture, data contracts, or gameplay must be explicitly approved and reflected in this document.