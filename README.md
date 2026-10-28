
# Smart Purchase Analytics

Smart Purchase Analytics is a web-based project designed to analyze customer purchase behavior using Machine Learning and Data Mining techniques.

## Project Modules

### 1. Purchase Prediction
Uses Machine Learning to predict whether an online visitor is likely to make a purchase based on browsing behavior and session-related data.

- Dataset: Online Shoppers Purchasing Intention
- Target: Revenue
- Technology: Python and Scikit-learn

### 2. Market Basket Analysis
Uses the Apriori algorithm to discover products that are frequently purchased together and generate association rules.

- Dataset: Online Retail
- Technology: Python, Pandas and Mlxtend

## Technologies Used

### Frontend
- React
- JavaScript
- HTML
- CSS
- Parcel

### Backend
- Python
- Flask
- Pandas
- NumPy
- Scikit-learn
- Mlxtend

## Project Structure

```text
Smart-Purchase-Analytics/
├── backend/
│   ├── app.py
│   └── data/
└── frontend/
    ├── index.html
    ├── index.js
    ├── package.json
    └── src/
```

## How to Run the Project

### Start the Backend

Open PowerShell in the backend folder:

```powershell
.\venv\Scripts\Activate.ps1
python app.py
```

Backend URL: http://127.0.0.1:5000

### Start the Frontend

Open a second terminal in the frontend folder:

```powershell
npm install
npm start
```

Open the local URL shown by Parcel in your browser.

## Project Status

The dashboard and initial backend setup are implemented. The Machine Learning prediction and Apriori analysis functionality are under development.
