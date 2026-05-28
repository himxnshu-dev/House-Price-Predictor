#  Bengaluru House Price Predictor

An end-to-end Machine Learning project that predicts house prices in Bengaluru based on features like location, BHK, bathrooms, and total square footage.

The project covers the complete ML lifecycle:
Data Cleaning → Feature Engineering → Model Training → Evaluation → Deployment using Flask → Live Hosting on Render

---

##  Live Demo
🔗 [Add Your Render Link Here]

---

## 📌 Problem Statement

Real estate prices vary significantly based on location, size, and amenities.  
The goal of this project is to build a regression model that predicts house prices accurately using historical housing data.

---

##  Tech Stack

- Python
- Pandas, NumPy
- Scikit-learn
- Flask
- HTML, CSS (Bootstrap)
- Render (Deployment)

---

##  Dataset

- Bengaluru Housing Dataset
- Features Used:
  - Location
  - BHK
  - Bathrooms
  - Total Square Feet

---

##  Data Preprocessing

- Removed irrelevant columns
- Handled missing values
- Removed extreme outliers using price per square foot analysis
- One-hot encoding for categorical features (Location)

---

##  Model Training

Models experimented:
- Linear Regression
- Ridge Regression
- Lasso Regression

Final Model Selected: **Ridge Regression**

Reason:
- Reduced overfitting compared to simple Linear Regression
- Handled multicollinearity using L2 regularization
- Better cross-validation performance

---

##  Model Evaluation

Evaluation Metrics Used:
- R² Score
- Mean Absolute Error (MAE)
- Mean Squared Error (MSE)

Final Model Performance:
- Train R²: XX
- Test R²: XX
- MAE: XX
- MSE: XX

---

## 📂 Project Structure

HousePricePredictor/
│
├── static/  
│   └── CSS files and static assets used in frontend UI
│
├── templates/  
│   └── HTML templates rendered by Flask (index.html)
│
├── app.py  
│   └── Main Flask application file. Loads trained model and handles user input & prediction.
│
├── clean_data.py  
│   └── Data preprocessing script: handles missing values, outliers, and feature engineering.
│
├── train_model.py  
│   └── Trains Linear, Ridge, and Lasso models and saves the best model as .pkl file.
│
├── inspect_model.py  
│   └── Used for testing or inspecting model coefficients and performance.
│
├── RidgeModel.pkl  
│   └── Serialized trained Ridge regression model used for predictions.
│
├── Bengaluru_House_Data.csv  
│   └── Original dataset.
│
├── Cleaned_data.csv  
│   └── Processed dataset used for model training.
│
├── requirements.txt  
│   └── Project dependencies.
│
└── README.md  
    └── Project documentation.


---

## 🌐 Deployment

The model is deployed using Flask and hosted on Render.

Steps:
1. Trained model saved using pickle
2. Flask app loads model
3. User inputs passed to model
4. Prediction displayed on UI

---

## 💡 Future Improvements

- Add Cross-Validation with GridSearchCV
- Experiment with Random Forest and XGBoost
- Add Docker support
- Deploy on AWS with CI/CD
- Add input validation & logging

---

##  Author

Harsh Sharma  
B.Tech CSE | Aspiring Data Scientist  
LinkedIn: [www.linkedin.com/in/harsh-sharma-30419a327]
GitHub: [https://github.com/harshs-data/House-Price-Predictor]

---

##  Key Learnings

- End-to-end ML pipeline building
- Handling categorical variables
- Regularization techniques (Ridge & Lasso)
- Model serialization using Pickle
- Flask deployment workflow
- Cloud hosting using Render

---


