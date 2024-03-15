FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install
ENV PORT 8080
EXPOSE 8080
COPY . .
CMD ["npm", "start"]
