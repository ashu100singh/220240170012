// logging-middlewares/loggingMiddleware.js

export async function Log(stack, level, packageName, message) {
  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: packageName.toLowerCase(),
    message,
  };

  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhc2h1dG9zaGt1bWFyLmFpbWwyMDIyQHJpdHJvb3JrZWUuY29tIiwiZXhwIjoxNzU4MjYyNTg4LCJpYXQiOjE3NTgyNjE2ODgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiJiNDk0MzY4YS01Yjk2LTQwNzItODYzMS1jMWY2ZmVmY2E1ZjEiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJhc2h1dG9zaCBzaW5naCIsInN1YiI6IjIzNzY5MGNlLTE5YWEtNGQzZS1iZDMxLTRjNTVhYjZhYjNlZCJ9LCJlbWFpbCI6ImFzaHV0b3Noa3VtYXIuYWltbDIwMjJAcml0cm9vcmtlZS5jb20iLCJuYW1lIjoiYXNodXRvc2ggc2luZ2giLCJyb2xsTm8iOiIyMjAyNDAxNzAwMTIiLCJhY2Nlc3NDb2RlIjoiS3ZKQUhYIiwiY2xpZW50SUQiOiIyMzc2OTBjZS0xOWFhLTRkM2UtYmQzMS00YzU1YWI2YWIzZWQiLCJjbGllbnRTZWNyZXQiOiJHSnlOdkV1bXFoS3FKU0ZIIn0.h7QZOHCaRcDrXtD1mSfsNldq2M8L2GHeI0U9f7xf0Fo"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn("Failed to send log:", response.statusText);
    }
  } catch (error) {
    console.error("Logging middleware error:", error);
  }
}
