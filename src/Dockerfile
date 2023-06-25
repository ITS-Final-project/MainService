FROM node:latest

# Path: /app
WORKDIR /app

# Pass everything, but the node_modules folder to the container
COPY . /app

# Expose port 3000 to the host
EXPOSE 3000

# Pass environment variables to the container
# USSURL is the URL of the User Service Server
# USSPORT is the port of the User Service Server

ENV USSURL http://localhost
ENV USSPORT 3001
ENV MS_SECRET=M6$@31@%WiLl834F0rMeH1re
ENV US_SECRET=7h1$S3CrEtIsOuTT0Gue$$
ENV PY_SECRET=A1w1iLl83c0M3$0m3@1r

# Install dependencies
RUN npm install

# Start the app
CMD ["npm", "start"]

