---
title: Building Data Apps with Keboola Storage
permalink: /ai/data-app-storage-guide/
---

* TOC
{:toc}

This guide explains how to create a Streamlit data app that reads tables from Keboola Storage, allows users to modify the content, and saves changes back using the Keboola API. This is a common pattern for building interactive data editing applications within the Keboola platform.

## Overview

[Data apps](/components/data-apps/) in Keboola provide a powerful way to create interactive web applications that work directly with your data stored in [Keboola Storage](/storage/). A typical use case is building a data editor that allows business users to view and modify table contents without needing direct access to the Keboola platform.

The workflow covered in this guide includes reading tables from a specific bucket, displaying the data in an editable interface, and writing modifications back to Storage using the Keboola Storage Python client.

## Prerequisites

Before building your data app, ensure you have the following:

**Storage API Token**: You need a Storage API token with appropriate permissions for the bucket(s) you want to access. You can create a token with limited scope in Project Settings under API Tokens. For security, create a dedicated token with only the necessary permissions (read/write access to specific buckets).

**Bucket with Tables**: Have at least one bucket with tables that you want to make accessible through the data app.

**Basic Python and Streamlit Knowledge**: Familiarity with Python programming and basic Streamlit concepts will help you customize the app.

## Setting Up the Data App

### Step 1: Create a New Data App

Navigate to Components in your Keboola project and select Data Apps. Click on Create Data App and choose either Code (for simple apps) or Git repository (for more complex applications).

For this guide, we'll use the Code deployment type, which allows you to paste Streamlit code directly into the configuration.

### Step 2: Access Storage Credentials

Data apps in Keboola automatically have access to Storage credentials through Streamlit secrets. The following secrets are available by default:

- `kbc_url` - The Keboola Storage API URL for your stack
- `kbc_token` - A Storage API token with access to your project

You do not need to configure these manually - they are automatically provisioned when the data app is deployed.

## Reading Tables from Storage

The Keboola Storage Python client (`kbcstorage`) is pre-installed in the data app environment. Here's how to read tables from a bucket:

### Initialize the Client

```python
import streamlit as st
from kbcstorage.client import Client
import pandas as pd
import csv
import os

# Get credentials from secrets
kbc_url = st.secrets["kbc_url"]
kbc_token = st.secrets["kbc_token"]

# Initialize the Storage client
client = Client(kbc_url, kbc_token)
```

### List Tables in a Bucket

To display available tables from a specific bucket or all accessible tables:

```python
def list_tables():
    """List all tables accessible with the current token."""
    all_tables = client.tables.list()
    tables_info = []
    for table in all_tables:
        tables_info.append({
            'table_id': table["id"],
            'name': table["displayName"],
            'bucket': table["bucket"]["id"],
            'rows': table["rowsCount"],
            'updated': table["lastImportDate"]
        })
    return pd.DataFrame(tables_info)

def list_bucket_tables(bucket_id):
    """List tables in a specific bucket."""
    tables = client.buckets.list_tables(bucket_id)
    return [table["id"] for table in tables]
```

### Read Table Data

To read the contents of a table into a pandas DataFrame:

```python
def read_table(table_id):
    """
    Read a table from Keboola Storage and return as DataFrame.
    
    Args:
        table_id: Full table ID (e.g., 'in.c-mybucket.mytable')
    
    Returns:
        pandas.DataFrame with the table contents
    """
    # Get table details
    table_detail = client.tables.detail(table_id)
    table_name = table_detail['name']
    
    # Export table to local file
    client.tables.export_to_file(table_id=table_id, path_name='')
    
    # Read the exported file
    with open('./' + table_name, mode='rt', encoding='utf-8') as in_file:
        # Handle null characters that might be in the data
        lazy_lines = (line.replace('\0', '') for line in in_file)
        reader = csv.reader(lazy_lines, lineterminator='\n')
    
    # Load into DataFrame
    df = pd.read_csv('./' + table_name)
    
    # Clean up the temporary file
    os.remove('./' + table_name)
    
    return df
```

## Displaying and Editing Data

Streamlit provides the `st.data_editor` component for creating interactive, editable data tables:

