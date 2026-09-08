---
title: Encryption
slug: 'overview/encryption'
---


Many [Keboola components](/overview/) use the Encryption API to encrypt sensitive values
intended for secure storage. These values are then decrypted within the component itself. 
This process ensures that the encrypted values are only accessible inside the components and not
by API users. Additionally, no decryption API is available, meaning end-users cannot decrypt
these values.

Decryption occurs solely during the serialization of configuration to the Docker container's 
configuration file. The decrypted data are stored on the Docker host drive and are promptly 
deleted after the container's completion. The component code exclusively accesses the decrypted data.

## UI Interaction
When saving arbitrary configuration data, if a key is prefixed with the `#` character, the associated value is automatically encrypted.
For instance, consider the following configuration:

![Screenshot - Configuration editor - before](/overview/encryption-1.png)

After saving, the configuration appears as follows:

![Screenshot - Configuration editor - after](/overview/encryption-2.png)

Once saved, the value becomes encrypted and irreversible. The component defines which values are
encrypted, indicating that not all values can be encrypted unless explicitly supported by the component.

For example, a component requiring the following configuration:

```json
{
    "username": "JohnDoe",
    "#password": "password"
}
```

indicates that the password will be encrypted while the username will not. Adding a
prefix `#` to `username` is ineffective, as the component does not recognize such a key,
even though its value would be encrypted and decrypted normally. Internally, the
[Encryption API](#encrypting-data-with-api) encrypts these values before saving.

### UI Configuration Adjustment
The UI prioritizes encrypted values over plain ones. If both `password` and `#password` are provided, only `#password` will be retained.
Consequently, this configuration:

```json
{
    "username": "JohnDoe",
    "#password": "KBC::ProjectSecure::ENCODEDSTRING",
    "password": "secret",
}
```

will be transformed to:

```json
{
    "username": "JohnDoe",
    "#password": "KBC::ProjectSecure::ENCODEDSTRING"
}
```

## Encrypting Data with API
The [Encryption API](https://api.keboola.com/?service=encryption#post-/encrypt) can handle
both strings and arbitrary JSON data. For strings, the entire string is encrypted. In JSON data,
only scalar keys starting with `#` are encrypted. For example, encrypting the following:

```json
{
    "foo": "bar",
    "#encryptMe": "secret",
    "#encryptMeToo": {
        "another": "secret"
    }
}
```

results in:

```json
{
    "foo": "bar",
    "#encryptMe": "KBC::ProjectSecure::ENCODEDSTRING",
    "#encryptMeToo": {
        "another": "secret"
    }
}
```

To encrypt a single string, such as a password, submit the text string for encryption
(no JSON or quotation is used). For example, encrypting

    mySecretPassword

yields

    KBC::ProjectSecure::ENCODEDSTRING

The `Content-Type` header in the request differentiates whether the body is treated as a string (`text/plain`) or JSON (`application/json`).

### Encryption Parameters
The Encryption API accepts the following **optional** parameters:

- `componentId` --- ID of a [Keboola component](/extend/component/tutorial/#creating-a-component),
- `projectId` --- ID of a Keboola project,
- `configId` --- ID of a component configuration, and
- `branchType` --- Branch type --- either `default` (meaning the default production branch) or `dev` (meaning any development branch other than the production).

The cipher created depends on the provided parameters:

- With only `componentId`, the cipher starts with `KBC::ComponentSecure::` and is decryptable
across all configurations of that component. This is recommended for **component-specific secrets** 
applicable across all customers (e.g., as a master authorization token).

- Adding `projectId` to the `componentId` changes the prefix to `KBC::ProjectSecure::`, making the cipher decryptable within
the project's component configurations. This is recommended for **all secrets** used within a typical Keboola project.

- Providing all three IDs (`componentId`, `projectId`, `configId`) generates a cipher starting with
`KBC::ConfigSecure::`, limiting decryption to a specific configuration. This is useful for preventing the copying of configurations.

- Using only `projectId` yields a cipher that begins with `KBC::ProjectWideSecure::`, decryptable across the project's configurations.
This cipher type helps encrypt information shared across multiple components, e.g., SSH tunnel settings.

- Adding `branchType` restricts the encryption to the default production branch or to development branches. This means an encrypted value with this setting cannot be moved between production and development branches or vice versa. It is not possible to encrypt a value for just one development branch.

	- Using `branchType` with `componentId` and `projectId` results in a cipher beginning with `KBC::BranchTypeSecure::`. This allows decryption either in the production or in the development configuration of the specified component in the project.

	- Using `branchType` with all three IDs  (`componentId`, `projectId`, `configId`) creates a cipher that starts with `KBC::BranchTypeConfigSecure::`. It can only be decrypted within a specific production or development component configuration in a specific project. 

	- Using `branchType` with `projectId` creates a cipher beginning with `KBC::ProjectWideBranchTypeSecure::`. This cipher allows decryption either in the production or in the development configurations in the project. 

The following rules apply to all ciphers:

- Providing only a `configId` without a `projectId` is not allowed. Similarly, providing only `branchType` without `projectId` is also not allowed.
- Cipher decryption is only possible in the [region](/overview/api/#regions-and-endpoints) where the cipher was created. For example, ciphers with prefixes `KBC::ProjectSecureKV::` (Azure) or `KBC::ProjectSecureGKMS::` (GCP), instead of `KBC::ProjectSecure::` (AWS), use the same business logic but are specific to their region and technology and are not interchangeable.
- There is no decryption API; the cipher is decrypted internally before a component is run.
- Ciphering a value that is already encrypted does not change its encryption.
- There is no way to retrieve the component, project, configuration ID, or branch type from the cipher.
- The IDs referenced during cipher creation do not need to exist then. For example, you can create a cipher for a component not yet registered, which will start working as soon as the component is registered. Similarly, ciphers can be created for projects and configurations without access to them.

By default, values encrypted in component configurations are encrypted using the `KBC::ProjectSecure::` cipher, meaning
the cipher is not transferable between regions, components, or projects. It is transferable between 
different configurations of the same component within the project where it was created. If you create a configuration containing `KBC::ConfigSecure::` ciphers, 
note that the configuration will not work when copied.
