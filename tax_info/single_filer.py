import pandas as pd

# Simulate loading the cleaned CSV (you will replace this with your real file path)
csv_path = "state_income_tax_2025.csv"
df = pd.read_csv(csv_path)

# Forward-fill and normalize the state name
df['state'] = (
    df['Unnamed: 0']
      .ffill()
      .str.replace(r'\s*\(.*$', '', regex=True)
      .str.strip()
)

# Keep only relevant columns for Single Filer tax info
columns_of_interest = ['state', 'Single Filer', 'Unnamed: 2', 'Unnamed: 3']
df_single = df[columns_of_interest].copy()

# Rename columns for clarity
df_single.columns = ['state', 'rate', 'symbol', 'threshold']

# Drop rows that don't have a rate
df_single_clean = df_single.dropna(subset=['rate'])

# Group data by state and aggregate into lists of dicts
state_tax_json = (
    df_single_clean
    .groupby('state')
    .apply(lambda group: group[['rate', 'symbol', 'threshold']].to_dict(orient='records'))
    .to_dict()
)

state_tax_json_sample = dict(list(state_tax_json.items())[:5])  # Show sample only
import ace_tools as tools; tools.display_dataframe_to_user(name="Single Filer Tax Brackets (Sample)", dataframe=pd.DataFrame.from_dict(state_tax_json_sample, orient='index'))

