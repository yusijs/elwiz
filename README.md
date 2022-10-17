# Elwiz - Tibber pulse for local mqtt

## Getting started

First, rename apps/elwiz/src/assets/config_tmpl.yaml to config.yaml and update your settings

### Docker

There is a docker-image that can be used to get everything up and running, just run `docker build .` from repo-root.

### Running locally

* `npm install`
* `npm start`

## Background

The goal of this project over iotux' original repo is to modularize the code as much as possible, allowing everything to
run separately.
In addition I wanted to add some functionality (database etc), and simplify adding more features over time.

## Development

This project was built using nrwl/nx to simplify the package-structure & development.

## TODO:

In no particular order:

* Improve readme
* Add readme pr package
* More tests
* Support kamstrup AMS
* Priceloader needs more attention, not as stable atm. Look at using entsoe.eu API
* Add more data to list3, add pr-hour usage etc