```python
# Page configuration
st.set_page_config(page_title="Data Editor", page_icon=":pencil:")

st.title("Keboola Data Editor")

# Initialize session state for storing data
if 'selected_table' not in st.session_state:
    st.session_state['selected_table'] = None
if 'data' not in st.session_state:
    st.session_state['data'] = None

# Table selection
tables_df = list_tables()
selected_table = st.selectbox(
    "Select a table to edit",
    options=tables_df['table_id'].tolist(),
    index=None,
    placeholder="Choose a table..."
)

# Load data when table is selected
if selected_table and selected_table != st.session_state['selected_table']:
    with st.spinner('Loading table data...'):
        st.session_state['selected_table'] = selected_table
        st.session_state['data'] = read_table(selected_table)

# Display editable data
if st.session_state['data'] is not None:
    st.subheader(f"Editing: {st.session_state['selected_table']}")
    
    # Show table info
    table_detail = client.tables.detail(st.session_state['selected_table'])
    with st.expander("Table Information"):
        st.write(f"**Primary Key:** {table_detail.get('primaryKey', 'None')}")
        st.write(f"**Rows:** {table_detail.get('rowsCount', 'N/A')}")
        st.write(f"**Last Updated:** {table_detail.get('lastImportDate', 'N/A')}")
    
    # Editable data grid
    edited_data = st.data_editor(
        st.session_state['data'],
        num_rows="dynamic",  # Allow adding/removing rows
        use_container_width=True,
        height=500
    )
```

## Writing Data Back to Storage

After users make changes, you can save the modified data back to Keboola Storage:

### Full Load (Replace All Data)

Use this when the table has no primary key or when you want to replace all data:

```python
def save_to_storage(data, table_id, is_incremental=False):
    """
    Save DataFrame to Keboola Storage.
    
    Args:
        data: pandas.DataFrame to save
        table_id: Full table ID (e.g., 'in.c-mybucket.mytable')
        is_incremental: If True, append/update data; if False, replace all data
    """
    # Save DataFrame to compressed CSV
    temp_file = 'temp_data.csv.gz'
    data.to_csv(temp_file, index=False, compression='gzip')
    
    # Upload to Keboola Storage
    client.tables.load(
        table_id=table_id,
        file_path=temp_file,
        is_incremental=is_incremental
    )
    
    # Clean up temporary file
    os.remove(temp_file)
```

### Incremental Load (Update Existing Records)

When the table has a primary key, you can use incremental loading to update only changed records:

```python
# Check if table has a primary key
table_detail = client.tables.detail(table_id)
has_primary_key = bool(table_detail.get('primaryKey'))

# Save with appropriate method
if has_primary_key:
    save_to_storage(edited_data, table_id, is_incremental=True)
else:
    save_to_storage(edited_data, table_id, is_incremental=False)
```

### Adding a Save Button

```python
if st.button("Save Changes", type="primary"):
    with st.spinner('Saving data to Keboola Storage...'):
        try:
            # Determine if incremental load is possible
            table_detail = client.tables.detail(st.session_state['selected_table'])
            is_incremental = bool(table_detail.get('primaryKey'))
            
            # Save the data
            save_to_storage(
                edited_data,
                st.session_state['selected_table'],
                is_incremental=is_incremental
            )
            
            st.success('Data saved successfully!')
            
            # Update session state with new data
            st.session_state['data'] = edited_data
            
        except Exception as e:
            st.error(f'Error saving data: {str(e)}')
```

## Complete Example Application

Here is a complete, working example that combines all the concepts above:

