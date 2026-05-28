
import pandas as pd
import numpy as np

def convert_sqft_to_num(x):
    tokens = x.split('-')
    if len(tokens) == 2:
        return (float(tokens[0]) + float(tokens[1])) / 2
    try:
        return float(x)
    except:
        return None

def clean_data():
    print("Loading raw data...")
    df = pd.read_csv('Bengaluru_House_Data.csv')
    
   
    df1 = df.drop(['area_type', 'society', 'balcony', 'availability'], axis='columns')
    
    
    df2 = df1.dropna()
    
    # Fix BHK
    df2['bhk'] = df2['size'].apply(lambda x: int(x.split(' ')[0]))
    
    # Fix Total Sqft
    df2['total_sqft'] = df2['total_sqft'].apply(convert_sqft_to_num)
    df3 = df2.dropna() # Drop rows where sqft conversion failed
    
    # Price per sqft for outlier removal
    df3['price_per_sqft'] = df3['price'] * 100000 / df3['total_sqft']
    
    # Dimensionality Reduction for Location
    df3['location'] = df3['location'].apply(lambda x: x.strip())
    location_stats = df3.groupby('location')['location'].agg('count').sort_values(ascending=False)
    location_stats_less_than_10 = location_stats[location_stats <= 10]
    df3['location'] = df3['location'].apply(lambda x: 'other' if x in location_stats_less_than_10 else x)
    
    # Outlier Removal
    # 1. Square ft per BHK assumption (e.g. min 300 sqft per BHK)
    df4 = df3[~(df3.total_sqft / df3.bhk < 300)]
    
    # 2. Price per sqft outliers (Standard Deviation method)
    def remove_pps_outliers(df):
        df_out = pd.DataFrame()
        for key, subdf in df.groupby('location'):
            m = np.mean(subdf.price_per_sqft)
            st = np.std(subdf.price_per_sqft)
            reduced_df = subdf[(subdf.price_per_sqft > (m - st)) & (subdf.price_per_sqft <= (m + st))]
            df_out = pd.concat([df_out, reduced_df], ignore_index=True)
        return df_out
    
    df5 = remove_pps_outliers(df4)
    
    # 3. Bathroom outliers (e.g. Number of bathrooms > BHK + 2)
    df6 = df5[df5.bath < df5.bhk + 2]
    
    # Final cleanup
    df7 = df6.drop(['size', 'price_per_sqft'], axis='columns')
    
    print("Saving cleaned data...")
    print(f"Original shape: {df.shape}")
    print(f"Cleaned shape: {df7.shape}")
    print(f"Bath variance: {df7['bath'].var()}")
    
    df7.to_csv("Cleaned_data.csv", index=False)
    print("Done.")

if __name__ == "__main__":
    clean_data()
