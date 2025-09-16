# Titanic Classification and 3D Visualization Project

This project predicts passenger survival on the Titanic using a machine learning model and visualizes the ship with an interactive 3D model. it combines data science with web development to create an engaging user experience.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
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

