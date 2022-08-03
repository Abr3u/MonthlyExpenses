const csv = require("csv-parser");
const fs = require("fs");
const results = [];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthToExpenses = new Map();

fs.createReadStream("expenses.csv")
  .pipe(csv())
  .on("data", (data) => {
    const date = new Date(data.Date);

    if (date.getMonth() < 0 || !date.getFullYear()) {
      return;
    }

    const month = `${MONTH_NAMES[date.getMonth()]}-${date.getFullYear()}`;

    let expenses = [];
    if (monthToExpenses.has(month)) {
      expenses = monthToExpenses.get(month);
    }
    expenses.push(data);

    monthToExpenses.set(month, expenses);
    results.push(data);
  })
  .on("end", () => {
    for (let month of monthToExpenses.keys()) {
      console.log(`---> EXPENSES for ${month}`);

      const expenses = monthToExpenses.get(month);

      let totalDiningOut = 0;
      let totalUtilities = 0;
      let totalGroceries = 0;
      let totalEntretainment = 0;
      let totalHome = 0;
      let totalGifts = 0;
      let totalFuel = 0;
      let totalTrips = 0;
      let unclassified = [];

      for (let expense of expenses) {
        let { Category, Cost } = expense;

        Cost = Number(Cost);

        if (Category === "Dining out") {
          totalDiningOut += Cost;
        } else if (Category === "Utilities - Other") {
          totalUtilities += Cost;
        } else if (Category === "Groceries") {
          totalGroceries += Cost;
        } else if (Category === "Entertainment - Other") {
          totalEntretainment += Cost;
        } else if (Category === "Home - Other") {
          totalHome += Cost;
        } else if (Category === "Gifts") {
          totalGifts += Cost;
        } else if (Category === "Gas/fuel") {
          totalFuel += Cost;
        } else if (Category === "Plane") {
          totalTrips += Cost;
        } else {
          unclassified.push(expense);
        }
      }

      console.log(`-> Services ${totalUtilities}`);
      console.log(`-> Groceries ${totalGroceries}`);
      console.log(`-> Dining Out ${totalDiningOut}`);
      console.log(`-> Fuel ${totalFuel}`);
      console.log(`-> Fun ${totalEntretainment}`);
      console.log(`-> House ${totalHome}`);
      console.log(`-> Gifts ${totalGifts}`);
      console.log(`-> Trips ${totalTrips}`);
      console.log(`-> Unclassified ${JSON.stringify(unclassified)}`);
    }
  });
