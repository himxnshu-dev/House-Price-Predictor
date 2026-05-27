from flask import Flask, render_template, request
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)
data = pd.read_csv('Cleaned_data.csv')
pipe = pickle.load(open("RidgeModel.pkl", 'rb'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict-page')
def predict_page():
    locations = sorted(data['location'].unique())
    return render_template('predict.html', locations=locations)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 1. Cast inputs safely
        location = request.form.get('location')
        bhk = float(request.form.get('bhk'))
        bath = float(request.form.get('bath'))
        sqft = float(request.form.get('total_sqft'))

        # 2. Backend Guardrails
        if location not in data['location'].unique():
            return "Error: Unknown Location"
        
        # Strict validation for realistic inputs
        if sqft < 300:
             return "Error: Square Footage must be at least 300"
        
        if sqft > 50000:
            return "Error: Square Footage cannot exceed 50,000"
        
        if bhk <= 0 or bath <= 0:
            return "Error: BHK and Bathrooms must be positive"
        
        if sqft / bhk < 300:
            return "Error: Square Footage per BHK is suspiciously low (minimum 300 sqft/BHK)"

        if bath > bhk + 2:
             return "Error: Bathrooms exceed BHK by more than 2, which is suspicious"

        print(location, bhk, bath, sqft)
        
        # Prepare input
        input_data = pd.DataFrame([[location, sqft, bath, bhk]], columns=['location', 'total_sqft', 'bath', 'bhk'])
        
        # 3. Prediction & Inverse Log Transform
        prediction_log_scale = pipe.predict(input_data)[0]
        prediction = np.expm1(prediction_log_scale)

        # 4. Floor Logic
        prediction = max(0, prediction)

        # 5. Formatted Output (₹XX.XX Lakhs)
        return "₹" + str(np.round(prediction, 2)) + " Lakhs"

    except ValueError:
        return "Error: Invalid Input. Please enter numbers."
    except Exception as e:
        return f"Error: {e}"

if __name__ == "__main__":
    app.run(debug=True, port=5001)