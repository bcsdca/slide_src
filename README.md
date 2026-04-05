Step 1: 📊 Auto Populate Worship Tab (Google Apps Script)

This project automates the process of populating a "worship" Google Sheet tab using data extracted from two Gmail sources:

1. **Cantonese Worship Info Email** (Emily's email with bulletin PDF attachment)
2. **Cantonese Worship Reminder Email** (for Invocation passage from the MC of this week)

It parses invocation passages, scripture readings, sermon details, speaker info, invocation passages, and announcements, then inserts them into a structured spreadsheet format.

---

## 🚀 Main Function

### `populateWorshipTab()`

This is the core entry point.

### What it does:

1. 🔔 Displays a toast notification indicating processing has started  
2. 🧹 Clears previous logs  
3. 📅 Calculates the coming Sunday  
4. 📬 Searches Gmail for:
   - Worship info C
   - Cantonese reminder email  
5. 📎 Extracts PDF attachment (bulletin)
6. 📖 Parses:
   - Invocation passages
   - Scripture reading
   - Sermon title
   - Speaker name
7. 🧾 Extracts announcements (via DeepSeek API or PDF parsing)
8. 🧹 Cleans old spreadsheet data
9. ✍️ Inserts new structured data into the "worship" sheet
10. 🔁 Handles retries if emails are missing
11. ✅ Sends completion notification

---

## 🧠 Key Features

### 📬 Gmail Integration
- Uses `GmailApp.search()` to locate relevant emails
- Handles multi-message threads
- Extracts both text content and attachments

### 📊 Google Sheets Automation
- Dynamically finds insertion points using markers:
  - `TITLE_INVOCATION`
  - `TITLE_SCRIPTURE_READING`
  - `TITLE_SERMON_TOPIC`
  - `TITLE_ANNOUNCEMENT`
- Cleans old data before inserting new content
- Inserts formatted rows with timestamps

### 📖 Scripture Processing
- Parses Bible passages via locally build cuvBible or nivBible
- This is done to avoid network traffic and not relying on outside resources
- Expands verses into structured rows
- Supports multi-line/multi chapters scripture references
- Supports partial scripture line references, like verse 1a or verse 2b, with AI assistance

### 🗣 Sermon & Speaker Extraction
- Combines multi-line sermon titles
- Extracts speaker name
- Writes both into sheet

### 📣 Announcement Processing
Two methods supported:
- 📄 PDF parsing (`pdfToText`)
- 🤖 AI extraction (`DeepSeek API`)

Handles:
- Splitting into slides/pages
- Character balancing (ASCII vs non-ASCII)
- Multi-page announcements

### 🔁 Auto Retry System
If emails or invocation are missing:
- Creates a **15-minute trigger**
- Keeps retrying until Sunday
- Stops automatically on Sunday

---

Step 2: 📊 Generating the weekly google worship slide

- After sucessfully execuation of the above function populateWorshipTab() in Step 1 
- Another function "createWorshipSlide() was ran to generate the weekly worship google slide
- This worship google slide should have all the basics of the weekly worship info, except praise songs/sermon/any image/video
- This sermon google slide was downloaded to a PC/labptop with microsoft ppt installed, and then be copy and paste to the cec_sermon_slide_master_202X, which provide all the special chinese font and the special countdown slide

