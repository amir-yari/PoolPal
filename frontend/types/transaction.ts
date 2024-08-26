type Transaction = {
  id: string;
  type: "expense" | "income" | "investment";
  title: string;
  amount: number;
  date: string;
};

export default Transaction;
