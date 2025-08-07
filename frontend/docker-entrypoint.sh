#!/bin/bash
# Save this as frontend/docker-entrypoint.sh

# Generate runtime environment configuration
cat > /opt/app-root/src/env-config.js << EOF
window.ENV = {
  REACT_APP_API_URL: "${REACT_APP_API_URL:-/api}"
};
EOF

echo "Generated environment config:"
cat /opt/app-root/src/env-config.js

# Start nginx
exec "$@"
