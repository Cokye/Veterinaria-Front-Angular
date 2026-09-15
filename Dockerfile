# syntax=docker/dockerfile:1
# ===========================================================================
#  Dockerfile del FRONTEND (Angular + Yarn + Nginx)
# ===========================================================================

# ---------------------------------------------------------------------------
#  Etapa 1: compilar
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Copiar dependencias y respetar yarn.lock
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copiar código fuente y compilar para producción
COPY . .
RUN yarn build --configuration production

# ---------------------------------------------------------------------------
#  Etapa 2: servir con Nginx
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine

# Copiar la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los estáticos compilados desde la etapa de build
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --spider -q http://127.0.0.1/ || exit 1