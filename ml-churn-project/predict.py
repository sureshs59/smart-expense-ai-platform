import joblib
import pandas as pd

MODEL_PATH = "model.pkl"


def main() -> None:
    model = joblib.load(MODEL_PATH)

    new_customer = pd.DataFrame(
        [
            {
                "age": 30,
                "monthly_charges": 62,
                "contract_type": "Monthly",
                "tenure": 9,
            }
        ]
    )

    prediction = int(model.predict(new_customer)[0])
    probability = model.predict_proba(new_customer)[0]

    print("New customer input:")
    print(new_customer)
    print("\nPrediction:", "Churn" if prediction == 1 else "No Churn")
    print("Probability [No Churn, Churn]:", probability)


if __name__ == "__main__":
    main()
