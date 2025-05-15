# Titanic Classification and 3D Visualization Project

This project predicts passenger survival on the Titanic using a machine learning model and visualizes the ship with an interactive 3D model. Built during my CodeAlpha Internship, it combines data science with web development to create an engaging user experience.

## Features

- **Survival Prediction**: A Random Forest model predicts survival based on passenger features (e.g., Age, Gender, Pclass, Embarked).
- **Interactive 3D Visualization**: A `.glb` model of the Titanic, rendered with Three.js, supports camera rotation.
- **Web Interface**: Users can input passenger details via a web form and view survival predictions in real-time.
- **Accuracy**: Achieves ~80% accuracy on the test dataset.

## ⚙️ Tech Stack

- **Backend**: Flask (web server), scikit-learn (machine learning)
- **Frontend**: HTML, CSS, JavaScript, Three.js (3D rendering)
- **Machine Learning**: Random Forest Classifier (primary), Logistic Regression (baseline), explored XGBoost
- **Data**: Titanic dataset (`train.csv`, `test.csv`, `gender_submission.csv`)
- **Model Storage**: Pickle file (`titanic_model.pkl`)

## Project Structure

```
CodeAlpha_Titanic_Classification/
├── data/
│   ├── gender_submission.csv
│   ├── test.csv
│   └── train.csv
├── model/
│   └── titanic_model.pkl
├── backend/
│   ├── app.py              # Flask backend
│   ├── utils.py            # Prediction logic
│   ├── static/
│   │   ├── models/        # 3D model (.glb)
│   │   ├── style.css      # Frontend styling
│   │   └── script.js      # Frontend logic and Three.js
│   └── templates/
│       └── index.html     # Web interface
├── notebooks/
│   └── titanic_analysis.ipynb  # Data preprocessing and model training
├── README.md
├── requirements.txt
└── .gitignore
```

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd CodeAlpha_Titanic_Classification
   ```

2. **Install Dependencies**:
   Ensure Python 3.8+ is installed. Then, install required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. **Prepare the Dataset**:
   Place `train.csv`, `test.csv`, and `gender_submission.csv` in the `data/` folder. These can be sourced from Kaggle's Titanic dataset.

4. **Train the Model** (optional):
   Run `titanic_analysis.ipynb` to preprocess data and train the Random Forest model. The trained model is saved as `model/titanic_model.pkl`.

5. **Run the Application**:
   Start the Flask server:
   ```bash
   python backend/app.py
   ```
   Access the web interface at `http://localhost:5000`.

6. **Interact with the App**:
   - Enter passenger details (e.g., Pclass, Sex, Age, SibSp, Parch, Fare, Embarked) in the web form.
   - View the survival prediction and probability.
   - Explore the interactive 3D Titanic model with camera rotation.

## Machine Learning Workflow

1. **Data Cleaning**:
   - Filled missing `Age` values with the median.
   - Filled missing `Embarked` values with the mode.
2. **Feature Encoding**:
   - `Sex`: male=1, female=0
   - `Embarked`: C=0, Q=1, S=2
3. **Model Training**:
   - Used Random Forest Classifier (`n_estimators=100`, `random_state=42`).
   - Features: Pclass, Sex, Age, SibSp, Parch, Fare, Embarked.
4. **Evaluation**:
   - Achieved ~80% accuracy on the test set.

## Usage

- **Prediction**: Submit passenger data via the web interface to get survival predictions.
- **Visualization**: Rotate and explore the 3D Titanic model using mouse controls.
- **Exploration**: Review `titanic_analysis.ipynb` for detailed data analysis and model training steps.

## Future Improvements

- Enhance preprocessing with feature engineering (e.g., family size).
- Tune model hyperparameters or compare additional algorithms (e.g., XGBoost).
- Improve the frontend UI with better styling and interactivity.
- Add input validation and detailed error messages.
- Deploy the app using Docker or a cloud platform like Heroku.

## Acknowledgments

- Built as part of the CodeAlpha Internship.
- Dataset sourced from Kaggle's Titanic competition.
- 3D model rendering powered by Three.js.

Feel free to explore the code, contribute, or reach out for questions!