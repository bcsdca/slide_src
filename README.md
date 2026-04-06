📖 Cantonese Worship PPT Automation


🎯 Overview
This project automates the weekly preparation of Cantonese worship PowerPoint slides.
It replicates the same manual workflow typically performed by Cantonese ppt preparation co-workders, but streamlines it using:
•	Google Apps Script (JavaScript-based automation) 
•	Gmail integration 
•	Google Sheets as a structured data layer 
•	AI-assisted parsing (DeepSeek API) 
________________________________________
🔄 Workflow
The system consists of two main stages:
1️⃣ Data Extraction & Structuring
•	Pulls worship-related information from Gmail 
•	Parses bulletin PDF and email content 
•	Stores structured data into a Google Sheet 
2️⃣ Slide Generationn
•	Uses the structured data to generate Google Slides 
•	Slides are later exported and converted into the final PowerPoint format 
________________________________________
🧩 Step 1: Populate Worship Data
📥 Data Sources
The script retrieves information from two Gmail emails:
1.	Worship Info C 
o	Sent by our church administration office 
o	Includes bulletin PDF attachment 
2.	Cantonese Sunday Service Reminder 
o	Contains invocation passages selected by the MC 
________________________________________
🚀 Core Function
populateWorshipTab()
This is the main entry point of the automation pipeline.
🔧 Responsibilities
•	Displays a start notification 
•	Clears previous logs and sheet data 
•	Determines the upcoming Sunday 
•	Searches Gmail for required emails 
•	Extracts and parses: 
o	Invocation passages 
o	Scripture readings 
o	Sermon title 
o	Speaker name 
o	Announcements 
•	Processes bulletin PDF attachments 
•	Writes structured data into the "worship" Google Sheet 
•	Retries automatically if required emails are missing 
•	Sends completion notification 
________________________________________
🧠 Features
📬 Gmail Integration
•	Uses GmailApp.search() to locate relevant emails 
•	Handles email threads and attachments 
•	Extracts both plain text and PDF content 
•	Scheduled to run automatically (typically Friday ~5:30 PM) 
________________________________________
📊 Google Sheets Structuring
•	Dynamically locates sections using markers: 
o	TITLE_INVOCATION 
o	TITLE_SCRIPTURE_READING 
o	TITLE_SERMON_TOPIC 
o	TITLE_ANNOUNCEMENT 
•	Clears old data before inserting new entries 
•	Inserts formatted and timestamped rows 
________________________________________
📖 Scripture Processing
•	Uses local Bible datasets (cuvBible, nivBible) 
•	No external API dependency 
•	Supports: 
o	Multi-chapter passages 
o	Multi-line scripture references 
o	Partial verse references (e.g., 1a, 2b) with AI assistance 
________________________________________
🗣 Sermon & Speaker Extraction
•	Extracts sermon titles across multiple lines 
•	Identifies speaker names 
•	Writes clean structured output into the sheet 
________________________________________
📣 Announcement Processing
Two supported methods:
•	📄 PDF Parsing (pdfToText) 
•	🤖 AI Parsing (DeepSeek API) 
Capabilities:
•	Splits scripture passages into slide-sized segments 
•	Splits announcements into slide-sized segments 
•	Balances Chinese and English text 
•	Handles multi-page content 
________________________________________
🔁 Retry Mechanism
•	Automatically triggers retries if emails are missing 
•	Uses a 15-minute time-based trigger 
•	Continues retrying until Sunday 
•	Stops automatically afterward 
________________________________________
🧩 Step 2: Generate Worship Slides
🎬 createWorshipSlide()
This function generates Google Slides from the structured data in the Google Sheet.
________________________________________
📊 Output Content
Includes:
•	Invocation 
•	Scripture readings 
•	Sermon title 
•	Speaker name 
•	Announcements 
❌ Excluded:
•	Praise songs 
•	Sermon content slides 
•	Images and videos 
________________________________________
🖥 Final Workflow
1.	Run populateWorshipTab() 
2.	Run createWorshipSlide() 
3.	Export Google Slides as PowerPoint (.pptx) 
4.	Open in Microsoft PowerPoint 
5.	Copy into: 
o	cec_sermon_slide_master_202X 
o	(Provides fonts, countdown slides, and formatting) 
6.	Save final PPT 
7.	Upload to the Cantonese worship account 
________________________________________
🏗 Architecture Overview
Gmail (Emails + PDF)
        ↓
Google Apps Script
        ↓
Data Extraction & Parsing
        ↓
Google Sheets (Structured Data)
        ↓
Google Slides Generation
        ↓
PowerPoint Export & Final Formatting
________________________________________
⚙️ Technologies Used
•	Google Apps Script 
•	Gmail API (via Apps Script) 
•	Google Sheets API (via Apps Script) 
•	Google Slides API (via Apps Script) 
•	DeepSeek API (for AI-assisted parsing) 
•	Custom Bible datasets (local) 
________________________________________
💡 Key Benefits
•	⏱ Reduces manual preparation time 
•	✅ Ensures consistency across weeks 
•	🤖 Automates repetitive workflows 
•	📉 Minimizes human error 
•	🔁 Fully repeatable and reliable pipeline 
________________________________________
📌 Notes
•	The Google Sheet acts as a temporary staging layer, not long-term storage. 
•	The system is designed to mimic human workflow as closely as possible. 
•	AI is used only where parsing ambiguity exists (e.g., announcements). 


