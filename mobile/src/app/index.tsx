import { useState, useRef } from "react";
import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync } from 'expo-audio';
import sendData from "../services/api_calls";

export default function Index() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulse.stopAnimation();
    Animated.timing(pulse, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

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
    sendData(recorder.uri as any);
  };

  const handlePress = async () => {
    if (isRecording) {
      setIsRecording(false);
      stopPulse();
      await stopRecording();
    } else {
      setIsRecording(true);
      startPulse();
      await startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My AI Assistant</Text>
        <Text style={styles.subtitle}>
          {isRecording ? "I'm listening..." : "Speak naturally to me"}
        </Text>
      </View>

      <View style={styles.center}>
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <Pressable
            onPress={handlePress}
            style={[styles.button, isRecording && styles.buttonRecording]}
          >
            <Text style={styles.icon}>{isRecording ? "⏹️" : "🎙️"}</Text>
          </Pressable>
        </Animated.View>
        <Text style={styles.status}>
          {isRecording ? "Listening..." : "Tap to speak"}
        </Text>
      </View>

      <Text style={styles.hint}>Tap once to speak • Tap again to stop</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBF9FF",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F6B",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#9B8FB5",
  },
  center: {
    alignItems: "center",
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E9E3FB",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#B9A6E8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  buttonRecording: {
    backgroundColor: "#F7D6E0",
    shadowColor: "#F0A8C0",
  },
  icon: {
    fontSize: 56,
  },
  status: {
    marginTop: 18,
    fontSize: 15,
    color: "#6B5E8C",
    fontWeight: "500",
  },
  hint: {
    fontSize: 12,
    color: "#B7AECB",
  },
});