# Libraries Export
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Load dataset
df = pd.read_csv('../data/train.csv')

# Preprocessing
df['Age'].fillna(df['Age'].median(), inplace=True)
df['Embarked'].fillna(df['Embarked'].mode()[0], inplace=True)

# Encode 'Sex' and 'Embarked'
df['Sex'] = LabelEncoder().fit_transform(df['Sex'])  # male=1, female=0
df['Embarked'] = LabelEncoder().fit_transform(df['Embarked'])  # C=0, Q=1, S=2

# Features and target
features = ['Pclass', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked']
X = df[features]
y = df['Survived']

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

# Save model
os.makedirs('../model', exist_ok=True)
joblib.dump(model, '../model/titanic_model.pkl')

print("✅ Model saved to '../model/titanic_model.pkl'")
