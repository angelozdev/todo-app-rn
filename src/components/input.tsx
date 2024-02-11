import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useControllableState } from "../hooks";

interface Props extends TextInputProps {}

function Input({ style, defaultValue, onChangeText, value, ...rest }: Props) {
  const [localValue, setLocalValue] = useControllableState<string>({
    defaultProp: defaultValue,
    onChange: onChangeText,
    prop: value,
  });
  return (
    <TextInput
      style={[styles.input, style]}
      value={localValue}
      onChangeText={setLocalValue}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    flex: 1,
  },
});

export default Input;
