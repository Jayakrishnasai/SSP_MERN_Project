FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Set environment
ENV NODE_ENV=production

# Install dependencies first (better caching)
COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

# Copy all source code (safer)
COPY . .

# Change ownership to node user
RUN chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose app port (documentation purpose)
EXPOSE 3100

# Start app
CMD ["node", "index.js"]