```python
import streamlit as st
from kbcstorage.client import Client
import pandas as pd
import csv
import os

# Page configuration
st.set_page_config(
    page_title="Keboola Data Editor",
    page_icon=":pencil:",
    layout="wide"
)

# Get credentials from secrets
kbc_url = st.secrets["kbc_url"]
kbc_token = st.secrets["kbc_token"]

# Initialize the Storage client
client = Client(kbc_url, kbc_token)

# Helper functions
@st.cache_data(ttl=60)
def list_tables():
    """List all accessible tables."""
    all_tables = client.tables.list()
    return [{'id': t["id"], 'name': t["displayName"]} for t in all_tables]

def read_table(table_id):
    """Read table contents into DataFrame."""
    table_detail = client.tables.detail(table_id)
    table_name = table_detail['name']
    
    client.tables.export_to_file(table_id=table_id, path_name='')
    df = pd.read_csv('./' + table_name)
    os.remove('./' + table_name)
    
    return df

def save_to_storage(data, table_id, is_incremental=False):
    """Save DataFrame to Keboola Storage."""
    temp_file = 'temp_data.csv.gz'
    data.to_csv(temp_file, index=False, compression='gzip')
    
    client.tables.load(
        table_id=table_id,
        file_path=temp_file,
        is_incremental=is_incremental
    )
    
    os.remove(temp_file)

# Initialize session state
if 'selected_table' not in st.session_state:
    st.session_state['selected_table'] = None
if 'data' not in st.session_state:
    st.session_state['data'] = None

# Main UI
st.title(":pencil: Keboola Data Editor")
st.markdown("Select a table from your Keboola Storage to view and edit its contents.")

# Sidebar for table selection
with st.sidebar:
    st.header("Table Selection")
    
    tables = list_tables()
    table_options = {t['name']: t['id'] for t in tables}
    
    selected_name = st.selectbox(
        "Choose a table",
        options=list(table_options.keys()),
        index=None,
        placeholder="Select a table..."
    )
    
    if selected_name:
        selected_id = table_options[selected_name]
        
        if st.button("Load Table", use_container_width=True):
            with st.spinner('Loading...'):
                st.session_state['selected_table'] = selected_id
                st.session_state['data'] = read_table(selected_id)
    
    if st.button("Refresh Table List", use_container_width=True):
        st.cache_data.clear()
        st.rerun()

# Main content area
if st.session_state['data'] is not None:
    st.subheader(f"Editing: {st.session_state['selected_table']}")
    
    # Table info
    table_detail = client.tables.detail(st.session_state['selected_table'])
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("Rows", table_detail.get('rowsCount', 'N/A'))
    with col2:
        pk = table_detail.get('primaryKey', [])
        st.metric("Primary Key", ', '.join(pk) if pk else 'None')
    with col3:
        st.metric("Last Updated", table_detail.get('lastImportDate', 'N/A')[:10])
    
    # Editable data grid
    edited_data = st.data_editor(
        st.session_state['data'],
        num_rows="dynamic",
        use_container_width=True,
        height=500
    )
    
    # Save button
    col1, col2 = st.columns([1, 4])
    with col1:
        if st.button("Save Changes", type="primary", use_container_width=True):
            with st.spinner('Saving...'):
                try:
                    is_incremental = bool(table_detail.get('primaryKey'))
                    save_to_storage(
                        edited_data,
                        st.session_state['selected_table'],
                        is_incremental=is_incremental
                    )
                    st.session_state['data'] = edited_data
                    st.success('Data saved successfully!')
                except Exception as e:
                    st.error(f'Error: {str(e)}')
else:
    st.info("Select a table from the sidebar to begin editing.")
```

## Working with Specific Buckets

If you want to restrict the app to tables from a specific bucket, modify the `list_tables` function:

```python
@st.cache_data(ttl=60)
def list_bucket_tables(bucket_id):
    """List tables from a specific bucket only."""
    tables = client.buckets.list_tables(bucket_id)
    return [{'id': t["id"], 'name': t["displayName"]} for t in tables]

# Usage
tables = list_bucket_tables('in.c-mybucket')
```

## Creating New Tables

You can also allow users to create new tables in a bucket:

```python
def create_table(bucket_id, table_name, data):
    """
    Create a new table in Keboola Storage.
    
    Args:
        bucket_id: Target bucket ID (e.g., 'in.c-mybucket')
        table_name: Name for the new table
        data: pandas.DataFrame with the initial data
    """
    temp_file = 'new_table.csv'
    data.to_csv(temp_file, index=False)
    
    client.tables.create(
        name=table_name,
        bucket_id=bucket_id,
        file_path=temp_file
    )
    
    os.remove(temp_file)
```

## Best Practices

**Token Security**: Always use tokens with minimal required permissions. Create a dedicated token for your data app that only has access to the specific buckets needed.

**Data Validation**: Implement validation before saving data to prevent invalid entries from being written to Storage.

**Error Handling**: Wrap Storage operations in try-except blocks to handle API errors gracefully and provide meaningful feedback to users.

**Caching**: Use Streamlit's `@st.cache_data` decorator to cache table listings and reduce API calls. Set an appropriate TTL (time-to-live) based on how frequently your data changes.

**Session State**: Use `st.session_state` to maintain data between Streamlit reruns and avoid unnecessary data reloading.

**Incremental Loading**: When tables have primary keys, use incremental loading to update only changed records rather than replacing all data.

## Troubleshooting

**Token Permission Errors**: If you receive permission errors, verify that your Storage API token has the necessary read/write permissions for the target buckets.

**Large Tables**: For very large tables, consider implementing pagination or filtering to avoid loading all data at once.

**Data Type Issues**: When saving data, ensure that boolean columns and other special data types are properly handled. The example code includes a helper function for casting boolean columns.

## Related Resources

For more information about data apps and the Keboola Storage API, see the following resources:

- [Data Apps Documentation](/components/data-apps/) - Complete guide to creating and deploying data apps
- [Storage API Tokens](/management/project/tokens/) - How to create and manage API tokens
- [Python Client Library](https://developers.keboola.com/integrate/storage/python-client/) - Full documentation of the kbcstorage client
- [Interactive Keboola Sheets Template](/templates/interactive-keboola-sheets/) - A ready-to-use template for data editing
