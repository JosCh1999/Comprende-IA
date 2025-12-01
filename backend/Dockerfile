# Usar imagen oficial de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el código fuente
COPY . .

# Exponer el puerto
EXPOSE 4000

# Variables de entorno por defecto (se sobrescriben con docker-compose)
ENV NODE_ENV=production
ENV PORT=4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
