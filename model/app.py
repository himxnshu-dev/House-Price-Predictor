from flask import Flask, request, jsonify
import pandas as pd
import pickle
import numpy as np

app = Flask(__name__)

# Load dependencies into memory at startup
try:
    df = pd.read_csv('Cleaned_data.csv')
    pipe = pickle.load(open("RidgeModel.pkl", 'rb'))
except Exception as e:
    print(f"Startup Error: Ensure Cleaned_data.csv and RidgeModel.pkl exist. Details: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 1. Parse incoming JSON from the Node.js server
        data = request.get_json()
        
        if not data:
             return jsonify({"success": False, "error": "No JSON payload provided"}), 400

        location = data.get('location')
        bhk = float(data.get('bhk'))
        bath = float(data.get('bath'))
        sqft = float(data.get('total_sqft'))

        # 2. Domain-Specific Guardrail (Keep only the data integrity check)
        if location not in df['location'].unique():
            return jsonify({"success": False, "error": "Unknown Location"}), 400
        
        # 3. Format Data for the ML Pipeline
        input_data = pd.DataFrame(
            [[location, sqft, bath, bhk]], 
            columns=['location', 'total_sqft', 'bath', 'bhk']
        )
        
        # 4. Prediction & Inverse Log Transform
        prediction_log_scale = pipe.predict(input_data)[0]
        prediction = np.expm1(prediction_log_scale)

        # 5. Floor Logic
        final_price = max(0, float(prediction))

        # 6. JSON Output matching the Node.js Axios request expectations
        return jsonify({
            "success": True, 
            "price_lakhs": round(final_price, 2)
        }), 200

    except ValueError:
        return jsonify({"success": False, "error": "Invalid Data Types. Expected numbers."}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    # Runs on Port 5001 to avoid conflicting with your Node.js server
    app.run(debug=True, port=5001)