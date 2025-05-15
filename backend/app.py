# app.py – Flask backend
from flask import Flask, render_template, request, jsonify
from utils import predict_survival
import os

# Configure Flask paths
app = Flask(
    __name__,
    static_folder='static',
    template_folder='templates'
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        prediction, prob = predict_survival(data)
        return jsonify({'prediction': prediction, 'probability': prob})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
