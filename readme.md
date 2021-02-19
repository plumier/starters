# Plumier Project Starters

[![Build Status](https://github.com/plumier/starters/workflows/ubuntu/badge.svg)](https://github.com/plumier/starters/actions?query=workflow%3Aubuntu)

List of plumier project starters

| Name                | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `blank`             | Plumier blank project, contains basic TypeScript Node.js project setup |
| `rest-api-typeorm`  | Basic Plumier rest api project setup with TypeORM as data access       |
| `rest-api-mongoose` | Basic Plumier rest api project setup with Mongoose as data access      |

## Usage 

Use [degit](https://www.npmjs.com/package/degit) to download the project to your local dev 

```
npx degit plumier/starters/<starter name> <target directory>
```

For example 

```
npx degit plumier/starters/rest-api-mongoose my-cool-api
```

If you are getting issue with `NPX` you can install degit globally then run degit manually like below 

```
npm install -g degit
degit plumier/starters/<starter name> <target directory>
```
