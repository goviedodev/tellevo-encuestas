# Use an official Node.js runtime as a parent image (Alpine version for smaller size)
FROM node:20-alpine

LABEL maintainer="desarrollo@tellevoapp.cl"
LABEL description="Encuesta Movilidad Te LLevo App para Distrito V21"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if using npm)
# This step benefits from Docker layer caching if these files don't change often.
COPY package.json package-lock.json* ./

# Install project dependencies.
# We install all dependencies (including devDependencies) because 'npm run build'
# and 'npm run preview' (which often uses Vite) typically require them.
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Build the application for production
# This command should be defined in your package.json scripts.
RUN npm run build

# Expose the port that the Qwik/Vite preview server will run on.
# Vite's preview server typically defaults to port 3000.
EXPOSE 3000

# Command to run the application using the Qwik/Vite preview server.
# IMPORTANT: As per the Qwik documentation and your project's README.md,
# 'npm run preview' is intended for local previewing of production builds
# and is NOT recommended for actual production use.
# For a real production deployment, you should:
# 1. Integrate a production-ready server (e.g., using 'npm run qwik add express').
# 2. Update the CMD instruction below to start that server.
CMD ["npm", "run", "serve"]
