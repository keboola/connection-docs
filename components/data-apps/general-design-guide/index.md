---
title: Data Apps General Design Guide
permalink: /data-apps/general-design-guide/
redirect_from:
  - /components/data-apps/general-design-guide/
---

* TOC
{:toc}

This guide will help you quickly create a user-friendly data app in Keboola. We cover essentials like theming, headers, storage integration, 
and more to streamline your setup. With clear, step-by-step instructions, you'll be able to build an intuitive, visually appealing app. 

## Theming
There are two options for setting theming:

1. **Keboola Data Apps Interface:** Choose from predefined or custom themes directly in the Keboola interface. See more in [the documentation](/data-apps/#theming).
2. **Configuration File:** Use the settings in the `config.toml` file, located in the `.streamlit` folder.

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

Store the logo PNG image in the `/static/` repository folder (created automatically upon deployment in Keboola).

```
LOGO_IMAGE_PATH = os.path.join(os.path.dirname(__file__), 'static/keboola.png"')
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

Set the `ttl` parameter based on your app's needs.

```
# Fetching data 
@st.cache_data(ttl=7200,show_spinner=False)
```

### Info Panel

<div class="alert alert-info" markdown="1">
<strong>Tip:</strong> Select the table you want to edit. If the data is not up to date, click the <strong>Reload Data</strong> button. The data freshness is displayed in the right corner.
</div>

Use `st.info` to provide helpful context or instructions to users.

```
st.info('Select the table you want to edit. If the data is not up to date, click the Reload Data button. The data freshness is displayed in the right corner.', icon="ℹ️")
```

### Hide Anchor Links

To hide anchor links, add this function.

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
Use the following code for primary buttons; secondary buttons can be simple `st.buttons`.

{: .image-popup}
![Screenshot - Save Data](/components/data-apps/general-design-guide/pic3.png)

```
{% raw %}
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
{% endraw %}
```

**Example**
```
ChangeButtonColour('Save Data', '#FFFFFF', '#1EC71E','#1EC71E')
```

## Footer
Here is an example of what a footer could look like.

{: .image-popup}
![Screenshot - Footer](/components/data-apps/general-design-guide/pic4.png)

Customize the footer with the code below.

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

Keboola offers multiple methods to interact with Storage. For simpler data access, consider using the "keboola-streamlit" package. Install it with:

    pip install keboola-streamlit

Then, initialize your client in your Streamlit app:

    import streamlit as st
    from keboola_streamlit import KeboolaStreamlit
    
    TOKEN = os.environ.get('KBC_TOKEN')
    URL = os.environ.get('KBC_URL')
    keboola = KeboolaStreamlit(root_url=URL, token=TOKEN)

This package provides simple functions such as `keboola.read_table` and `keboola.write_table` to easily read and write data.

For users with read-only workspaces or data warehouses like Snowflake, you can also use Python connectors. For example, you might initialize a Snowflake session with:

    st.session_state['snowflake_session'] = keboola.snowflake_create_session_object()

And retrieve data with:

    df_snowflake = keboola.snowflake_read_table(session=st.session_state['snowflake_session'], table_id='YOUR_SNOWFLAKE_TABLE_ID')

For more details, visit the official KeboolaStreamlit repository on GitHub: [keboola/keboola_streamlit](https://github.com/keboola/keboola_streamlit).

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

### Retrieve Data from Keboola
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

Retrieve a table from Keboola Storage.

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

Write `edited_data` **incrementally** to Keboola Storage for faster updates. Incremental writing is faster than full load.

```
write_to_keboola(edited_data, 'in.c-bucketName.tableName', f'updated_data.csv.gz', 1)
```
