#!/usr/bin/env python3
"""Generate the Boolabean sample world for the Getting Started guide.

Boolabean is a fictional coffee chain — the name is a pun on Keboola + coffee bean,
in the same slot as dbt's jaffle_shop and Databricks' Wanderbricks. The schema is
deliberately mundane; the whimsy lives only in the product names.

Static half (shipped as CSVs the guide loads):
  stores.csv          6 cafés, real coordinates so a weather join works
  products.csv        18 items, prices in CZK
  sales.csv           daily units per store per product
  staffing.csv        who was rostered, per store per day
  weather_daily.csv   what the weather actually did — REAL observations from
                      open-meteo's archive API, per store per day

The live half is not shipped: the guide fetches tomorrow's forecast from
open-meteo at read time, which is what makes the scheduling step teach anything.

Sales are generated with a real dependency on the real weather, so the join
produces a genuine signal: iced drinks track temperature, hot drinks move against
it, and rain suppresses footfall — most sharply where a café has a terrace.
"""
import csv, json, math, urllib.request, pathlib, random

OUT = pathlib.Path('/private/tmp/claude-501/-Users-nikita/07f8e68e-3805-4474-a079-2875f59d3ff6/scratchpad/boolabean')
OUT.mkdir(parents=True, exist_ok=True)
START, END = '2026-06-01', '2026-08-31'
random.seed(20260903)  # deterministic: the guide quotes exact numbers

STORES = [
    # id, name, city, lat, lon, seats, terrace_seats, opened, footfall weight
    ('S01', 'Boolabean Vinohrady',  'Prague',   50.0755, 14.4426, 38, 24, '2019-04-02', 1.00),
    ('S02', 'Boolabean Zelný trh',  'Brno',     49.1928, 16.6083, 30, 18, '2020-09-14', 0.78),
    ('S03', 'Boolabean Stodolní',   'Ostrava',  49.8352, 18.2833, 26,  0, '2022-02-21', 0.55),
    ('S04', 'Boolabean Republiky',  'Plzeň',    49.7475, 13.3776, 22, 12, '2023-06-05', 0.47),
    ('S05', 'Boolabean Horní',      'Olomouc',  49.5938, 17.2509, 24, 14, '2024-03-18', 0.42),
    ('S06', 'Boolabean Soukenné',   'Liberec',  50.7663, 15.0562, 20,  0, '2025-05-26', 0.34),
]

# Whimsy lives here and nowhere else — the Metabase slot ("Lightweight Wool Computer").
# iced: 1 = sells better when it is hot, -1 = better when it is cold, 0 = weather-neutral
PRODUCTS = [
    ('P01', 'Filter of the Day',          'coffee', 79,  -1, 0.170),
    ('P02', 'Stubborn Espresso',          'coffee', 65,   0, 0.120),
    ('P03', 'Flat White, No Notes',       'coffee', 95,  -1, 0.115),
    ('P04', 'Iced Latte, Extremely Iced', 'coffee', 109,  1, 0.105),
    ('P05', 'Cold Brew, Patient',         'coffee', 115,  1, 0.070),
    ('P06', 'Cappuccino Classic',         'coffee', 89,  -1, 0.075),
    ('P07', 'Decaf, Genuinely',           'coffee', 85,   0, 0.022),
    ('P08', 'Matcha, Ceremonial-ish',     'other',  119,  1, 0.030),
    ('P09', 'Hot Chocolate, Serious',     'other',  99,  -1, 0.028),
    ('P10', 'Lemonade, Homemade',         'other',  75,   1, 0.045),
    ('P11', 'Poppy Seed Kolache',         'bakery', 55,   0, 0.055),
    ('P12', 'Apricot Kolache',            'bakery', 55,   0, 0.040),
    ('P13', 'Almond Croissant',           'bakery', 69,   0, 0.035),
    ('P14', 'Cinnamon Roll, Generous',    'bakery', 75,   0, 0.030),
    ('P15', 'Rye Sourdough Slice',        'bakery', 45,   0, 0.018),
    ('P16', 'Cheesecake, Baked',          'bakery', 89,   0, 0.020),
    ('P17', 'Ham & Cheese Toastie',       'food',   129,  0, 0.015),
    ('P18', 'Soup of the Morning',        'food',   109, -1, 0.007),
]

