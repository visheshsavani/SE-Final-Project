FROM node:20
WORKDIR /frontend/frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5175
CMD ["npm" , "run" , "dev"]