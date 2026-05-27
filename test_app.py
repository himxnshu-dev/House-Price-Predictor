import requests

url = 'http://127.0.0.1:5001/predict'
data = {
    'location': '1st Phase JP Nagar',
    'bhk': 2,
    'bath': 2,
    'total_sqft': 1000
}

try:
    response = requests.post(url, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