def fetch_weather(store_id):
    """Weather comes from files fetched with curl — python.org's interpreter on this
    machine has no CA bundle, so urllib cannot do TLS."""
    d = json.load(open(pathlib.Path(__file__).parent / 'wx' / f'{store_id}.json'))['daily']
    return list(zip(d['time'], d['temperature_2m_max'], d['precipitation_sum']))

weather = {}
for s in STORES:
    weather[s[0]] = fetch_weather(s[0])
    print(f'  {s[0]} {s[2]:<9} {len(weather[s[0]])} days of real weather')

# ---- weather_daily.csv -------------------------------------------------------
with open(OUT / 'weather_daily.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['date', 'store_id', 'temp_max_c', 'rain_mm'])
    for s in STORES:
        for day, t, r in weather[s[0]]:
            w.writerow([day, s[0], f'{t:.1f}', f'{r:.1f}'])

# ---- stores.csv / products.csv ----------------------------------------------
with open(OUT / 'stores.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['store_id', 'store_name', 'city', 'latitude', 'longitude', 'seats', 'terrace_seats', 'opened_on'])
    for sid, name, city, lat, lon, seats, terrace, opened, _wt in STORES:
        w.writerow([sid, name, city, lat, lon, seats, terrace, opened])

with open(OUT / 'products.csv', 'w', newline='') as f:
    w = csv.writer(f)
    w.writerow(['product_id', 'product_name', 'category', 'price_czk'])
    for pid, name, cat, price, _iced, _share in PRODUCTS:
        w.writerow([pid, name, cat, price])

# ---- sales.csv + staffing.csv ----------------------------------------------
import datetime
sales_rows = 0
with open(OUT / 'sales.csv', 'w', newline='') as fs, open(OUT / 'staffing.csv', 'w', newline='') as fst:
    ws, wst = csv.writer(fs), csv.writer(fst)
    ws.writerow(['date', 'store_id', 'product_id', 'units', 'revenue_czk'])
    wst.writerow(['date', 'store_id', 'staff_on_shift', 'labour_hours'])
    for s in STORES:
        sid, _n, _c, _la, _lo, seats, terrace, _op, weight = s
        # the roster is built once, from the store's typical week — the manager does not
        # know the weather when the rota goes up, which is the whole point of the guide
        planned = {}
        for dow_i in range(7):
            typical = 210 * weight * [0.86, 0.92, 0.96, 1.00, 1.12, 1.24, 1.05][dow_i]
            planned[dow_i] = max(2, min(7, int(round(typical / 62))))
        for day, temp, rain in weather[sid]:
            d = datetime.date.fromisoformat(day)
            dow = d.weekday()
            # a café's week: quiet Monday, busy weekend
            dow_factor = [0.86, 0.92, 0.96, 1.00, 1.12, 1.24, 1.05][dow]
            # rain hurts, and hurts more where the seats are outside
            terrace_share = terrace / max(seats + terrace, 1)
            rain_factor = 1.0 - min(rain, 12) / 12 * (0.08 + 0.62 * terrace_share)
            # warmth brings people out, but a heatwave keeps them home
            warm_factor = 1.0 + (temp - 21) * 0.011 - max(0, temp - 31) * 0.030
            base = 210 * weight * dow_factor * rain_factor * warm_factor
            covers = max(20, base * random.uniform(0.93, 1.07))
            for pid, _name, _cat, price, iced, share in PRODUCTS:
                # iced drinks track the temperature; hot ones move against it
                mix = 1.0 + iced * (temp - 21) * 0.038
                units = covers * share * max(0.15, mix) * random.uniform(0.88, 1.12)
                units = int(round(units))
                if units <= 0:
                    continue
                ws.writerow([day, sid, pid, units, units * price])
                sales_rows += 1
            staff = planned[dow]
            wst.writerow([day, sid, staff, staff * 8])

print(f'\n  sales rows: {sales_rows}')
for p in sorted(OUT.glob('*.csv')):
    n = sum(1 for _ in open(p)) - 1
    print(f'  {p.name:<20} {n:>6} rows  {p.stat().st_size/1024:.0f} kB')
