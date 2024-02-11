import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PressableProps,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";
import { ITask } from "../types/task";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface Props {
  item: ITask;
  onPress: PressableProps["onPress"];
  onDelete: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRANSLATE_X_THRESHOLD = SCREEN_WIDTH * 0.3;

function TaskCard({ item, onPress, onDelete }: Props) {
  const { completed, description, title } = item;
  const translationX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translationX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      const shouldDelete = event.translationX <= -TRANSLATE_X_THRESHOLD;
      if (shouldDelete) {
        translationX.value = withTiming(
          -SCREEN_WIDTH,
          undefined,
          (finished) => {
            finished && runOnJS(onDelete)();
          },
        );
      } else {
        translationX.value = withTiming(0);
      }
    });

  const rStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translationX.value }],
    }),
    [],
  );

  const rDeleteStyle = useAnimatedStyle(
    () => ({
      opacity: withSpring(
        translationX.value <= -TRANSLATE_X_THRESHOLD ? 1 : 0.1,
      ),
    }),
    [],
  );

  return (
    <View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.taskContainer, rStyle]}>
          <View
            style={[styles.taskContent, completed && styles["task:completed"]]}
          >
            <Pressable
              onPress={onPress}
              style={({ pressed }) => [
                styles.checkboxContainer,
                pressed && styles["checkbox:pressed"],
              ]}
            >
              <MaterialCommunityIcons
                size={32}
                color={"#4CAF50"}
                name={
                  completed
                    ? "checkbox-marked-circle"
                    : "checkbox-blank-circle-outline"
                }
              />
            </Pressable>

            <View>
              <Text
                style={[styles.title, completed && styles["title:completed"]]}
              >
                {title}
              </Text>

              {!!description && (
                <Text style={styles.description}>{description}</Text>
              )}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>

      <Animated.View style={[styles.deleteView, rDeleteStyle]}>
        <MaterialCommunityIcons size={24} color={"brown"} name={"delete"} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    borderRadius: 8,
    backgroundColor: "#fff",

    elevation: 2,
    shadowColor: "#5e5e5e",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  taskContent: {
    alignItems: "center",
    gap: 8,
    flexDirection: "row",
    padding: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  description: {
    color: "#5e5e5e",
    fontSize: 12,
  },
  title: {
    fontSize: 16,
  },
  "title:completed": {
    textDecorationLine: "line-through",
  },
  "checkbox:pressed": {
    transform: [{ scale: 0.95 }],
  },
  "task:completed": {
    opacity: 0.5,
  },
  deleteView: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: 64,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
});

export default TaskCard;
