# 📖 Cantonese Worship PPT Automation

## 🎯 Overview

This project automates the weekly preparation of Cantonese worship PowerPoint slides.

It replicates the manual workflow typically performed by Cantonese PPT preparation co-workers, but streamlines it using:

- Google Apps Script (JavaScript-based automation)
- Gmail integration
- Google Sheets as a structured data layer
- AI-assisted parsing (DeepSeek API)

---

## 🔄 Workflow

The system consists of two main stages:

### 1️⃣ Data Extraction & Structuring

- Pulls worship-related information from Gmail
- Parses bulletin PDF and email content
- Stores structured data into a Google Sheet

### 2️⃣ Slide Generation

- Uses the structured data to generate Google Slides
- Slides are exported and converted into the final PowerPoint format

---

## 🧩 Step 1: Populate Worship Data

### 📥 Data Sources

The script retrieves information from two Gmail emails:

**Worship Info C**
- Sent by the church administration office
- Includes bulletin PDF attachment

**Cantonese Sunday Service Reminder**
- Contains invocation passages selected by the MC

---

### 🚀 Core Function: `populateWorshipTab()`

This is the main entry point of the automation pipeline.

#### 🔧 Responsibilities

- Displays a start notification
- Clears previous logs and sheet data
- Determines the upcoming Sunday
- Searches Gmail for required emails
- Extracts and parses:
  - Invocation passages
  - Scripture readings
  - Sermon title
  - Speaker name
  - Announcements
- Processes bulletin PDF attachments
- Writes structured data into the "worship" Google Sheet
- Retries automatically if required emails are missing
- Sends completion notification

---

## 🧠 Features

### 📬 Gmail Integration

- Uses `GmailApp.search()` to locate relevant emails
- Handles email threads and attachments
- Extracts both plain text and PDF content
- Scheduled to run automatically (typically Friday ~5:30 PM)

---

### 📊 Google Sheets Structuring

- Dynamically locates sections using markers:
  - `TITLE_INVOCATION`
  - `TITLE_SCRIPTURE_READING`
  - `TITLE_SERMON_TOPIC`
  - `TITLE_ANNOUNCEMENT`
- Clears old data before inserting new entries
- Inserts formatted and timestamped rows

---

### 📖 Scripture Processing

- Uses local Bible datasets (`cuvBible`, `nivBible`)
- No external API dependency
- Supports:
  - Multi-chapter passages
  - Multi-line scripture references
  - Split passage into slide-sized segments
  - Partial verse references (e.g., 1a, 2b) with AI assistance

---

### 🗣 Sermon & Speaker Extraction

- Extracts sermon titles across multiple lines
- Identifies speaker names
- Writes clean structured output into the sheet

---

### 📣 Announcement Processing

Two supported methods:

- 📄 PDF Parsing (`pdfToText`)
- 🤖 AI Parsing (DeepSeek API)

Capabilities:

- Splits announcements into slide-sized segments
- Balances Chinese and English text
- Handles multi-page content

---

### 🔁 Retry Mechanism

- Automatically triggers retries if one of both emails are missing
- Uses a 15-minute time-based trigger
- Continues retrying until Sunday
- Stops automatically afterward

---

## 🧩 Step 2: Generate Worship Slides

### 🎬 `createWorshipSlide()`

This function generates Google Slides from the structured data in the Google Sheet.

---

### 📊 Output Content

Includes:

- Invocation  
- Scripture readings  
- Sermon title  
- Speaker name  
- Announcements  

❌ Excluded:
- Praise songs  
- Sermon content slides  
- Images and videos  

---

## 🖥 Final Workflow

1. Run `populateWorshipTab()`
2. Run `createWorshipSlide()`
3. Export Google Slides as PowerPoint (.pptx)
4. Open in Microsoft PowerPoint
5. Copy into:
   - `cec_sermon_slide_master_202X`
   - (Provides special chinese fonts, countdown slide, and any special formatting)
6. Save final PPT
7. Upload to the Cantonese worship account

---

## ⚙️ Technologies Used

- Google Apps Script
- Gmail API (via Apps Script)
- Google Sheets API (via Apps Script)
- Google Slides API (via Apps Script)
- DeepSeek API (AI-assisted parsing)
- Custom Bible datasets (local)

---

## 💡 Key Benefits

- ⏱ Reduces manual preparation time
- ✅ Ensures consistency across weeks
- 🤖 Automates repetitive workflows
- 📉 Minimizes human error
- 🔁 Fully repeatable and reliable pipeline

---
## 📌 Notes

- The Google Sheet acts as a temporary staging layer, not long-term storage.
- The system mimics the human workflow as closely as possible.
- AI is used only where parsing ambiguity exists (e.g., email parsing, partial verse partitioning, announcements extraction).
