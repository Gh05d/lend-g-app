import React, {useState} from "react";
import {useTheme} from "@react-navigation/native";
import {Modal, StyleSheet, View} from "react-native";
import DateTimePicker from "react-native-ui-datepicker";

import AppButton from "../../components/AppButton";
import dayjs from "dayjs";

interface Props {
  show: boolean;
  close: () => void;
  submit: (dateRange: {startDate: string; endDate: string}) => void;
}

const DatePickerModal: React.FC<Props> = props => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeType>({
    startDate: null,
    endDate: null,
  });

  const {colors} = useTheme();
  console.log(
    dayjs(selectedDateRange.startDate).locale("de").format("DD. MMMM YYYY"),
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={props.show}
      onRequestClose={props.close}>
      <View style={styles.modalContainer}>
        <View style={[styles.datePicker]}>
          <DateTimePicker
            mode="range"
            locale="de"
            firstDayOfWeek={1}
            minDate={new Date()}
            startDate={selectedDateRange.startDate}
            endDate={selectedDateRange.endDate}
            selectedItemColor={colors.primary}
            onChange={params => setSelectedDateRange(params)}
          />

          <View style={styles.buttonContainer}>
            <AppButton
              onPress={props.close}
              color={colors.error}
              title="Abbrechen"
            />
            <AppButton
              onPress={() => props.submit(selectedDateRange)}
              color={colors.secondary}
              title="Bestätigen"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePicker: {
    width: "80%",
    maxWidth: 360,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    shadowRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 0},
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 12,
  },
});
