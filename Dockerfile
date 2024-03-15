FROM node:18
WORKDIR ./
COPY package*.json ./
RUN npm install
ENV PORT 8080
EXPOSE 8080
CMD ["node", "index.js"]
