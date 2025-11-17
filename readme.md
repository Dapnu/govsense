

---

# **Software Requirements Specification (SRS)**

## **Project: GovSense – Constructive & Hate Speech Classifier**

---

## **1. Introduction**

### **1.1 Purpose**

**GovSense** is a web-based platform designed to detect whether a given **text** or **image** contains:

1. **Constructive content** directed toward government, or
2. **Hate speech** targeting government institutions or actors.

The system uses **Google Gemini API** for classification and produces clear, actionable outputs for public organizations, researchers, and moderation teams.

### **1.2 Scope**

The platform includes:

* A **backend API (FastAPI or Node.js)** that interfaces with the Gemini API.
* A **frontend client (React)** that allows users to upload text or images.
* A **classification and explanation engine** powered by Gemini.

Two operating modes:

* **Mode 1 — Text Classification:** Input is a sentence or paragraph.
* **Mode 2 — Image Classification:** Input is an uploaded image (.jpg/.png).

---

## **2. Overall Description**

### **2.1 Product Perspective**

GovSense is a standalone moderation and analysis platform consisting of:

* A **REST-based backend** for handling classification requests.
* A **frontend UI** that provides a clean interface for uploading or typing data.
* A direct integration with **Gemini 1.5 Flash** or **Gemini 1.0 Pro Vision** API models.

The system does not store user data unless explicitly allowed.

### **2.2 Product Functions**

1. Allow user to type a sentence or upload an image.
2. Send request to backend → backend forwards input to Gemini.
3. Display classification result:

   * **Constructive criticism**
   * **Neutral**
   * **Hate speech**
   * **Unrelated content**
4. Provide **model explanation** (Gemini rationale).
5. Allow downloading report as PDF (optional future feature).

### **2.3 Users**

* **Government agencies:** Monitor public feedback.
* **Researchers:** Analyze sentiment or discourse patterns.
* **Moderators:** Filter harmful or hateful content.

### **2.4 Operating Environment**

* **Backend:** FastAPI (Python 3.11+) or Node.js, Google Gemini API.
* **Frontend:** React + TailwindCSS.
* **Hosting:** Local or cloud deployment (Vercel, GCP, AWS).
* **Supported input formats:**

  * Text (UTF-8)
  * Images (.jpg, .png)

---

## **3. Functional Requirements**

### **3.1 Backend (Classification Engine)**

#### **FR-1. On Startup**

* Load environment variables (API keys, model names).
* Initialize Gemini client.
* Start REST API service.

#### **FR-2. API Endpoint: Text Classification**

**POST /classify_text**

**Request Body**

```json
{
  "text": "The government should improve public transportation efficiency."
}
```

**Processing Steps**

1. Validate text length (1–2000 characters).
2. Build structured prompt for Gemini:

   ```
   Classify the following text as:
   - constructive
   - neutral
   - hate_speech
   - unrelated
   Provide reasoning.
   ```
3. Send to Gemini API.
4. Parse classification + explanation.
5. Return JSON response.

**Response Example**

```json
{
  "classification": "constructive",
  "confidence": 0.92,
  "explanation": "The statement proposes improvements without insulting or threatening.",
  "raw_output": "...",
  "timestamp": "2025-03-10T14:22:00Z"
}
```

---

#### **FR-3. API Endpoint: Image Classification**

**POST /classify_image**

Uses multipart-form upload:

**Request**

```
file: (image file)
```

**Processing Steps**

1. Validate image format & size.
2. Send encoded image to Gemini Vision model.
3. Gemini determines:

   * Whether image contains text (OCR)
   * Whether it includes symbols, gestures, or visual cues of hate
   * Whether it contains constructive or political content
4. Backend normalizes output to defined categories.

**Response**

```json
{
  "classification": "hate_speech",
  "confidence": 0.87,
  "explanation": "Image contains slurs directed at government officials.",
  "timestamp": "2025-03-10T14:25:10Z"
}
```

---

### **3.2 Frontend (User Interface)**

#### **FR-4. Input Selection**

User can choose:

* **Text Mode:** Textarea for typing content.
* **Image Mode:** Drag-and-drop uploader.

