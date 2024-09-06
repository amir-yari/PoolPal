import { useEffect, useState } from "react";

import { ScrollView, View, StyleSheet, Modal } from "react-native";

import {
  FAB,
  Text,
  Card,
  Avatar,
  SegmentedButtons,
  Button,
} from "react-native-paper";

import { useRouter } from "expo-router";

import dayjs from "dayjs";

import { Picker } from "@react-native-picker/picker";

import {
  useFilterDispatch,
  useTransactionSelector,
} from "../../../store/hooks";
import { filterActions } from "../../../store/filter-slice";

import Transaction from "../../../types/transaction";

const months = Array.from({ length: 12 }, (_, i) =>
  dayjs().month(i).format("MMMM")
);
const years = Array.from({ length: 10 }, (_, i) => dayjs().year() + i);

const Tab = () => {
  const filterDispatch = useFilterDispatch();
  const router = useRouter();
  const [showPicker, setShowPicker] = useState(false);

  const [monthBalance, setMonthBalance] = useState(0);
  const [filter, setFilter] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);

  const transactions = useTransactionSelector(
    (state) => state.transaction.items
  );

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    filterDispatch(
      filterActions.setFilter({
        selectedYear: selectedYear.toString(),
        selectedMonth: month,
      })
    );
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
    filterDispatch(
      filterActions.setFilter({
        selectedYear: year,
        selectedMonth: selectedMonth,
      })
    );
  };

  const filterTransactions = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionMonth = dayjs(transaction.date).format("MMMM");
      const transactionYear = dayjs(transaction.date).year();
      const isMatchingType = filter === "all" || transaction.type === filter;
      const isMatchingDate =
        transactionMonth === selectedMonth && transactionYear === selectedYear;

      return isMatchingType && isMatchingDate;
    });

    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    filterTransactions();
  }, [filter, selectedMonth, selectedYear, transactions]);

  const handleApplyFilters = () => {
    setShowPicker(false);
  };

  useEffect(() => {
    const filteredTransactions = transactions.filter((transaction) => {
      const transactionMonth = dayjs(transaction.date).format("MMMM");
      const transactionYear = dayjs(transaction.date).year();
      return (
        transactionMonth === selectedMonth && transactionYear === selectedYear
      );
    });

    const totalBalance = filteredTransactions.reduce((acc, transaction) => {
      const amount =
        transaction.type === "income"
          ? transaction.amount
          : -transaction.amount;
      return acc + amount;
    }, 0);

    setMonthBalance(totalBalance);
  }, [transactions, selectedMonth, selectedYear]);

  return (
    <>
      <Button
        mode="outlined"
        onPress={() => setShowPicker(true)}
        style={{ width: 170, marginLeft: 115, marginTop: 10 }}
      >
        {dayjs()
          .month(months.indexOf(selectedMonth))
          .year(selectedYear)
          .format("MMMM, YYYY")}
      </Button>
      <Card style={{ margin: 10 }}>
        <Card.Title title={`${selectedMonth}, ${selectedYear} Balance`} />
        <Card.Content>
          <Text variant="titleLarge">${monthBalance.toFixed(2)}</Text>
        </Card.Content>
      </Card>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: "all", label: "All" },
          { value: "expense", label: "Expense" },
          { value: "income", label: "Income" },
          { value: "investment", label: "Investment" },
        ]}
        style={{ padding: 10 }}
      />

      <Modal
        transparent={true}
        visible={showPicker}
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={(value) => handleMonthChange(value)}
            >
              {months.map((month, index) => (
                <Picker.Item key={index} label={month} value={month} />
              ))}
            </Picker>
            <Picker
              selectedValue={selectedYear.toString()}
              onValueChange={(itemValue) => handleYearChange(itemValue)}
            >
              {years.map((year, index) => (
                <Picker.Item
                  key={index}
                  label={year.toString()}
                  value={year.toString()}
                />
              ))}
            </Picker>
            <Button
              mode="contained"
              onPress={handleApplyFilters}
              style={styles.applyButton}
            >
              Apply
            </Button>
            <Button
              mode="text"
              onPress={() => setShowPicker(false)}
              style={styles.closeButton}
            >
              Close
            </Button>
          </View>
        </View>
      </Modal>

      <ScrollView>
        <View>
          {filteredTransactions &&
            filteredTransactions.map((transaction) => {
              const icon =
                transaction.type === "expense"
                  ? "minus"
                  : transaction.type === "income"
                  ? "plus"
                  : "trending-up";

              return (
                <Card
                  key={transaction.id}
                  style={{ margin: 10 }}
                  onLongPress={() => router.push(`/modal/${transaction.id}`)}
                >
                  <Card.Title
                    title={transaction.title}
                    subtitle={`${dayjs(transaction.date).format(
                      "MMM DD, YYYY"
                    )}`}
                    left={() => <Avatar.Icon icon={icon} size={40} />}
                    right={() => <Text>{`$${transaction.amount}`}</Text>}
                    rightStyle={{ paddingRight: 15 }}
                  />
                </Card>
              );
            })}
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        color="black"
        onPress={() => router.push("/modal")}
      />
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 150,
    bottom: 0,
  },
  filterButton: {
    margin: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  pickerContainer: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  applyButton: {
    marginTop: 10,
  },
  closeButton: {
    marginTop: 10,
  },
});

export default Tab;
