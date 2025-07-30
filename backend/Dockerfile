# Step 1: Use Node.js base image
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Generate Prisma client
RUN npx prisma generate

# Step 7: Build the NestJS project
RUN npm run build

# Step 8: Expose the port
EXPOSE 5000

# Step 9: Start the app
CMD ["npm", "run", "start:prod"]
