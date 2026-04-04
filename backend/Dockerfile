FROM node:20-alpine

# Set the working directory inside the container to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the dependencies specified in package.json
RUN npm ci --ignore-scripts

# Copy only application source files (not secrets or config)
COPY routes ./routes
COPY models ./models
COPY db.js ./
COPY index.js ./

# Run as non-root user for security
USER node

# Specify the command to run the application
CMD ["node", "index.js"]
