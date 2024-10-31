---
title: Data Apps General Design Guide
permalink: /components/data-apps/general-design-guide/
---

* TOC
{:toc}

This guide helps you quickly create a user-friendly data app in Keboola, covering essentials like theming, headers, storage integration, and more.

With clear, step-by-step instructions for setting up caching, applying themes, and ensuring data security, you’ll be able to build an intuitive 
and visually appealing app. 

## Theming
There are two ways to set theming:

Set theming directly in the Keboola Data Apps interface, where you can choose either a predefined or custom theme. See more in Keboola's [documentation](https://help.keboola.com/).

Use the settings in the `config.toml` file, located in the `.streamlit` folder.

{: .image-popup}
![Screenshot - Streamlit Folder](/components/data-apps/general-design-guide/pic1.png)

```
[theme]
font="sans serif"
textColor="#222529"
backgroundColor="#ffffff"
base="light"
primaryColor="#1f8fff"
secondaryBackgroundColor="#edf0f5"
```

## Header

### Logo

Store the logo PNG image in the `/static/` repository folder (the app folder is created automatically upon deployment in Keboola).

```
LOGO_IMAGE_PATH = os.path.abspath("./app/static/keboola.png")
```

Position the logo on the left and disable the full-screen view for the image.

```
st.image(LOGO_IMAGE_PATH)
hide_img_fs = '''
        <style>
        button[title="View fullscreen"]{
            visibility: hidden;}
        </style>
        '''
st.markdown(hide_img_fs, unsafe_allow_html=True)
```

## Body

### Set Up Caches

Set the `ttl` based on your app's needs.

```
# Fetching data 
@st.cache_data(ttl=7200,show_spinner=False)
```

### Info Panel

{: .image-popup}
![Screenshot - Info Panel](/components/data-apps/general-design-guide/pic2.png)

Use `st.info` to provide additional information.

```
st.info('Select the table you want to edit. If the data is not up-to-data, click on the Reload Data button. Data freshness is displayed in the right corner.', icon="ℹ️")
```

### Hide Anchor Links

Hide anchor links if not needed.

```
def hide_custom_anchor_link():
    st.markdown(
        """
        <style>
            /* Hide anchors directly inside custom HTML headers */
            h1 > a, h2 > a, h3 > a, h4 > a, h5 > a, h6 > a {
                display: none !important;
            }
            /* If the above doesn't work, it may be necessary to target by attribute if Streamlit adds them dynamically */
            [data-testid="stMarkdown"] h1 a, [data-testid="stMarkdown"] h3 a,[data-testid="stMarkdown"] h5 a,[data-testid="stMarkdown"] h2 a {
                display: none !important;
            }
        </style>
        """,
        unsafe_allow_html=True,
    )
```

### Use st.expander
Use `st.expander` to keep your app simple and clean, with additional information inside.

```
# Expander with info about table
with st.expander("Table Info"):
    # Code continues …
```

### Primary Buttons
Use the code below for primary buttons; secondary buttons can be simple `st.buttons`.

{: .image-popup}
![Screenshot - Save Data](/components/data-apps/general-design-guide/pic3.png)

```
def ChangeButtonColour(widget_label, font_color, background_color, border_color):
    htmlstr = f"""
        <script>
            var elements = window.parent.document.querySelectorAll('button');
            for (var i = 0; i < elements.length; ++i) {{ 
                if (elements[i].innerText == '{widget_label}') {{ 
                    elements[i].style.color ='{font_color}';
                    elements[i].style.background = '{background_color}';
                    elements[i].style.borderColor = '{border_color}';
                }}
            }}
        </script>
        """
    components.html(f"{htmlstr}", height=0, width=0)
```

**Example**
```
ChangeButtonColour('Save Data', '#FFFFFF', '#1EC71E','#1EC71E')
```

## Footer
Use the code below for the footer section. Customize it as needed.

Here is an example of what a footer could look like. You can write whatever you want there.

{: .image-popup}
![Screenshot - Footer](/components/data-apps/general-design-guide/pic4.png)

```
def display_footer_section():
    # Inject custom CSS for alignment and style
    st.markdown("""
        <style>
            .footer {
                width: 100%;
                font-size: 14px;  /* Adjust font size as needed */
                color: #22252999;  /* Adjust text color as needed */
                padding: 10px 0;  /* Adjust padding as needed */
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .footer p {
                margin: 0;  /* Removes default margin for p elements */
                padding: 0;  /* Ensures no additional padding is applied */
            }
        </style>
        <div class="footer">
            <p>(c) Keboola 2024</p>
            <p>Version 2.0</p>
        </div>
        """, unsafe_allow_html=True)
```

## Keboola Storage Communication

### Authenticate Client

Environment variables `kbc_token` and `kbc_url` represent the project where the application is deployed. You do not need to specify them.
To map data from a different project, configure the appropriate secrets.

```
# Constants
kbc_token = os.environ.get('KBC_TOKEN')
kbc_url = os.environ.get('KBC_URL')
# Initialize Client
client = Client(kbc_url, kbc_token)
```

### Get Data from Keboola
```
def get_dataframe(table_name):
    table_detail = client.tables.detail(table_name)
    client.tables.export_to_file(table_id = table_name, path_name='')
    list = client.tables.list()
    with open('./' + table_detail['name'], mode='rt', encoding='utf-8') as in_file:
        lazy_lines = (line.replace('\0', '') for line in in_file)
        reader = csv.reader(lazy_lines, lineterminator='\n')
    if os.path.exists('data.csv'):
        os.remove('data.csv')
    else:
        print("The file does not exist")
    os.rename(table_detail['name'], 'data.csv')
    df = pd.read_csv('data.csv')
    return df
```

**Example**

Get a table from Keboola Storage.

```
if 'data' not in st.session_state:
        st.session_state['data'] = None
st.session_state['data'] = get_dataframe('in.c-bucketName.tableName')
```

### Write Data to Keboola
```
def write_to_keboola(data, table_name, table_path, incremental):
    # Write the DataFrame to a CSV file with compression
    data.to_csv(table_path, index=False, compression='gzip')
    # Load the CSV file into Keboola, updating existing records
    client.tables.load(
        table_id=table_name,
        file_path=table_path,
        is_incremental=incremental
    )
```

**Example**

Writing `edited_data` incrementally into Keboola Storage. Incremental writing is faster than full load.

```
write_to_keboola(edited_data, 'in.c-bucketName.tableName', f'updated_data.csv.gz', 1)
```
