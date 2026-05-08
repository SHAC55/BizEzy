import { ActivityIndicator, Modal, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
} from "react-native-reanimated";

export const SubmitOverlay = ({
  visible,
  message = "Saving...",
}: {
  visible: boolean;
  message?: string;
}) => (
  <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        entering={ZoomIn.duration(300)}
        style={{
          backgroundColor: "#0F172A",
          borderRadius: 28,
          paddingHorizontal: 36,
          paddingVertical: 32,
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 16 },
          shadowOpacity: 0.3,
          shadowRadius: 24,
          elevation: 16,
          minWidth: 180,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            backgroundColor: "rgba(99,102,241,0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="small" color="#818CF8" />
        </View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#E2E8F0",
            letterSpacing: 0.3,
          }}
        >
          {message}
        </Text>
      </Animated.View>
    </View>
  </Modal>
);
