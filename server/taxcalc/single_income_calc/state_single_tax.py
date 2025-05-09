import pandas as pd
from typing import Optional
from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path


# Mapping from full state names to abbreviated names in the dataset
STATE_NAME_MAP = {
    'Alabama': 'Ala.',
    'Alaska': 'Alaska',
    'Arizona': 'Ariz. (e, f, u)',
    'Arkansas': 'Ark.',
    'California': 'Calif.',
    'Colorado': 'Colo. (a, o)',
    'Connecticut': 'Conn.',
    'Delaware': 'Del.',
    'Florida': 'Fla.',
    'Georgia': 'Ga.',
    'Hawaii': 'Hawaii',
    'Idaho': 'Idaho (j, m, u)',
    'Illinois': 'Ill. (d, m, v)',
    'Indiana': 'Ind. (a, m, w)',
    'Iowa': 'Iowa',
    'Kansas': 'Kans.',
    'Kentucky': 'Ky.',
    'Louisiana': 'La.',
    'Maine': 'Maine',
    'Maryland': 'Md.',
    'Massachusetts': 'Mass. (bb, rr)',
    'Michigan': 'Mich. (a, d)',
    'Minnesota': 'Minn.',
    'Mississippi': 'Miss.',
    'Missouri': 'Mo.',
    'Montana': 'Mont.',
    'Nebraska': 'Nebr.',
    'Nevada': 'Nev.',
    'New Hampshire': 'N.H.',
    'New Jersey': 'N.J.',
    'New Mexico': 'N.M.',
    'New York': 'N.Y.',
    'North Carolina': 'N.C.',
    'North Dakota': 'N.D.',
    'Ohio': 'Ohio',
    'Oklahoma': 'Okla.',
    'Oregon': 'Ore.',
    'Pennsylvania': 'Pa. (a)',
    'Rhode Island': 'R.I.',
    'South Carolina': 'S.C.',
    'South Dakota': 'S.D.',
    'Tennessee': 'Tenn.',
    'Texas': 'Tex.',
    'Utah': 'Utah (d, h, gg, ll)',
    'Vermont': 'Vt.',
    'Virginia': 'Va.',
    'Washington': 'Wash. (n, ss)',
    'West Virginia': 'W.Va.',
    'Wisconsin': 'Wis.',
    'Wyoming': 'Wyo.',
    'District of Columbia': 'D.C.'
}

# === Load CSV data path ===
DATA_PATH = Path(__file__).parent / "state_income_tax_2025.csv"


# === Core logic ===
def load_tax_data():
    df = pd.read_csv(DATA_PATH)
    df['state'] = (
        df['Unnamed: 0']
          .ffill()
          .str.replace(r"\s*\(.*$", "", regex=True)
          .str.strip()
    )
    return df

def get_state_tax_info(df: pd.DataFrame, state_name: str) -> pd.DataFrame:
    short_name = STATE_NAME_MAP.get(state_name)
    if not short_name:
        raise ValueError(f"Unknown state name: {state_name}")
    mask = df['state'].str.strip().str.lower() == short_name.lower()
    return df.loc[mask].reset_index(drop=True)

# === Flask App ===
app = Flask(__name__)
CORS(app)

@app.route("/api/state-tax", methods=["GET"])
def calculate_tax():
    try:
        state = request.args.get("state")
        if not state:
            return jsonify({"error": "Missing 'state' query parameter"}), 400

        df = load_tax_data()
        result = get_state_tax_info(df, state)
        return jsonify(result.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500



