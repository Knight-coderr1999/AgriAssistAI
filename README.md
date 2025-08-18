
-----

# AgriAssist AI: Agentic Advisory for Indian Farmers 🧑‍🌾

## Overview

AgriAssist AI is a multilingual, agentic advisory system built to empower smallholder farmers in India. Our solution addresses the core challenges faced by the agricultural community, including unreliable internet access, low digital literacy, and linguistic diversity. The system is voice-first and leverages a custom fine-tuned **Gemma 3n model** with a **Retrieval-Augmented Generation (RAG)** engine to provide accurate, real-time, and context-aware advice.

The solution is designed to be highly accessible and trustworthy. It combines a human-in-the-loop (HITL) approach with Explainable AI (XAI) principles to ensure the advice is not only correct but also easy for farmers to understand and trust.

## 🚀 Key Features

Our application provides a suite of tools to help farmers and other agricultural stakeholders make informed decisions:

  * **Dashboard:** A quick-glance dashboard offering essential information, including:
      * Today's key instructions for farming activities.
      * Current weather conditions and local forecasts.
      * A 7-day soil moisture trend for optimal irrigation planning.
      * Recent alerts triggered by the AI, such as pest or weather warnings.
  * **Pest Detection:** Users can upload a crop image for analysis. The AI identifies potential pests and provides recommended interventions.
  * **Soil Analysis:** Upload an image of your soil to receive a detailed analysis of its health and nutrient composition.
  * **Irrigation Analysis:** Get AI-driven insights on your irrigation needs by uploading an image related to your watering system.
  * **Weather:** A dedicated section for a comprehensive weather report, including an hourly forecast and a daily farmer's advisory.
  * **Notifications & AI Chatbot:** Receive automated alerts for critical events (e.g., rain, pest activity). Our integrated chatbot allows for live interaction and provides instant, personalized insights powered by the fine-tuned Gemma 3n model.

## 🧑‍💻 Technical Stack

  * **Frontend:** **React.js** with **Vite** and **Tailwind CSS**.
  * **Backend:** A **Flask** server running on **Python 3.10** with **SQLite** for the database.
  * **AI/ML:** The core of our system is a **fine-tuned Gemma 3n model** and a custom **RAG engine**. This engine fetches real-time data from various public sources, including government APIs and agricultural databases, to provide grounded, hallucination-free responses.

## ⚙️ How to Run Locally

Follow these steps to get the project running on your local machine. You will need **Git**, **Node.js**, and **Python 3.10** installed.

### Step 1: Clone the Repository

Open your terminal and clone the repository:

```bash
git clone https://github.com/Knight-coderr1999/AgriAssistAI.git
cd AgriAssistAI
```

-----

### Step 2: Run the Backend (API)

The backend server will run on port **4000**.

1.  Navigate to the `api` directory:
    ```bash
    cd api
    ```
2.  Install the required Python libraries:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the Flask server:
    ```bash
    python app.py
    ```
    The API is now live at `http://localhost:4000`.

-----

### Step 3: Run the Frontend (FE)

The frontend server will run on port **3000**.

1.  Navigate back to the project root and then into the `fe` directory:
    ```bash
    cd ../fe
    ```
2.  Install the JavaScript dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    Your application will be available at `http://localhost:3000`. Open this URL in your web browser.

-----

## 🎯 Future Plans (TODOs)

Our vision for AgriAssist AI extends beyond this initial implementation:

  * **Edge Device Deployment:** We aim to deploy our fine-tuned Gemma 3n model directly onto edge devices. This will enable real-time analysis and advice even in areas with zero internet connectivity, a critical step toward serving the most remote communities.
  * **Voice-First Interface:** A key part of our vision is to fully implement a seamless voice-first interface, making the app even more accessible to users with low digital literacy.

-----
**Demo Video:** [`Video Demo`](https://www.youtube.com/watch?v=ly07WZjk010)
