# integration-decryption

This repo contains a simple Node.js script to decrypt integration properties on a production node.

## Installation

1. SSH onto a production node
2. Cd into or create `/home/ubuntu/engineering-support`
3. Clone the repo into the `engineering-support` folder

```bash
cd engineering-support/ && git clone git@github.com:vtseverettmorgan/integration-decryption.git
```

## Usage

You can either pass a string or object to decrypt. The script will not recurse through the object and will only target first level properties.

NOTE: all of the below encrypted strings are invalid and will not yield an actual value. Use different values when testing on your own.

### Pass a string to decrypt
```bash
node decrypt.js U2FsdGVkX1/qQP59E6vcGnMmA1NgcmcI=
// <decrypted-string>
```

### Pass an object to decrypt
```bash
node decrypt.js '{"user_name": "U2FsdGVkX1/W9KsS3BzOTfyEumehGyoJ0JsXo=", "password": "U2FsdGVkX1/KnMK/FVB6FayZHyAxLtlzX0Wur4=", "server_name": "U2FsdGVkSN4UqQCqvOpvTVan/TeZnEFuTfk=", "database": "U2FsdGVkX1+R/48B14EKNx90+snYXMU=", "resident_url": "U2FsdGVkX18i0d0OgIUNorZuxaHYUu5nq0bdUL+URDSvqJC61TggiKrM3lPTICB7rip3nqwx9MEPPXyVTnKfNOrM2uw+4DBfUCb0ro7", "service_url": "U2FsdGVkX19UAXb6sb80cVYeZ6AhG9NwUrAEQcOiSG4GtcMHdToXchv80PtmyO/omzbfv55ChV4sbDDBYMQSDnFO2NYQ46UDgsIWTthNz"}'
// {"user_name": "<decrypted-string>", "password": "<decrypted-string>", "server_name": "<decrypted-string>", "database": "<decrypted-string>", "resident_url": "<decrypted-string>", "service_url": "<decrypted-string>"}
```