import { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, Animated } from "react-native";
import { useAudioRecorder, RecordingPresets, requestRecordingPermissionsAsync } from 'expo-audio';
import sendData from "../services/api_calls";

export default function Index() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const ripple = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.timing(ripple, { toValue: 1, duration: 1600, useNativeDriver: true })
      ).start();
    } else {
      ripple.stopAnimation();
      ripple.setValue(0);
    }
  }, [isRecording]);

  const rippleStyle = (delayScale: number) => ({
    opacity: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }),
    transform: [
      {
        scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [1, delayScale] }),
      },
    ],
  });

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
      await stopRecording();
    } else {
      setIsRecording(true);
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
        <View style={styles.ringWrap}>
          <View style={[styles.ring, styles.ringOuter]} />
          <View style={[styles.ring, styles.ringMid]} />
          {isRecording && (
            <>
              <Animated.View style={[styles.ring, styles.ringMid, rippleStyle(1.6)]} />
              <Animated.View style={[styles.ring, styles.ringOuter, rippleStyle(1.3)]} />
            </>
          )}
          <Pressable
            onPress={handlePress}
            style={[styles.button, isRecording && styles.buttonRecording]}
          >
            <Text style={styles.icon}>{isRecording ? "🎧" : "🎙️"}</Text>
          </Pressable>
        </View>

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
    backgroundColor: "#08040D",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#A9A3B8",
  },
  center: {
    alignItems: "center",
  },
  ringWrap: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
  },
  ringOuter: {
    width: 260,
    height: 260,
    backgroundColor: "rgba(123,44,191,0.12)",
  },
  ringMid: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(123,44,191,0.22)",
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7B2CBF",
    shadowColor: "#9D4EDD",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonRecording: {
    backgroundColor: "#9D4EDD",
  },
  icon: {
    fontSize: 54,
    color: "#FFFFFF",
  },
  status: {
    marginTop: 24,
    fontSize: 18,
    color: "#E8E3F5",
    fontWeight: "600",
  },
  hint: {
    fontSize: 13,
    color: "#6E6680",
  },
});