FROM node:20-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

COPY routes ./routes
COPY models ./models
COPY db.js ./
COPY index.js ./

USER node

CMD ["node", "index.js"]
