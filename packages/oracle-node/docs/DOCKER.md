# Configure in Docker

RedStone node relies on env variables, so please remember to pass correct env values to your Docker container.

```dockerfile
ENV ENABLE_JSON_LOGS=true
ENV ENABLE_PERFORMANCE_TRACKING=true
ENV PRINT_DIAGNOSTIC_INFO=true
ENV MANIFEST_REFRESH_INTERVAL=120000
ENV OVERRIDE_MANIFEST_USING_FILE=
ENV ECDSA_PRIVATE_KEY=
ENV TWELVE_DATA_RAPID_API_KEY=
```
