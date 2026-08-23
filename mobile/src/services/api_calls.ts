const sendData = async () => {
  try {
    const response = await fetch("http://192.168.1.10:5000/api/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Hello from Expo!",
      }),
    });

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error("Request failed:", error);
  }
};

export default sendData;