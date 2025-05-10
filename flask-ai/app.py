from flask import Flask, request, jsonify
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    revenue = data['revenue']
    
    X = np.array(range(len(revenue))).reshape(-1, 1)
    y = np.array(revenue)
    
    model = LinearRegression()
    model.fit(X, y)
    
    next_month = np.array([[len(revenue)]])
    prediction = model.predict(next_month)
    
    return jsonify({
        "revenu_prevu": round(prediction[0], 2)
    })

if __name__ == '__main__':
    app.run(debug=True)
