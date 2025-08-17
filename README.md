# AgriAssist AI — Agentic Advisory for Indian Farmers

Short: AgriAssist AI is a multilingual, hybrid online/offline agentic advisory system for smallholder farmers (voice-first, RAG-grounded, HITL + XAI).

// frontend readme

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


// For to run Frontend

First, make sure you have Node.js and Git installed on your computer.

Step 1: Clone the Repository
This command downloads a copy of your project from GitHub to your computer.
Open your terminal.
Navigate to the folder where you want to store the project (like your Deskop).
Run the following command:

git clone https://github.com/Knight-coderr1999/AgriAssistAI.git

Step 2: Go into the Project Folder
After the download is complete, you need to move into the project's directory.

cd AgriAssistAI

Step 3: Install Dependencies
This command reads the package.json file and installs all the necessary packages (like React, Tailwind CSS, etc.) that your project needs to run.

npm install

Step 4: Run the Application
This is the final step. It starts the local development server.

npm run dev

Your terminal will show you a local URL, which is usually http://localhost:5173. Open this link in your web browser, and you will see your running application.


## Key Challenges in Indian Agriculture & AgriAssist AI Solutions

| Specific Challenge | Corresponding AgriAssist AI Solution Feature |
|--------------------|----------------------------------------------|
| Climate Change & Variability | Dynamic, goal-driven Crop Health & Soil Agents adapting to real-time weather and crop conditions |
| Low Productivity & Inefficient Practices | Precision agriculture recommendations (VRT, optimal planting) from Crop & Soil Agents |
| Insect & Disease Infestations | AI-driven pest surveillance and targeted intervention advice from Crop Health Agent |
| Limited Land Holdings & Diverse Soil Types | Context-aware, localized advice from Soil & Water Management Agent; fine-tuning on regional data |
| Market Price Instability & Weak Infrastructure | Real-time market & financial insights from Market Agent; hybrid online-offline architecture |
| Post-Harvest Losses | Predictive analytics for optimal harvest/sale timing from Market Agent |
| Low Digital Literacy | Voice-first, intuitive Multilingual Voice Interface |
| Language Barriers & Code-Switching | Multilingual ASR/TTS, fine-tuned LLMs on synthetic Indian language datasets, code-switching handling |
| Unreliable Internet Connectivity | Hybrid online-offline architecture with on-device LLM inference and local data caching |
| Lack of Timely & Accurate Information | Comprehensive data integration, RAG-grounded LLMs, continuous knowledge updates |
| Farmer Unwillingness & Trust Deficit | Human-in-the-Loop (HITL) validation, Explainable AI (XAI) for transparency |
| High Implementation Costs & Affordability | Leveraging open-source frameworks, lightweight on-device models, and cost-efficient offline operation |

---

## Core Data Sources for AgriAssist AI

| Data Category | Key Data Sources | Type of Data | Access Method/Format |
|---------------|------------------|--------------|----------------------|
| Weather | Indian Meteorological Department (IMD), data.gov.in, IMDLIB | Gridded rainfall, temperature series, cyclone frequency, historical & real-time weather data | API, Downloadable CSV/NetCDF/GeoTIFF, Python Library |
| Crop & Yield | UPAg (Unified Portal for Agricultural Statistics), DES, IFPRI | Production estimates (foodgrain, rice, wheat, etc.), area, yield, climate impact on yields | Downloadable Reports/PDFs, Dataverse (IFPRI), Website Statistics |
| Soil Health | Soil Health Card Portal, NRSC (Bhuvan-Indian Soil datasets) | Soil testing results, nutrient analysis, soil properties (depth, texture, carbon maps) | Website Dashboards, Downloadable Maps/Data |
| Pest & Disease | ICAR-CRIDA Crop-Pest-Disease-Weather Database, Kaggle, NCIPM | Weekly pest records, disease information, pest images, IPM packages | Downloadable Excel/PDF, Image Datasets, Website Information |
| Finance & Policy | UPAg, DES, IFPRI | Market trends, pricing (MSP, farm harvest prices), cost of cultivation, agricultural wages, economic indicators, household consumption | Downloadable Reports/PDFs, Dataverse (IFPRI), Website Statistics |
| Multilingual Text | Vikaspedia (Govt of India) | Agriculture-specific documents for synthetic QA pair generation | Web Scraping, LLM-generated datasets |

## Quick links
- Initial synopsis: `docs/synopsis_initial.pdf`
- Final synopsis: `docs/synopsis_final.pdf`
- Demo video: `demo/demo_recording.mp4` (or link)

## Install (dev)
```bash
git clone <repo>
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt




