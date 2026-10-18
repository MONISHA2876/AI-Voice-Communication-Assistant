const sendData = async (uri: string) => {
  try {
    const formData = new FormData();
    const response = await fetch(uri);
    const blob = await response.blob();

    formData.append("file", blob, "recording.m4a");

    const result = await fetch(
      "http://192.168.1.8:5000/api/speech",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await result.json();

    if (!result.ok) {
      throw new Error(
        data.message || `HTTP error: ${result.status}`
      );
    }

    console.log("Speech response:", data);
  } catch (error) {
    console.error("Request failed:", error);
  }
};

export default sendData;