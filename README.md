# Adrenaline Box

**WORK IN PROGRESS**

This is a monorepo with workspaces managed by Yarn and built/deployed with [Zeit Now v2](https://zeit.co/docs).

 - `/www` frontend built with Next.js that will produce small lambdas for each page
 - `/server` backend that will produce lambdas for each API

### Requirements

- Node >= 8
- Now-cli `npm i -g now`
- Yarn `npm i -g yarn`

### Running locally

- Install all the node modules in the workspace with `yarn` (`npm` won't work)
- Run `now dev` and it will start the builder

`http://localhost:3000/checkout` and you can buy the Adrenaline Box
with a Stripe test card `4242 4242 4242 4242`

`http://localhost:3000/redeem` to register the Adrenaline Box and book.

## Run the tests

You need PostgreSQL running locally, i.e. with Docker
`docker run -p 5432:5432 --name adrenaline-box -e POSTGRES_PASSWORD=password -e POSTGRES_USER=user -d postgres`.

```
$ cd server
$ yarn test
```
