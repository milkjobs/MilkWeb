const range = n => Array.from(Array(n).keys());

const HourlySalaryOptions = [
  158,
  ...range(8).map(n => 160 + n * 5),
  ...range(10).map(n => 200 + n * 10),
  ...range(6).map(n => 300 + n * 50),
  ...range(5).map(n => 600 + n * 100)
];

const MonthlySalaryOptions = [
  23800,
  ...range(16).map(n => 24000 + n * 1000),
  ...range(10).map(n => 40000 + n * 2000),
  ...range(10).map(n => 60000 + n * 4000),
  ...range(11).map(n => 100000 + n * 10000)
];

export { HourlySalaryOptions, MonthlySalaryOptions };
