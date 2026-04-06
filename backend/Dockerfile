FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV=production

# Install dependencies first (better caching)
COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

# Specifically copy only necessary folders and config to satisfy Sonar 100% bypass
COPY routes ./routes
COPY models ./models
COPY db.js ./
COPY index.js ./

# Sonar build guard ensuring no secrets leak AND change ownership
RUN test ! -f .env \
    && chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose app port (documentation purpose)
EXPOSE 3100

# Start app
CMD ["node", "index.js"]