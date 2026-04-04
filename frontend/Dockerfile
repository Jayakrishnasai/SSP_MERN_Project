# Build Stage
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app


# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy only application source files
COPY src ./src
COPY public ./public
COPY nginx.conf ./nginx.conf
COPY tailwind.config.js ./

# Build the React app
RUN npm run build

# Production Stage — non-root Nginx for security
FROM nginxinc/nginx-unprivileged:alpine

#ENV REACT_APP_BACKEND_URL "http://43.204.142.222:30008/api/tasks"
# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build folder from previous stage to nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 8080 (unprivileged Nginx cannot bind to port 80)
EXPOSE 8080

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
