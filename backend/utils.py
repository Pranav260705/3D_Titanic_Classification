# utils.py – Handle prediction logic
import joblib
import numpy as np
import os

# Load model once at startup
model_path = os.path.join(os.path.dirname(__file__), '..', 'model', 'titanic_model.pkl')
model = joblib.load(model_path)

def predict_survival(data):
    """
    Predict survival using input dict.
    Keys: Pclass, Sex, Age, SibSp, Parch, Fare, Embarked
    Returns: prediction (0 or 1), probability of survival
    """
    try:
        # Prepare input for model
        sex = 1 if data['Sex'] == 'male' else 0
        embarked_map = {'C': 0, 'Q': 1, 'S': 2}
        embarked = embarked_map.get(data['Embarked'], 2)  # Default to 'S'

        features = np.array([[
            int(data['Pclass']),
            sex,
            float(data['Age']),
            int(data['SibSp']),
            int(data['Parch']),
            float(data['Fare']),
            embarked
        ]])

        prediction = model.predict(features)[0]
        probability = model.predict_proba(features)[0][1]

        return int(prediction), round(float(probability), 3)

    except Exception as e:
        print("❌ Prediction error:", e)
        return -1, 0.0
