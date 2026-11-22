# Smart Purchase Analytics

Smart Purchase Analytics is a web-based data analytics project built to explore retail transaction data and analyze online visitor purchase behaviour. It combines a React frontend with a Flask backend and provides two implemented analytical modules:

1. **Market Basket Analysis** using the Apriori algorithm.
2. **Purchase Prediction** using a Random Forest classification model.

The dashboard presents dataset statistics and visual summaries from these modules.

## Table of Contents

- [Project Overview](#project-overview)
- [Implemented Modules](#implemented-modules)
- [Datasets](#datasets)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Backend API](#backend-api)
- [Model Evaluation](#model-evaluation)
- [Installation and Setup](#installation-and-setup)
- [Running the Project](#running-the-project)
- [Current Limitations](#current-limitations)
- [Future Scope](#future-scope)

## Project Overview

The purpose of Smart Purchase Analytics is to extract useful information from retail transactions and online shopping session data.

The project currently uses two datasets for two different tasks:

- Retail transaction data is used to identify products that frequently appear together in the same transaction.
- Online shopping session data is used to predict whether a website visitor's session will result in a purchase.

The frontend provides a dashboard and separate pages for the two analytical modules. The Flask backend loads the datasets, performs the required processing and analysis, and provides API endpoints to the frontend.

**Important:** Purchase prediction is based on visitor-session information. It does not predict whether a particular named product will be purchased.

## Implemented Modules

### 1. Dashboard

The dashboard displays key statistics obtained from the project's datasets and analysis.

The implemented dashboard includes:

- Total customers: **4,372**
- Total transactions: **25,900**
- Purchase sessions: **12,330**
- Product associations (association rules): **151**
- Purchase and no-purchase distribution chart.
- Market Basket Analysis statistics chart.

The purchase-session distribution in the dataset is:

| Session outcome | Records | Percentage |
|---|---:|---:|
| Purchase | 1,908 | 15.47% |
| No Purchase | 10,422 | 84.53% |
| **Total** | **12,330** | **100%** |

The customer and transaction counts are calculated from the retail transaction dataset. Purchase-session statistics are taken from the online shoppers dataset.

### 2. Market Basket Analysis

Market Basket Analysis is a Data Mining technique used to discover products that frequently occur together in transactions. It can help identify associations between products.

This project uses the **Apriori algorithm** for frequent itemset mining and association rule generation.

#### Processing and analysis

- Loads the Online Retail dataset.
- Uses invoice numbers to group products into transactions.
- Prepares transaction data for analysis.
- Converts transactions into a suitable transaction matrix using `TransactionEncoder`.
- Applies the Apriori algorithm to find frequent itemsets.
- Generates association rules using `association_rules`.
- Displays frequent itemsets and association rules in the frontend.

#### Analysis parameters

The API supports the following parameters:

| Parameter | Default value | Meaning |
|---|---:|---|
| `min_support` | `0.02` | Minimum support required for a frequent itemset |
| `min_confidence` | `0.3` | Minimum confidence required for a rule |
| `min_lift` | `1.0` | Minimum lift required for a rule |

Support and confidence must be greater than 0 and no greater than 1. Lift cannot be negative.

#### Current default analysis results

| Result | Count |
|---|---:|
| Transactions used in analysis | 19,960 |
| Frequent itemsets | 379 |
| Association rules | 151 |

One of the top generated rules is:

**PINK REGENCY TEACUP AND SAUCER**  
→ **GREEN REGENCY TEACUP AND SAUCER, ROSES REGENCY TEACUP AND SAUCER**

| Metric | Value |
|---|---:|
| Support | 0.0271 |
| Confidence | 0.7072 |
| Lift | 18.4035 |

These are the results obtained with the current default analysis settings. Changing the parameters can change the results.

### 3. Purchase Prediction

The Purchase Prediction module uses the **Online Shoppers Purchasing Intention** dataset to predict whether an online visitor session will result in a purchase.

The target column is `Revenue`:

- `True` represents a session that resulted in a purchase.
- `False` represents a session that did not result in a purchase.

#### Input features

The model uses the following 17 input features:

1. Administrative
2. Administrative_Duration
3. Informational
4. Informational_Duration
5. ProductRelated
6. ProductRelated_Duration
7. BounceRates
8. ExitRates
9. PageValues
10. SpecialDay
11. Month
12. OperatingSystems
13. Browser
14. Region
15. TrafficType
16. VisitorType
17. Weekend

`Revenue` is the target column, not an input feature.

#### Model and preprocessing

The implemented model is a Random Forest Classifier with:

- 150 estimators (trees).
- `random_state=42`.
- `class_weight="balanced"`.
- Numeric feature scaling using `StandardScaler`.
- Categorical feature encoding using `OneHotEncoder` with `handle_unknown="ignore"`.
- A preprocessing and classification pipeline.
- An 80/20 train-test split with stratification and `random_state=42`.

The trained model is saved as a Joblib model artifact at:

`backend/models/purchase_prediction_model.pkl`

The backend provides endpoints to train the model and make predictions. A prediction response includes a prediction label and purchase probability.

## Datasets

The project uses the following datasets.

### OnlineRetail.csv

**Location:** `backend/data/OnlineRetail.csv`

| Property | Details |
|---|---|
| Original records | 541,909 |
| Columns | 8 |
| Encoding | ISO-8859-1 |
| Main use | Market Basket Analysis |

The dataset contains retail invoice and product transaction information, including invoice number, stock code, product description, quantity, invoice date, unit price, customer ID and country.

The Market Basket preprocessing pipeline produces:

`backend/data/processed/market_basket_processed.csv`

The recorded source shape is 541,909 rows and 8 columns. The processed output shape is 524,878 rows and 8 columns.

### online_shoppers_intention.csv

**Location:** `backend/data/online_shoppers_intention.csv`

| Property | Details |
|---|---|
| Records | 12,330 |
| Columns | 18 |
| Encoding | UTF-8 |
| Input features | 17 |
| Target | Revenue |
| Main use | Purchase Prediction |

The dataset contains website visitor session information and the `Revenue` target.

The purchase-prediction preprocessing pipeline produces:

`backend/data/processed/purchase_prediction_processed.csv`

The recorded source shape is 12,330 rows and 18 columns. The processed output shape is 12,205 rows and 18 columns.

## Technologies Used

### Frontend

- React
- JavaScript
- CSS
- Parcel
- Recharts
- Lucide React

### Backend and data analysis

- Python
- Flask
- Flask-CORS
- Pandas
- mlxtend
- scikit-learn
- Joblib

## Project Structure

```text
Smart-Purchase-Analytics/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── data/
│   │   ├── OnlineRetail.csv
│   │   ├── online_shoppers_intention.csv
│   │   └── processed/
│   │       ├── market_basket_processed.csv
│   │       └── purchase_prediction_processed.csv
│   ├── models/
│   │   └── purchase_prediction_model.pkl
│   ├── preprocessing/
│   │   ├── market_basket_preprocessing.py
│   │   └── purchase_prediction_preprocessing.py
│   ├── services/
│   │   ├── market_basket_analysis.py
│   │   ├── market_basket_service.py
│   │   └── purchase_prediction_service.py
│   └── utils/
│       ├── data_cleaning.py
│       ├── data_export.py
│       ├── data_inspection.py
│       ├── data_loader.py
│       ├── data_pipeline.py
│       ├── data_preprocessing.py
│       └── data_validation.py
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── app.css
        ├── App.js
        └── dashboard/
            ├── components/
            │   ├── Header.js
            │   ├── Header.css
            │   ├── ModuleCard.js
            │   ├── ModuleCard.css
            │   ├── Sidebar.js
            │   ├── Sidebar.css
            │   ├── StatCard.js
            │   └── StatCard.css
            ├── pages/
            │   ├── Dashboard.js
            │   ├── MarketBasketAnalysis.js
            │   └── PurchasePrediction.js
            └── styles/
                ├── Dashboard.css
                └── ModulePages.css
```

## Backend API

The Flask backend runs locally at:

`http://127.0.0.1:5000`

The implemented endpoints are:

| Endpoint | Method | Purpose |
|---|---|---|
| `/` | GET | Backend root route |
| `/api/health` | GET | Backend health check |
| `/api/datasets` | GET | Dataset information |
| `/api/dashboard-stats` | GET | Dashboard statistics |
| `/api/market-basket` | GET | Frequent itemsets and association rules |
| `/api/purchase-prediction/train` | POST | Train the purchase prediction model |
| `/api/purchase-prediction/predict` | POST | Generate a purchase prediction |

The backend uses Flask-CORS to allow frontend requests to the API.

### Market Basket Analysis endpoint

`GET /api/market-basket`

Optional query parameters:

- `min_support`
- `min_confidence`
- `min_lift`

The default values are `0.02`, `0.3` and `1.0`, respectively.

### Purchase Prediction endpoints

- `POST /api/purchase-prediction/train` trains the prediction model.
- `POST /api/purchase-prediction/predict` accepts visitor-session input and returns a prediction label and purchase probability.

The exact request fields should match the input fields expected by the current frontend form and backend implementation.

## Model Evaluation

The current Random Forest model evaluation results are:

| Metric | Result |
|---|---:|
| Accuracy | 0.8927 (89.27%) |
| Precision | 0.6370 |
| Recall | 0.7304 |
| F1-score | 0.6805 |

### Confusion matrix

| Actual / Predicted | No Purchase | Purchase |
|---|---:|---:|
| No Purchase | 1,900 | 159 |
| Purchase | 103 | 279 |

The test set contains 2,441 records, and the training set contains 9,764 records.

These metrics describe the current train-test evaluation. They do not guarantee the same performance on new or future visitor sessions.

## Installation and Setup

### Requirements

- Python installed on the system.
- Node.js and npm installed.
- Git, if cloning the repository.

### 1. Clone the repository

```bash
git clone https://github.com/piyushpokhriya/Smart-Purchase-Analytics.git
cd Smart-Purchase-Analytics
```

### 2. Set up the backend

Open a terminal in the project root:

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.\venv\Scripts\Activate
```

Install the backend packages:

```bash
pip install Flask Flask-Cors pandas mlxtend scikit-learn joblib
```

### 3. Set up the frontend

Open another terminal in the project root:

```bash
cd frontend
npm install
```

## Running the Project

Run the backend and frontend in separate terminals.

### Start the backend

From the `backend` directory, with the virtual environment activated:

```bash
python app.py
```

The backend is expected to be available at:

`http://127.0.0.1:5000`

### Start the frontend

From the `frontend` directory:

```bash
npm start
```

Open the local address printed by Parcel in the terminal.

### Create a production frontend build

From the `frontend` directory:

```bash
npm run build
```

The production build is generated in the frontend `dist` directory.

## Current Limitations

The current implementation has the following boundaries:

- Purchase prediction is based on visitor-session behaviour, not on an individual product.
- The Online Shoppers dataset does not provide product names for product-specific purchase prediction.
- The datasets do not provide age or gender information for demographic or age-wise purchase analysis.
- The retail dataset does not contain a ready-made product category field.
- The model's evaluation metrics are based on the available dataset and its current train-test split.
- Predictions depend on the input features supported by the current dataset and model.

## Future Scope

The following are possible improvements. They are **not implemented features** in the current project.

- Add age-wise and demographic purchase analysis if suitable data becomes available.
- Add product-specific purchase prediction using a suitable product-level dataset.
- Develop product recommendation features using additional customer and product information.
- Add more visual reports and deeper customer behaviour analysis.
- Integrate updated or real-time retail and website session data.
- Evaluate additional machine-learning models and compare their performance.
- Improve model evaluation using further validation and testing on new data.

## Project Status

The current project includes a dashboard, Market Basket Analysis using Apriori, and visitor-session Purchase Prediction using Random Forest. The future-scope items listed above are proposed extensions and should not be considered part of the current implementation.
