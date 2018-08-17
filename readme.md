# Data Explorer

> Visualising the vast datasets from the ABS, UNESCO, UKDS and OECD. We aim to make public data as accessible as possible.

https://dataexplorer.io

## Background

Data Explorer was one of five projects chosen to receive funding from the Walkley Media Incubator and Innovation Fund in 2017. The project was awarded the Innovation in Data prize, with funding of $10,000 sponsored by iSentia. Funding will go towards website hosting, UX research, design and development.

This project is lead by Kaho Cheung, a developer with a deep interest in data and interaction design. He works part-time on Data Explorer while working his day job as the Tech Lead for the State Library of NSW’s DX Lab innovation team.

Data Explorer is currently under active development. We will be posting updates, asking for feedback and conducting beta testing from our Twitter account - [@dataexplorerio](https://twitter.com/dataexplorerio).

Read more [here](https://dataexplorer.io/about)

## Installation

This repo is for mainly for reference purposes. If you are interested in installing locally, just git clone and run `npm install`.

Make sure you have a .env file which contains:

```
PORT=3000
BASE_URL=https://localhost:3000
GRAPHQL_URL=https://api.dataexplorer.io
```

## Technology

At the heart of Data Explorer is the SDMX REST API standard used by several international statistical organisations. Due to this common format, Data Explorer is able to tap into data from the following organisations:

- ABS
- OECD
- UKDS
- UNESCO

For the Data Explorer application, we are using Node.js to serve an isomorphic (aka universal) Javascript application, using React and Next.js.

Sitting between this frontend application and the SDMX data is a powerful GraphQL server. While SDMX data requests are live, we do store some data using Prisma's GraphQL service.

The charts are built using a React library called Victory. For hosting, we are using Zeit’s serverless service.
