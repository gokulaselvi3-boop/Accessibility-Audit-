async function checkServer() {
  try {
    const response = await fetch("http://localhost:3000/api/health");
    const data = await response.json();

    console.log("Server status:", data.message);
  } catch (error) {
    console.error("Unable to connect to the server.");
  }
}

checkServer();
