---
title: Streamlit design guide
slug: 'data-apps/streamlit/design-guide'
description: Practical patterns for building a user-friendly Streamlit app in Keboola - theming, headers, body components, footers, and Storage communication.
redirect_from:
  - /components/data-apps/general-design-guide/
---



:::note[Streamlit apps only]
This page applies to [Streamlit](/data-apps/streamlit/) apps only. New apps run on [Python/JS](/data-apps/build-locally/).
:::

This guide will help you quickly create a user-friendly app in Keboola. We cover essentials like theming, headers, storage integration, and more to streamline your setup. With clear, step-by-step instructions, you'll be able to build an intuitive, visually appealing app.

## Theming
There are two options for setting theming:

1. **Keboola Apps interface:** Choose from predefined or custom themes directly in the Keboola interface. See more in [the documentation](/data-apps/streamlit/#theming).
2. **Configuration file:** Use the settings in the `config.toml` file, located in the `.streamlit` folder.

![Screenshot - Streamlit Folder](/data-apps/streamlit/design-guide-folder.png)

```toml
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

```python
LOGO_IMAGE_PATH = os.path.join(os.path.dirname(__file__), 'static/keboola.png')
```

Position the logo on the left and disable the full-screen view for the image.

```python
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

### Set up caches

Set the `ttl` parameter based on your app's needs.

```python
# Fetching data 
@st.cache_data(ttl=7200,show_spinner=False)
```

### Info panel

:::note
**Tip:** Select the table you want to edit. If the data is not up to date, click the **Reload Data** button. The data freshness is displayed in the right corner.
:::

Use `st.info` to provide helpful context or instructions to users.

```python
st.info('Select the table you want to edit. If the data is not up to date, click the Reload Data button. The data freshness is displayed in the right corner.', icon="ℹ️")
```

### Hide anchor links

To hide anchor links, add this function.

```python
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

```python
# Expander with info about table
with st.expander("Table Info"):
    # Code continues …
```

### Primary buttons
Use the following code for primary buttons; secondary buttons can be simple `st.buttons`.

![Screenshot - Save Data](/data-apps/streamlit/design-guide-save-button.png)

```python

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
```python
ChangeButtonColour('Save Data', '#FFFFFF', '#1EC71E','#1EC71E')
```

## Footer
Here is an example of what a footer could look like.

![Screenshot - Footer](/data-apps/streamlit/design-guide-footer.png)

Customize the footer with the code below.

```python
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

## Keboola Storage communication

Keboola offers multiple methods to interact with Storage. For simpler data access, consider using the "keboola-streamlit" package. Install it with:

    pip install keboola-streamlit

Then, initialize your client in your Streamlit app:

    import streamlit as st
    from keboola_streamlit import KeboolaStreamlit
    
    TOKEN = os.environ.get('KBC_TOKEN')
    URL = os.environ.get('KBC_URL')
    keboola = KeboolaStreamlit(root_url=URL, token=TOKEN)

This package provides simple functions such as `keboola.read_table` and `keboola.write_table` to easily read and write data. For read-only workspaces or Snowflake, it also exposes helpers like `keboola.snowflake_create_session_object()` and `keboola.snowflake_read_table(...)`. For details, see [keboola/keboola_streamlit](https://github.com/keboola/keboola_streamlit).

For the general ways an app reads and writes Storage data — Input Mapping, the Storage API at runtime, and real-time Storage Access — see [Data access](/data-apps/reference/#data-access) in the reference.