#### **FR-5. Validation & Feedback**

* If no input → highlight field.
* If image > 5MB → show error.
* If text empty → prevent submission.

#### **FR-6. Classification Workflow**

1. User inputs text or uploads an image.
2. User clicks **"Analyze"**.
3. Frontend shows loading animation.
4. Backend returns classification.
5. Result panel displays:

   * Label (Constructive / Neutral / Hate Speech / Unrelated)
   * Confidence score
   * Model explanation
   * Highlights (for text: key phrases identified by AI)

#### **FR-7. UI States**

| User Action         | System Response                |
| ------------------- | ------------------------------ |
| Text/image uploaded | Preview displayed              |
| Click Analyze       | Loading spinner                |
| Success result      | Classification card appears    |
| API error           | Modal popup with error message |

#### **FR-8. Accessibility**

* Keyboard-navigable UI.
* Optional dark mode.
* Alt-description for images.

---

## **4. Non-Functional Requirements**

| Category            | Requirement                                       |
| ------------------- | ------------------------------------------------- |
| **Performance**     | Classification time < 3 seconds per request.      |
| **Scalability**     | API stateless; horizontal scaling supported.      |
| **Security**        | API keys stored in environment; use HTTPS.        |
| **Privacy**         | No input stored permanently by default.           |
| **Usability**       | User should complete analysis in ≤ 2 clicks.      |
| **Reliability**     | Handle errors gracefully; 99% API uptime target.  |
| **Maintainability** | Clear module separation (UI, API wrapper, logic). |
| **Compatibility**   | Works on Chrome, Firefox, Edge, Safari.           |

---

## **5. System Architecture**

```
 ┌────────────────────────────────────┐
 │           React Frontend           │
 │ ┌──────────────┐   ┌────────────┐ │
 │ │ Text Input   │   │ Image Upload│ │
 │ └──────────────┘   └────────────┘ │
 │            ▲  Analyze Button       │
 │            │                      │
 │            └──→ Axios POST /api → │
 └────────────────────────────────────┘
                │
                ▼
 ┌────────────────────────────────────┐
 │          Backend API Layer         │
 │  - Validate Inputs                 │
 │  - Forward to Gemini               │
 │  - Parse & Normalize Output        │
 │  - Respond JSON                    │
 └────────────────────────────────────┘
                │
                ▼
 ┌────────────────────────────────────┐
 │        Google Gemini API           │
 │  - Text Model (Flash/Pro)          │
 │  - Vision Model                    │
 │  - Returns analysis & explanation  │
 └────────────────────────────────────┘
```

---

## **6. Data Specification**

### **6.1 Stored Data (Temporary Only)**

| Field            | Description                         |
| ---------------- | ----------------------------------- |
| `classification` | Model-assigned category             |
| `confidence`     | Numerical confidence (0–1)          |
| `explanation`    | Short reasoning from AI             |
| `timestamp`      | Classification time                 |
| `raw_output`     | (Optional) Gemini original response |

No user text or images stored long-term unless explicitly enabled.

---

## **7. API Specification**

### **Endpoint List**

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | `/classify_text`  | Classify textual content |
| POST   | `/classify_image` | Classify image content   |

### **Error Responses**

```json
{
  "error": "Invalid image format",
  "code": 400
}
```

```json
{
  "error": "Gemini API unreachable",
  "code": 503
}
```

---

## **8. Frontend Workflow (Visual Flow)**

1. **Landing Page:**
   User chooses Text Mode or Image Mode.

2. **Input Stage:**
   User types text or uploads image.

3. **Validation:**
   System checks required inputs.

4. **Classification Request:**
   Send to backend → backend calls Gemini.

5. **Result Display:**
   UI shows classification card with confidence.

6. **User Actions:**

   * Analyze another input
   * Switch between modes
   * Download report (future option)

---

## **9. Future Development**

* Add batch-processing mode for large datasets.
* Add user accounts and moderation dashboards.
* Add analytics heatmaps of common hate speech patterns.
* Support multilingual classification.
* Train custom fine-tuned prefix prompts for higher accuracy.

---


