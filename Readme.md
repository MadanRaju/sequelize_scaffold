# Scaffolding

> 

## About

A sample [Feathers](http://feathersjs.com) application. 

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [yarn](https://yarnpkg.com/lang/en/) installed.
2. Install your dependencies

    ```
    cd path/to/scaffolding; yarn install
    ```

3. Start your app

    ```
    yarn start
    ```

## Testing

Simply run `yarn test` and all your tests in the `test/` directory will be run.

## Scaffolding

Use the yarn scripts to generate services, hooks or models, migrations etc.
```
$ yarn g service                    # Generate a new Service
$ yarn g hook                       # Generate a new Hook
$ yarn g model                      # Generate a new Model
$ yarn g migration --name <name>    # Show all commands
```

## Commit

This app uses [husky](https://github.com/typicode/husky) to run pre-commit hooks.
```
$ git commit -m "your commit message"
```
will run the pre-commit hooks which include running eslint and all the tests.

## Help

For more information on all the things you can mail Madan Lokikere at madan.731993@gmail.com.

## Changelog

__0.0.1__

- Initial setup

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
