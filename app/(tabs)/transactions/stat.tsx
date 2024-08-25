import { useEffect, useState, useRef } from "react";

import { View, StyleSheet, ScrollView } from "react-native";

import { Avatar, Card, SegmentedButtons, Text } from "react-native-paper";

import { Pie, PolarChart } from "victory-native";

import {
  useFilterSelector,
  useTransactionSelector,
} from "../../../store/hooks";

import dayjs from "dayjs";

type ColoredTransactions = {
  type: string;
  title: string;
  amount: number;
  color: string;
  percentage: number;
};

function generateRandomColor(): string {
  const randomColor = Math.floor(Math.random() * 0xffffff);
  return `#${randomColor.toString(16).padStart(6, "0")}`;
}

function MyChart() {
  const [filteredTransactions, setFilteredTransactions] = useState<
    ColoredTransactions[]
  >([]);
  const [monthBalance, setMonthBalance] = useState<number>(0);
  const [filter, setFilter] = useState<string>("expense");
  const transactions = useTransactionSelector(
    (state) => state.transaction.items
  );
  const filterSelector = useFilterSelector((state) => state.filter);

  const colorMapRef = useRef<{ [key: string]: string }>({});

  const filterTransactions = () => {
    const filtered = transactions.filter((transaction) => {
      const transactionMonth = dayjs(transaction.date).format("MMMM");
      const transactionYear = dayjs(transaction.date).year().toString();
      const isMatchingType = transaction.type === filter;
      const isMatchingDate =
        transactionMonth === filterSelector.selectedMonth &&
        transactionYear === filterSelector.selectedYear;

      return isMatchingType && isMatchingDate;
    });

    const totalBalance = filtered.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const normalizeTitle = (title: string) =>
        title.toLowerCase().replace(/\s+/g, "");

      const existing = acc.find(
        (item) =>
          normalizeTitle(item.title) === normalizeTitle(transaction.title)
      );

      if (!colorMapRef.current[transaction.title]) {
        colorMapRef.current[transaction.title] = generateRandomColor();
      }

      if (existing) {
        existing.amount += transaction.amount;
      } else {
        acc.push({
          type: transaction.type,
          title: transaction.title,
          amount: transaction.amount,
          color: colorMapRef.current[transaction.title],
          percentage: 0,
        });
      }
      return acc;
    }, [] as ColoredTransactions[]);

    const updatedGrouped = grouped.map((item) => ({
      ...item,
      percentage: (item.amount / totalBalance) * 100,
    }));

    setMonthBalance(totalBalance);
    setFilteredTransactions(updatedGrouped);
  };

  useEffect(() => {
    filterTransactions();
  }, [filter]);

  return (
    <>
      <SegmentedButtons
        value={filter}
        onValueChange={setFilter}
        buttons={[
          { value: "expense", label: "Expense" },
          { value: "income", label: "Income" },
          { value: "investment", label: "Investment" },
        ]}
        style={{ padding: 5 }}
      />
      <Card style={{ margin: 5, height: 90 }}>
        <Card.Title
          title={`${filterSelector.selectedMonth}, ${filterSelector.selectedYear} ${filter}s`}
        />
        <Card.Content>
          <Text variant="titleLarge">${monthBalance.toFixed(2)}</Text>
        </Card.Content>
      </Card>
      <View style={styles.chartContainer}>
        <PolarChart
          data={filteredTransactions}
          labelKey={"title"}
          valueKey={"amount"}
          colorKey={"color"}
          containerStyle={styles.chartContainer}
        >
          <Pie.Chart>
            {() => {
              return (
                <>
                  <Pie.Slice />
                  <Pie.SliceAngularInset
                    angularInset={{
                      angularStrokeWidth: 1,
                      angularStrokeColor: "white",
                    }}
                  />
                </>
              );
            }}
          </Pie.Chart>
        </PolarChart>
      </View>
      <ScrollView>
        {filteredTransactions.map((item, index) => {
          const icon =
            item.type === "expense"
              ? "minus"
              : item.type === "income"
              ? "plus"
              : "trending-up";

          return (
            <View key={index} style={styles.legendItem}>
              <Card style={styles.legendCard}>
                <Card.Title
                  title={item.title}
                  left={() => (
                    <Avatar.Icon
                      icon={icon}
                      style={{ backgroundColor: item.color }}
                      size={40}
                    />
                  )}
                  right={() => (
                    <Text>{`$${item.amount.toFixed(
                      2
                    )} (${item.percentage.toFixed(2)}%)`}</Text>
                  )}
                  rightStyle={{ paddingRight: 10 }}
                />
              </Card>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    width: 300,
    height: 300,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 25,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    width: "100%",
  },
  legendCard: {
    width: "90%",
  },
});

export default MyChart;
