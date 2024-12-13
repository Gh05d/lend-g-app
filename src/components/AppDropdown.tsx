import React, {useState} from "react";
import {View, StyleSheet, Pressable, FlatList, Modal, Text} from "react-native";
import {useTheme} from "@react-navigation/native";

interface DropdownProps {
  items: {label: string; value: string}[];
  onChange: (value: string) => void;
  value?: string | number | null;
}

const Dropdown: React.FC<DropdownProps> = ({items, value, onChange}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {colors} = useTheme();

  function handleSelect(newValue: string) {
    onChange(newValue);
    setIsVisible(false);
  }

  const renderItem = ({item}: {item: {label: string; value: string}}) => (
    <Pressable
      style={({pressed}) => [
        styles.item,
        {backgroundColor: pressed ? colors.card : colors.background},
      ]}
      onPress={() => handleSelect(item.value)}>
      <Text style={[styles.itemText, {color: colors.text}]}>{item.label}</Text>
    </Pressable>
  );

  return (
    <View>
      <Pressable
        style={[styles.dropdown, {backgroundColor: colors.card}]}
        onPress={() => setIsVisible(!isVisible)}>
        <Text style={[styles.dropdownText, {color: colors.text}]}>
          {items.find(item => item.value === value)?.label || "Select"}
        </Text>
      </Pressable>

      <Modal visible={isVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setIsVisible(false)} />
        <View
          style={[styles.dropdownContainer, {backgroundColor: colors.card}]}>
          <FlatList
            data={items}
            keyExtractor={item => item.value}
            renderItem={renderItem}
            bounces={false}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  dropdownText: {fontSize: 16},
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownContainer: {
    position: "absolute",
    top: "50%",
    left: "10%",
    right: "10%",
    maxHeight: 200,
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  item: {padding: 12, borderRadius: 4, marginBottom: 4},
  itemText: {fontSize: 16},
});

export default Dropdown;
