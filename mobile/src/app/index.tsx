import { Text, View, StyleSheet } from "react-native";
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync } from 'expo-audio';
import { Button } from "react-native";

export default function Index() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const startRecording = async () => {
    const { granted } = await requestRecordingPermissionsAsync();

    if (!granted) {
      console.log("Microphone permission denied");
      return;
    }

    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async () => {
    await recorder.stop();
    console.log("Recording:", recorder.uri);
  };

  return (
    <View style={styles.container}>
        <Button title="Start Recording" onPress={startRecording} />
        <Button title="Stop Recording" onPress={stopRecording} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
