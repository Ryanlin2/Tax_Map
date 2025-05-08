import pandas as pd
from typing import Optional

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

def load_tax_data(csv_path: str) -> pd.DataFrame:
    """
    Load and preprocess the tax dataset from CSV.
    Adds a 'state' column with normalized state names.
    """
    df = pd.read_csv(csv_path)
    df['state'] = (
        df['Unnamed: 0']
          .ffill()
          .str.replace(r"\s*\(.*$", "", regex=True)
          .str.strip()
    )
    return df

def get_state_tax_info(df: pd.DataFrame, state_name: str) -> pd.DataFrame:
    """
    Return all tax rows for a given full state name.
    """
    short_name = STATE_NAME_MAP.get(state_name)
    if not short_name:
        raise ValueError(f"Unknown state name: {state_name}")

    mask = df['state'].str.strip().str.lower() == short_name.lower()
    return df.loc[mask].reset_index(drop=True)

def list_all_states() -> list:
    """
    Return a list of all available full state names.
    """
    return list(STATE_NAME_MAP.keys())
