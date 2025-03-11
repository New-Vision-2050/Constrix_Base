#!/bin/sh

set -e

# Generate .env file from environment variables if it doesn't exist
#if [ ! -f /var/www/.env ]; then
#    echo "Generating .env file..."
#    cat <<EOL > /var/www/.env
#APP_ENV=${APP_ENV}
#APP_DEBUG=${APP_DEBUG}
#
#DB_HOST=${DB_HOST}
#DB_PORT=${DB_PORT}
#DB_USER=${DB_USER}
#DB_PASSWORD=${DB_PASSWORD}
#DB_NAME=${DB_NAME}-${DEPLOYMENT_ID}
#EOL
#fi

# Run Laravel Artisan commands
echo "Running Laravel commands..."
php artisan storage:link
yes | php artisan migrate --force
yes | php artisan db:seed --force

# Start Supervisor
exec "$@"
