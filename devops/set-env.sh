: "${NEXT_PUBLIC_API_BASE_URL:=https://core-be-stage.constrix-nv.com}"
: "${NEXT_PUBLIC_API_PATH:=api}"
: "${NEXT_PUBLIC_API_VERSION:=v1}"
: "${NODE_ENV:=}"
: "${NEXT_PUBLIC_CACHE_BUST:=1745490179-C7KzQufm}"
: "${DEPLOYMENT_ID:=stage}"
: "${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:=AIzaSyD}"
: "${ISLOCAL:=true}"

export NEXT_PUBLIC_API_BASE_URL
export NEXT_PUBLIC_API_PATH
export NEXT_PUBLIC_API_VERSION
export NODE_ENV
export NEXT_PUBLIC_CACHE_BUST
export DEPLOYMENT_ID
export NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
export ISLOCAL

echo "Environment variables have been set (if not already present)."
