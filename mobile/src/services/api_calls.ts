const sendData = async (uri: string) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    const formData = new FormData();

    formData.append("file", blob, "recording.m4a");

    const result = await fetch("http://192.168.1.10:5000/api/speech", {
      method: "POST",
      body: formData,
    });

    const data = await result.json();

    console.log(data);
  } catch (error) {
    console.error("Request failed:", error);
  }
};

export default sendData;