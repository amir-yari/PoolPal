import { useState } from "react";
import { View, ScrollView, Keyboard, StyleSheet } from "react-native";
import {
  Button,
  SegmentedButtons,
  TextInput,
  Text,
  IconButton,
} from "react-native-paper";
import { Formik } from "formik";
import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import { useTransactionDispatch, useTransactionSelector } from "../store/hooks";
import { transactionActions } from "../store/transaction-slice";
import { useRouter, useLocalSearchParams } from "expo-router";

const TransactionsForm = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = Boolean(id);
  const transaction = useTransactionSelector((state) =>
    state.transaction.items.find((transaction) => transaction.id === id)
  );

  const transactionDispatch = useTransactionDispatch();
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = (values: any) => {
    const transactionValues = {
      ...values,
      amount: parseFloat(values.amount) || 0,
    };
    {
      isEditing
        ? transactionDispatch(
            transactionActions.updateTransaction({
              ...transactionValues,
              id: id,
            })
          )
        : transactionDispatch(
            transactionActions.addTransaction(transactionValues)
          );
    }
    router.back();
  };

  const handleDelete = () => {
    transactionDispatch(transactionActions.deleteTransaction(id as string));
    router.back();
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      <Formik
        initialValues={{
          type: transaction?.type || "expense",
          title: transaction?.title || "",
          amount: transaction?.amount?.toString() || "",
          date: transaction?.date
            ? dayjs(transaction.date).format("YYYY-MM-DD")
            : dayjs().format("YYYY-MM-DD"),
        }}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
        }) => (
          <View style={styles.form}>
            <SegmentedButtons
              value={values.type}
              onValueChange={handleChange("type")}
              buttons={[
                { value: "expense", label: "Expense" },
                { value: "income", label: "Income" },
                { value: "investment", label: "Investment" },
              ]}
              style={styles.segmentedButtons}
            />
            <TextInput
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              value={values.title}
              placeholder="E.g. Food"
              label="Title"
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              onChangeText={handleChange("amount")}
              onBlur={handleBlur("amount")}
              value={values.amount}
              placeholder="0.00"
              label="Amount"
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />

            <Text style={styles.label}>Date:</Text>
            <Button
              mode="outlined"
              onPress={() => {
                setShowCalendar(true);
                Keyboard.dismiss();
              }}
              style={styles.dateButton}
            >
              {dayjs(values.date).format("MMM DD, YYYY")}
            </Button>

            {showCalendar && (
              <Calendar
                onDayPress={(day: any) => {
                  setFieldValue("date", day.dateString);
                  setShowCalendar(false);
                }}
                markedDates={{
                  [values.date]: { selected: true },
                }}
                enableSwipeMonths={true}
                style={styles.calendar}
              />
            )}

            <Button
              onPress={() => handleSubmit()}
              mode="contained"
              style={styles.submitButton}
            >
              {isEditing ? "Save" : "Add"}
            </Button>
            {isEditing && (
              <IconButton
                icon="delete"
                onPress={() => handleDelete()}
                mode="contained"
                style={styles.deleteButton}
              />
            )}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  dateButton: {
    marginBottom: 16,
  },
  calendar: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
  deleteButton: {
    marginTop: 20,
    alignSelf: "center",
  },
});

export default TransactionsForm;
