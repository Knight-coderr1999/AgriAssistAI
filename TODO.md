# Hackathon To-Do List — AgriAssist AI

## Epic 1 – Initial Synopsis Submission (Deadline: Aug 12)
- [ ] Define MVP scope
  - [ ] Select crop, region, target user persona
  - [ ] Lock key problem statement
- [ ] Prepare initial synopsis draft
  - [ ] Fill Capital One template (problem, solution, architecture, dataset table)
  - [ ] Create high-level architecture diagram
- [ ] Reference datasets
  - [ ] List & link public datasets (IMD, UPAg, Soil Health, ICAR, Kaggle pests)
  - [ ] Note preprocessing steps for each
- [ ] Push to GitHub
  - [ ] Create repo structure with `docs/synopsis_initial.pdf`
  - [ ] Commit README scaffold

## Epic 2 – Backend AI Model Server
- [ ] Set up backend framework
  - [ ] Create FastAPI project
  - [ ] Implement `/inference` endpoint (query → response)
  - [ ] Implement `/health` endpoint
- [ ] Integrate RAG pipeline
  - [ ] Ingest & chunk agricultural knowledge base
  - [ ] Index with LlamaIndex/Chroma
  - [ ] Implement retrieval + generation
- [ ] ASR/TTS Integration
  - [ ] Integrate AI4Bharat ASR
  - [ ] Integrate IndicParler-TTS
- [ ] Model fine-tuning
  - [ ] QLoRA fine-tuning on synthetic Q&A pairs
  - [ ] Quantize for faster inference
- [ ] Deploy
  - [ ] Containerize backend with Docker
  - [ ] Optional: Deploy to Cloud Run or Render

## Epic 3 – Frontend Application
- [ ] Set up frontend framework
  - [ ] Initialize React + Vite (or Next.js)
  - [ ] Configure Tailwind CSS
- [ ] UI components
  - [ ] Home screen with "Ask the Agent" prompt
  - [ ] Voice record button
  - [ ] Response display (text + audio)
- [ ] API integration
  - [ ] Send audio/text to `/inference`
  - [ ] Play TTS audio response
- [ ] Language selector
- [ ] Offline mode
  - [ ] Integrate quantized local model

## Epic 4 – Data & Model Pipeline
- [ ] Data collection
  - [ ] Download IMD weather data
  - [ ] Download UPAg crop yield data
  - [ ] Scrape ICAR-CRIDA pest data
  - [ ] Collect Agmarknet market prices
- [ ] Data preprocessing
  - [ ] Clean & normalize datasets
  - [ ] Store in `data/processed/`
- [ ] Synthetic data generation
  - [ ] Create multilingual QA pairs
  - [ ] Label for fine-tuning
- [ ] Model training
  - [ ] Fine-tune LLM (QLoRA + PEFT)
  - [ ] Evaluate with agriculture-specific test set

## Epic 5 – Demo Video & Presentation
- [ ] Script demo flow
  - [ ] Intro (problem & persona)
  - [ ] Hero scenario
  - [ ] Failure case → fix
  - [ ] Offline mode demo
- [ ] Record screen + voice-over
- [ ] Edit with captions
- [ ] Upload to `demo/` folder

## Epic 6 – Documentation & Submission
- [ ] README.md with setup, usage, dataset citations
- [ ] Requirements.txt and environment.yml
- [ ] Final synopsis (6–8 pages, technical details)
- [ ] Push reproducible code with scripts

## Epic 7 – Post-submission (Aug 19–27)
- [ ] Prepare 8-minute pitch slides
- [ ] Rehearse with timer
- [ ] Prepare answers for Q&A (limitations, ethics, scaling)
