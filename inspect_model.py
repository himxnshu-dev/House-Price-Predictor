
import pickle
import pandas as pd
import numpy as np

# Load model and data
pipe = pickle.load(open("RidgeModel.pkl", 'rb'))
data = pd.read_csv("Cleaned_data.csv")
X = data.drop(columns=['price', 'Unnamed: 0'], errors='ignore')

print("X Columns:", X.columns)
print("Bath Unique Values:", data['bath'].unique())
print("Bath Variance:", data['bath'].var())

# Get feature names after transformer
# Note: StandardScaler and Ridge don't change feature names, but OneHotEncoder does.
# We need to dig into the pipeline to get the feature names.

try:
    # Access steps
    col_transformer = pipe.named_steps['columntransformer']
    model = pipe.named_steps['ridge']
    
    # Get encoded feature names
    ohe_features = col_transformer.named_transformers_['onehotencoder'].get_feature_names_out(['location'])
    
    # Get remainder feature names
    # passthrough columns are the ones not in ['location']
    remainder_cols = [c for c in X.columns if c != 'location']
    
    feature_names = np.concatenate([ohe_features, remainder_cols])
    
    # Get coefficients
    coefs = model.coef_
    
    # Create valid dataframe
    coef_df = pd.DataFrame({'Feature': feature_names, 'Coefficient': coefs})
    
    print("\n--- Top 5 Positive Coefficients ---")
    print(coef_df.sort_values(by='Coefficient', ascending=False).head(5))
    
    print("\n--- Top 5 Negative Coefficients ---")
    print(coef_df.sort_values(by='Coefficient', ascending=True).head(5))
    
    print("\n--- Bathroom Coefficient ---")
    print(coef_df[coef_df['Feature'] == 'bath'])
    
    print("\n--- BHK Coefficient ---")
    print(coef_df[coef_df['Feature'] == 'bhk'])
    
    print("\n--- Total Sqft Coefficient ---")
    print(coef_df[coef_df['Feature'] == 'total_sqft'])

except Exception as e:
    print(f"Error inspecting model: {e}")
    # Fallback: Just print raw coeffs range
    try:
        print("Raw coefficients stats:")
        print(pd.Series(pipe.named_steps['ridge'].coef_).describe())
    except:
        print("Could not access ridge coefficients directly.")
