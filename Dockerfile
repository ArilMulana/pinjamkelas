# Gunakan base image PHP 8.3 dengan Apache
FROM php:8.3-apache

# Set working directory
WORKDIR /var/www/html

# Install dependencies sistem & PHP extension yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    bash \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo_mysql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Aktifkan mod_rewrite Apache
RUN a2enmod rewrite

# Install Composer global
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Expose port Apache
EXPOSE 80

# Jalankan Apache di foreground
CMD ["apache2-foreground"]
