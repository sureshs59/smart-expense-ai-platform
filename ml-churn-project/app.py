from pathlib import Path

import joblib
import pandas as pd
import streamlit as st

st.set_page_config(page_title="Customer Churn Predictor", page_icon="📉", layout="centered")

MODEL_PATH = Path("model.pkl")
DATA_PATH = Path("data/churn_data.csv")

st.title("📉 Customer Churn Prediction App")
st.write("Enter customer details and predict whether the customer is likely to churn.")

if not MODEL_PATH.exists():
    st.warning("Model file not found. Please run `python train_model.py` first.")
    st.stop()

model = joblib.load(MODEL_PATH)

with st.form("prediction_form"):
    age = st.number_input("Age", min_value=18, max_value=100, value=30)
    monthly_charges = st.number_input("Monthly Charges", min_value=0.0, value=62.0, step=1.0)
    contract_type = st.selectbox("Contract Type", ["Monthly", "Yearly"])
    tenure = st.number_input("Tenure (months)", min_value=0, max_value=120, value=9)
    submitted = st.form_submit_button("Predict")

if submitted:
    input_df = pd.DataFrame(
        [{
            "age": age,
            "monthly_charges": monthly_charges,
            "contract_type": contract_type,
            "tenure": tenure,
        }]
    )
    prediction = int(model.predict(input_df)[0])
    proba = model.predict_proba(input_df)[0]

    if prediction == 1:
        st.error(f"Prediction: Customer is likely to churn. Churn probability: {proba[1]:.2%}")
    else:
        st.success(f"Prediction: Customer is likely to stay. Stay probability: {proba[0]:.2%}")

st.subheader("Sample Dataset")
if DATA_PATH.exists():
    st.dataframe(pd.read_csv(DATA_PATH), use_container_width=True)
