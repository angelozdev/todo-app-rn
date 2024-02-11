import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  ListRenderItem,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ITask } from "../src/types/task";
import { TaskCard, Input } from "../src/components";
import { Stack } from "expo-router";

const dummyTasks: ITask[] = [
  {
    id: 1,
    title: "Have breakfast",
    description: "Eat a healthy breakfast",
    completed: false,
  },
  {
    id: 2,
    title: "Go to the gym",
    description: "Do some cardio and weight lifting",
    completed: false,
  },
  {
    id: 3,
    title: "Read a book",
    description: "Read a book for 30 minutes",
    completed: false,
  },
  {
    id: 4,
    title: "Write a blog post",
    description: "Write a blog post about React Native",
    completed: false,
  },
  {
    id: 5,
    title: "Have lunch",
    description: "Eat a healthy lunch",
    completed: false,
  },
  {
    id: 6,
    title: "Take a nap",
    description: "Take a 30-minute nap",
    completed: false,
  },
  {
    id: 7,
    title: "Go for a walk",
    description: "Go for a 30-minute walk",
    completed: false,
  },
  {
    id: 8,
    title: "Have dinner",
    description: "Eat a healthy dinner",
    completed: false,
  },
  {
    id: 9,
    title: "Watch a movie",
    description: "Watch a movie with your family",
    completed: false,
  },
  {
    id: 10,
    title: "Go to bed",
    description: "Go to bed at 10:00 PM",
    completed: false,
  },
];

async function fetchTasks() {
  return new Promise<ITask[]>((resolve) => {
    setTimeout(() => {
      resolve(dummyTasks);
    }, 1000);
  });
}

function App() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [newTaskInput, setNewTaskInput] = useState({
    title: "",
    description: "",
  });

  const getTasks = useCallback(async () => {
    setIsLoading(true);
    const tasks = await fetchTasks();
    setTasks(tasks);
    setIsLoading(false);
  }, []);

  const pressHandler = (id: number) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
          };
        }
        return task;
      });
    });
  };

  const deleteHandler = (id: number) => {
    setTasks((prevTasks) => {
      return prevTasks.filter((task) => task.id !== id);
    });
  };

  const addTaskHandler = () => {
    if (newTaskInput.title.trim() === "") return;

    const newTask = {
      id: +new Date(),
      title: newTaskInput.title,
      description: newTaskInput.description,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskInput({ title: "", description: "" });
  };

  const searchHandler = (text: string) => {
    setSearchText(text);
  };

  const filteredTasks = useMemo(() => {
    if (searchText.trim() === "") return tasks;
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [tasks, searchText]);

  const renderTask: ListRenderItem<ITask> = ({ item }) => {
    return (
      <TaskCard
        item={item}
        onDelete={() => deleteHandler(item.id)}
        onPress={() => pressHandler(item.id)}
      />
    );
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Stack.Screen
        options={{
          title: "Tasks",
          headerBackTitleVisible: false,
          headerSearchBarOptions: {
            placeholder: "Search tasks",
            onChangeText: (event) => searchHandler(event.nativeEvent.text),
            hideWhenScrolling: true,
          },
        }}
      />

      <FlatList
        refreshing={isLoading}
        onRefresh={getTasks}
        data={filteredTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTask}
        contentContainerStyle={[
          styles.tasksWrapper,
          isLoading && styles["tasksWrapper:loading"],
        ]}
        style={styles.tasksContainer}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyTasks}>
              <Text>
                No tasks found.{" "}
                {searchText.trim()
                  ? `There are no tasks with "${searchText}"`
                  : "Add a new task"}
              </Text>
            </View>
          ) : null
        }
      />

      <View style={styles.addTaskContainer}>
        <Input
          editable={!isLoading}
          placeholder="Add a task"
          value={newTaskInput.title}
          onChangeText={(text) =>
            setNewTaskInput((prev) => ({ ...prev, title: text }))
          }
        />

        <Pressable
          disabled={isLoading || newTaskInput.title.trim() === ""}
          style={({ pressed }) => [
            styles.addTaskButton,
            pressed && styles["addTaskButton:pressed"],
            !newTaskInput.title.trim() && styles["addTaskButton:disabled"],
          ]}
          onPress={addTaskHandler}
        >
          <MaterialCommunityIcons name="plus" size={24} color="green" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  tasksWrapper: {
    gap: 12,
    opacity: 1,
    paddingBottom: 32,
  },
  "tasksWrapper:loading": {
    opacity: 0.5,
  },
  tasksContainer: {
    padding: 16,
  },
  emptyTasks: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addTaskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    padding: 16,
  },
  addTaskButton: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  "addTaskButton:pressed": {
    backgroundColor: "#e9e9e9",
  },
  "addTaskButton:disabled": {
    backgroundColor: "#f9f9f9",
    opacity: 0.5,
  },
});

export default App;
