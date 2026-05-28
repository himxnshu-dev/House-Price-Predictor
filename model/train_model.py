import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import Ridge
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import make_column_transformer
from sklearn.pipeline import make_pipeline
from sklearn.metrics import r2_score
import pickle
import numpy as np

# Load the data
print("Loading data...")
data = pd.read_csv('Cleaned_data.csv')

# Feature Engineering
X = data.drop(columns=['price', 'Unnamed: 0'], errors='ignore') # Check if Unnamed: 0 exists
y = data['price']

# Define the Column Transformer
print("Setting up pipeline...")
column_trans = make_column_transformer(
    (OneHotEncoder(sparse_output=False), ['location']),
    remainder='passthrough'
)

# Create the pipeline
from sklearn.linear_model import Ridge
scaler = StandardScaler()
model = Ridge()

pipe = make_pipeline(column_trans, scaler, model)

# Train Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# Train the model
print("Training model with Log Transform...")
import numpy as np
pipe.fit(X_train, np.log1p(y_train))

# Evaluate
y_pred = pipe.predict(X_test)
score = r2_score(y_test, y_pred)
print(f"Model R2 Score: {score}")

# Save the model
print("Saving model to RidgeModel.pkl...")
pickle.dump(pipe, open('RidgeModel.pkl', 'wb'))
print("Done.")
