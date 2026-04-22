# Customer Churn Prediction Project

A beginner-friendly and runnable machine learning project using Python and scikit-learn.

## Features
- Load and preprocess customer data
- Train a churn prediction model
- Predict churn for a new customer
- Run a simple Streamlit UI

## Project Structure

```text
ml-churn-project/
├── app.py
├── predict.py
├── train_model.py
├── requirements.txt
├── README.md
├── model.pkl                # generated after training
└── data/
    └── churn_data.csv
```

## Problem Statement
This project predicts whether a customer is likely to leave a service based on:
- age
- monthly charges
- contract type
- tenure

## Machine Learning Workflow
1. Load the dataset using pandas
2. Separate input features and target column
3. Encode categorical features using `OneHotEncoder`
4. Split data into train and test sets
5. Train a `RandomForestClassifier`
6. Evaluate accuracy and save the model
7. Use the saved model for future prediction

## Files Explained

### `train_model.py`
Trains the model and saves it to `model.pkl`.

### `predict.py`
Loads the saved model and predicts churn for one sample customer.

### `app.py`
Runs a Streamlit web app for interactive churn prediction.

## Setup Instructions

### 1. Create a virtual environment (optional but recommended)

#### Windows
```bash
python -m venv venv
venv\Scripts\activate
```

#### Mac/Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Train the model
```bash
python train_model.py
```

This will create:
- `model.pkl`

### 4. Run prediction from command line
```bash
python predict.py
```

### 5. Run the Streamlit app
```bash
streamlit run app.py
```

## Sample Output
After training, you should see accuracy, confusion matrix, and classification report in the console.

## Example Prediction Logic
A customer with:
- Monthly contract
- Lower tenure
- Moderate charges

is often more likely to churn than a yearly customer with longer tenure.

## Concepts You Learn
- supervised learning
- classification
- preprocessing
- train/test split
- model persistence with `joblib`
- simple ML app deployment with Streamlit

## Future Improvements
- Use a larger real-world dataset
- Add charts and model explainability
- Deploy with FastAPI
- Add GitHub Actions
- Connect prediction API with Spring Boot

## Interview Summary
You can explain this project like this:

> I built a churn prediction project using Python, pandas, and scikit-learn. I used a preprocessing pipeline with one-hot encoding for categorical data and trained a Random Forest classifier. I evaluated the model on test data, saved it using joblib, and built a small Streamlit UI to make predictions interactively.
