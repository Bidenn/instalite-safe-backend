# Gunakan image Node.js yang sesuai
FROM node:16

# Set working directory di dalam container
WORKDIR /app

# Copy package.json dan package-lock.json (jika ada)
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy seluruh source code ke dalam container
COPY . .

# Install nodemon untuk development mode
RUN npm install -g nodemon

# Expose port yang digunakan oleh ExpressJS (misalnya port 5000)
EXPOSE 5000

# Perintah untuk menjalankan aplikasi menggunakan nodemon
CMD ["nodemon", "app.js"]
