# scan-port-cli

Scan localhost hosts listening on a specific port

[![npm Package Version](https://img.shields.io/npm/v/scan-port-cli)](https://www.npmjs.com/package/scan-port-cli)

## Installation (optional)

Install as global package:

```shell
npm install --global scan-port-cli
```

## Usage

Using global package

```shell
scan-port-cli [options]
```

Or using with npx without installation:

```shell
npx scan-port-cli [options]
```

## Cli Options

The following options can be used in any order:

```shell
-h, --help     : show help message
-p, --port     : specify port number, default is 8080
-i, --interval : specify scan interval, default is 3000 (3 seconds)
```

## Usage Example

Scan port with default settings:

```shell
scan-port-cli
```

Scan port 3000:

```shell
scan-port-cli --port 3000
```

Scan every 2 seconds:

```shell
scan-port-cli --interval 2000
```

or using unit (s for seconds, m for minutes):

```shell
scan-port-cli --interval 2s
```

Combine all settings:

```shell
scan-port-cli --port 3000 --interval 2s
```

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
