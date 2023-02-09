FROM node:18

WORKDIR /app

COPY package.json package.json

RUN yarn

COPY . .

ENV RELAYER_ITERATION_INTERVAL=600000
ENV UPDATE_PRICE_INTERVAL=3600000
ENV RPC_URL=https://rpc.ankr.com/eth_goerli
ENV CHAIN_NAME="Goerli test network"
ENV CHAIN_ID=5
ENV PRIVATE_KEY=
ENV MANGER_CONTRACT_ADDRESS=0x2C787Db499BD7BF1f592D8DDd79ead9a72420763

RUN yarn build

CMD [ "yarn", "start" ]