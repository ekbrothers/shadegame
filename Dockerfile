# Stage 1: Build the React frontend
FROM node:16 as build-stage
WORKDIR /app
COPY shadegame-frontend/package*.json ./shadegame-frontend/
RUN cd shadegame-frontend && npm install
COPY shadegame-frontend ./shadegame-frontend/
RUN cd shadegame-frontend && npm run build

# Stage 2: Build the backend and serve the frontend
FROM node:16
WORKDIR /app

# Copy backend files
COPY shadegame-backend/package*.json ./shadegame-backend/
RUN cd shadegame-backend && npm install

# Copy frontend build
COPY --from=build-stage /app/shadegame-frontend/build ./shadegame-frontend/build

# Copy backend source code
COPY shadegame-backend ./shadegame-backend

# Expose the port the app runs on
EXPOSE 5000

# Start the backend server
CMD ["node", "shadegame-backend/server.js"]
