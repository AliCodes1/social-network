# Use an official Node runtime as a parent image
FROM node:16.20.1

# RUN echo "deb http://deb.debian.org/debian buster main" > /etc/apt/sources.list \
#     && echo "deb http://security.debian.org/debian-security buster/updates main" >> /etc/apt/sources.list \
#     && echo "deb http://deb.debian.org/debian buster-updates main" >> /etc/apt/sources.list

# RUN apt-get update -y \
#     && apt-get install -y netcat \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*


# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY package*.json ./

# COPY wait-for.sh /wait-for.sh
# RUN chmod +x /wait-for.sh
# Install any needed packages
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port available to the world outside this container
EXPOSE 3000

# Run the app when the container launches
CMD ["npm", "start"]
