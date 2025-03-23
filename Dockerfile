# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Set environment variables (if using Next.js)
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Run Next.js server
CMD ["npm", "start"]
