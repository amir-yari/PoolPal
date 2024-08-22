import { useEffect, useState } from "react";

import { View, ScrollView, Keyboard } from "react-native";

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
    <ScrollView keyboardShouldPersistTaps="handled" className="p-8">
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
          <View className="p-8">
            <SegmentedButtons
              value={values.type}
              onValueChange={handleChange("type")}
              buttons={[
                {
                  value: "expense",
                  label: "Expense",
                },
                {
                  value: "income",
                  label: "Income",
                },
                {
                  value: "investment",
                  label: "Investment",
                },
              ]}
            />
            <TextInput
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              value={values.title}
              placeholder="E.g. Food"
              label="Title"
              mode="outlined"
            />
            <TextInput
              onChangeText={handleChange("amount")}
              onBlur={handleBlur("amount")}
              value={values.amount}
              placeholder="0.00"
              label="Amount"
              keyboardType="numeric"
              mode="outlined"
            />

            <Text>Date:</Text>
            <Button
              mode="outlined"
              onPress={() => {
                setShowCalendar(true);
                Keyboard.dismiss();
              }}
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
                  [values.date]: {
                    selected: true,
                  },
                }}
                enableSwipeMonths={true}
              />
            )}

            <Button onPress={() => handleSubmit()} mode="contained">
              {isEditing ? "Save" : "Add"}
            </Button>
            {isEditing && (
              <IconButton
                icon="delete"
                onPress={() => handleDelete()}
                mode="contained"
              />
            )}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default TransactionsForm;
