# System Architecture

## 1. Project Overview

This project is a full-stack mobile application consisting of:

* **Mobile:** React Native application built with Expo.
* **Server:** Node.js backend built with Express.
* **STT:** Deepgram Speech-to-Text for converting voice input into text.
* **LLM:** Gemini to understand user's request and selecting required service
* **Message Data:** Currently mocked using local JavaScript 

The mobile application will communicate with the backend through APIs.

## 2. High-Level Architecture

```text
Expo App
   ↓
Node.js / Express
   ↓
Deepgram STT
   ↓
Gemini LLM
   ↓
Service Selection
   ↓
WhatsApp / SMS / Email
   ↓
Mock Data
```

## 3. Project Structure

```text
project-root/
│
├── mobile/
│   └── src
|       └── app
|       |   └── _layout.tsx 
|       |   └── index.tsx 
|       └── services
|           └── api_calls.tsx 
│
├── server/
│   └── data
|   |   └── messages.js
│   └── services
|       └── llm-service.js
|       └── message.js
|       └── speech-to-text.js
│
├── docs/
│   └── architecture.md
│
├── .gitignore
└── README.md
```

## 4. Current Flow

```text
Voice Input
    ↓
Audio Upload
    ↓
Speech-to-Text
    ↓
User Request
    ↓
LLM selects required service(s)
    ↓
Message Service
    ↓
Mock Messages
```

## 5. Communication

The mobile application will communicate with the server through HTTP requests.

```text
Mobile App
    ↓
API Request
    ↓
Express Server
    ↓
Business Logic
    ↓
Database
    ↓
API Response
    ↓
Mobile App
```

## 6. Future Architecture

As development progresses, this document will be updated with:

* Real WhatsApp/SMS/Email integrations
* Database
* More assistant capabilities
* Authentication
* Security and deployment