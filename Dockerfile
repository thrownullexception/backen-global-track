FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Run database migrations
RUN npm run db:push

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]