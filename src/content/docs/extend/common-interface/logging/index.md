---
title: Logging Specification
slug: 'extend/common-interface/logging'
---


There are two main, mutually exclusive, ways in which your component can display events Keboola end-users:

1. Using [standard output and standard error](https://en.wikipedia.org/wiki/Standard_streams)
2. Using [Graylog GELF](http://docs.graylog.org/en/3.1/pages/gelf.html) compatible logger

Using the standard output option requires **no extra work** from you or your component.
You just print all informational messages to standard output and all error messages to standard error.
These will be forwarded to Storage Events as informational or error messages. See
[implementation notes](/extend/component/implementation/) for best practices in logging.

Using a [GELF](http://docs.graylog.org/en/3.1/pages/gelf.html) compatible logger requires implementing or including
such a logger in your component. However, it offers much **greater flexibility**: you can send different
kinds of messages (such as error, informational, warning, debug), and they can contain additional
structured information (not only a plain text string).

## Standard Output and Standard Error
By default -- unless you have turned on [GELF logging](/extend/common-interface/logging/#gelf-logger) in the
[component configuration](https://components.keboola.com/),
[Job Queue](/extend/job-queue/) listens to [STDOUT](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_.28stdout.29)
and [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29)
of the component and forwards the STDOUT content live to [Storage API Events](https://api.keboola.com/?service=storage#tag--Events)
(log level `info`). The content of STDERR is collected and added (if not empty) as the last event of the job with level `error`.
The events are displayed in a [Job detail](/management/jobs/).

The entire output from a component is filter for sensitive values. The [Job Queue](/extend/job-queue/)
keeps track of all encrypted values and if it encounters them in the component output, it replaces
them by `[hidden]` placeholder. This prevents accidental leaking of sensitive information for
example in exception traces.

## GELF Logger
[GELF](http://docs.graylog.org/en/3.1/pages/gelf.html) is a log format allowing you to
send [structured](http://docs.graylog.org/en/3.1/pages/gelf.html#gelf-payload-specification) event messages.
The messages can be sent over several transports and you can specify whether they will be silenced or displayed based on their level.

*Note: The size of the messages is limited. Sending a message larger than 200KB will cause the component job to fail.*

### Setting Up
If you turn on GELF logging in the [component configuration](https://components.keboola.com/),
our [Job Queue](/extend/job-queue/) will listen
for messages on the **transport** you specify ([UDP](https://en.wikipedia.org/wiki/User_Datagram_Protocol),
[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) and
[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) are supported).
We suggest using TCP as it offers a nice compromise between transport overhead and reliability, but the final choice is up to you.
If you choose UDP as a transport, make sure that there is a little delay between your component start
and the first message sent (about 1s) to give the network sockets some time to initialize.

Additionally, you can set the visibility of each event message as follows:

- `none` -- Message is ignored entirely.
- `camouflage` -- Generic error message is shown to the end-user instead of the real message content; the full message is logged internally.
- `normal` -- Event message (GELF `short_message` field) is shown to the end-user; the full message is logged internally.
- `verbose` -- Full message is shown to the user including GELF additional fields.

Default settings for message visibilities:

[Keboola Level](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-3-logger-interface.md#5-psrlogloglevel) | Gelf Log Method | [Syslog Level](https://en.wikipedia.org/wiki/Syslog#Severity_level) | Default Keboola Verbosity
100 | `debug()` | 7 | none
200 | `info()`  | 6 | normal
250 | `notice()` | 5 | normal
300 | `warning()` | 4 | normal
400 | `error()` | 3 | normal
500 | `critical()` | 2 | camouflage
550 | `alert()` | 1 | camouflage
600 | `emergency()` | 0 | camouflage

### Examples
Since GELF is sort of a standard format for structured logs, there are a [number of libraries](https://marketplace.graylog.org/addons?kind=gelf)
available for client implementation. The following examples show how to use the GELF logger in some common languages.
Always use the `KBC_LOGGER_ADDR` and `KBC_LOGGER_PORT` environment variables in your client,
which will be injected into your component by our Job Queue.

**Important:** Never rely on the default logger settings.

#### PHP
For PHP, use the official [GELF client](https://github.com/bzikarsky/gelf-php) library. To install it, use

    composer require graylog2/gelf-php

Then test that logging works with this simple script:

```php
<?php

require("vendor/autoload.php");

$transport = new Gelf\Transport\TcpTransport(getenv('KBC_LOGGER_ADDR'), getenv('KBC_LOGGER_PORT'));
$logger = new \Gelf\Logger($transport);

$logger->emergency("A sample emergency message", ["some" => ["structured" => "data"]]);
```

For other transports, use the
`UdpTransport` or `HttpTransport` class (AMQP transport is not supported yet). For additional examples on using the library,
see its [official documentation](https://github.com/bzikarsky/gelf-php).

#### Python
For Python, we strongly suggest using the prepared [Component package](/extend/component/implementation/python/#using-keboola-python-package) which takes care of the setup automatically.

If you want to set a GELF logger yourself, you need to choose from [a number of libraries](https://marketplace.graylog.org/addons?kind=gelf&tag=python) available. For example, the [logging-gelf library](https://pypi.org/project/logging-gelf/). To install it, use

    pip3 install logging_gelf

Then test that logging works with this simple script:

```python
import logging_gelf.handlers
import logging_gelf.formatters
import logging
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()
logging_gelf_handler = logging_gelf.handlers.GELFTCPSocketHandler(host=os.getenv('KBC_LOGGER_ADDR'), port=int(os.getenv('KBC_LOGGER_PORT')))
logging_gelf_handler.setFormatter(logging_gelf.formatters.GELFFormatter(null_character=True))
logger.addHandler(logging_gelf_handler)

# remove default logging to stdout
logger.removeHandler(logger.handlers[0])

logging.critical('A sample emergency message')
```

Due to the nature of Python logging, only [some error levels](https://docs.python.org/3.8/library/logging.html#logging-levels) are
permitted.

#### Node.js
There are a number of libraries available for [NodeJS](https://marketplace.graylog.org/addons?kind=gelf&tag=nodejs).
For example, the [GrayGelf library](https://github.com/wavded/graygelf).

    npm install graygelf

Then test that logging works with this simple script:

```js
var log = require('graygelf')({
  host: process.env.KBC_LOGGER_ADDR,
  port: process.env.KBC_LOGGER_PORT
})

log.info('hello', 'world')
log.info.a('short', 'full', { foo: 'bar' })
```

Note that the library supports only the UDP transport.
