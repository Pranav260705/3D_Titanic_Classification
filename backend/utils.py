# utils.py - CORRECTED VERSION FOR final_modelVer1.pkl
import pickle
import numpy as np
import pandas as pd
import os
from sklearn.ensemble import RandomForestClassifier

# Global variables
model = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'final_modelVer1.pkl')

def extract_title(name):
    """Extract title from name"""
    title = name.split(',')[1].split('.')[0].strip()
    
    # Group rare titles
    if title in ['Don', 'Rev', 'Dr', 'Mme', 'Ms', 'Major', 'Lady', 'Sir', 'Mlle', 'Col', 'Capt', 'Countess', 'Jonkheer']:
        return 'Rare'
    elif title == 'Master':
        return 'Master'
    elif title in ['Miss', 'Mlle']:
        return 'Miss'
    elif title in ['Mr']:
        return 'Mr'
    elif title in ['Mrs', 'Mme']:
        return 'Mrs'
    else:
        return 'Mr'

def preprocess_input(data):
    """Preprocess input to match notebook feature engineering"""
    
    # Extract basic info
    pclass = int(data.get('Pclass', 3))
    sex = str(data.get('Sex', 'male')).lower()
    age = float(data.get('Age', 29))
    sibsp = int(data.get('SibSp', 0))
    parch = int(data.get('Parch', 0))
    fare = float(data.get('Fare', 32))
    embarked = str(data.get('Embarked', 'Southampton'))
    
    # Create a fake name for title extraction (since we don't have name in form)
    if sex == 'male':
        if age < 16:
            title = 'Master'
        else:
            title = 'Mr'
    else:  # female
        if age < 16:
            title = 'Miss'
        else:
            title = 'Mrs'
    
    # Sex encoding (0=male, 1=female)
    sex_code = 1 if sex == 'female' else 0
    
    # Embarked encoding
    embarked_map = {
        'Southampton': 0, 'S': 0, 's': 0,
        'Cherbourg': 1, 'C': 1, 'c': 1,
        'Queenstown': 2, 'Q': 2, 'q': 2
    }
    embarked_code = embarked_map.get(embarked, 0)
    
    # Title encoding
    title_map = {
        'Mr': 0, 'Miss': 1, 'Mrs': 2, 'Master': 3, 'Rare': 4
    }
    title_code = title_map.get(title, 0)
    
    # Family size
    family_size = sibsp + parch + 1
    
    # Age binning (based on your notebook bins)
    if age <= 16:
        age_bin_code = 0
    elif age <= 32:
        age_bin_code = 1  
    elif age <= 48:
        age_bin_code = 2
    elif age <= 64:
        age_bin_code = 3
    else:
        age_bin_code = 4
    
    # Fare binning (based on your notebook bins)
    if fare <= 7.0:
        fare_bin_code = 0
    elif fare <= 14.0:
        fare_bin_code = 1
    elif fare <= 31.0:
        fare_bin_code = 2
    else:
        fare_bin_code = 3
    
    # Return features in the exact order your model expects
    # ['Sex_Code', 'Pclass', 'Embarked_Code', 'Title_Code', 'FamilySize', 'AgeBin_Code', 'FareBin_Code']
    return [sex_code, pclass, embarked_code, title_code, family_size, age_bin_code, fare_bin_code]

def load_model():
    """Load the trained RandomForest model"""
    global model
    
    try:
        if os.path.exists(MODEL_PATH):
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            print("✅ RandomForest model loaded successfully from final_modelVer1.pkl")
        else:
            print(f"❌ Model file not found at {MODEL_PATH}")
            print("Please make sure you've run the notebook and created 'final_modelVer1.pkl'")
            
    except Exception as e:
        print(f"❌ Error loading model: {e}")

def predict_survival(data):
    """
    Predict survival using the trained RandomForest model
    """
    global model
    
    try:
        # Load model if not already loaded
        if model is None:
            load_model()
        
        if model is None:
            return -1, 0.0
        
        # Preprocess input data
        features = preprocess_input(data)
        
        # Convert to numpy array
        features_array = np.array([features])
        
        # Make prediction
        prediction = model.predict(features_array)[0]
        probability = model.predict_proba(features_array)[0][1]
        
        return int(prediction), round(float(probability), 3)
        
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return -1, 0.0

# Initialize model when module is imported
load_model()
