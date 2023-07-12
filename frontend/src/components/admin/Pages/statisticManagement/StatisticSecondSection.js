// import { multipleColor } from "../others/utils";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toMoney } from "../../../others/utilsAPI";
ChartJS.register(...registerables);

const StatisticSecondSection = () => {
  const billsList = useSelector((state) => state.getBills.billsList);
  const warehouseList = useSelector(
    (state) => state.getWarehouses.warehousesList
  );
  const year = useSelector((state) => state.statisticMgmt.year);
  const [chartData, setChartData] = useState({
    revenue: [],
    import: [],
    profit: [],
  });
  useEffect(() => {
    setDataChange(year);
  }, [year]);

  useEffect(() => {
    return () => {
      setDataChange(new Date().getFullYear());
    };
  }, []);

  const setDataChange = (year) => {
    let list = {
      revenue: [],
      import: [],
      profit: [],
    };

    let perMonth = [];

    for (let i = 0; i < 12; i++) {
      perMonth[i] = {
        revenue: 0,
        import: 0,
        profit: 0,
      };
    }
    for (let i in warehouseList) {
      let d = new Date(warehouseList[i].createdAt.split(" -- ")[0]);
      if (d.getFullYear() === parseInt(year)) {
        perMonth[d.getMonth()].import += warehouseList[i].totalAmount;
      }
    }
    for (let i in billsList) {
      let d = new Date(billsList[i].orderDate.split(" -- ")[0]);
      if (d.getFullYear() === parseInt(year)) {
        perMonth[d.getMonth()].revenue += billsList[i].totalAmount;
      }
    }
    for (let i in perMonth) {
      perMonth[i].profit = perMonth[i].revenue - perMonth[i].import;
      list.revenue.push(perMonth[i].revenue);
      list.import.push(perMonth[i].import);
      list.profit.push(perMonth[i].profit);
    }
    setChartData(list);
  };

  return (
    <div id="statistic-left-bot-section">
      <Line
        data={{
          labels: [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ],
          datasets: [
            {
              label: "Doanh thu bán ra",
              data: chartData.revenue,
              borderColor: "blue",
              backgroundColor: "blue",
            },
            {
              label: "Chi phí nhập hàng",
              data: chartData.import,
              borderColor: "red",
              backgroundColor: "red",
            },
            {
              label: "Lợi nhuận",
              data: chartData.profit,
              borderColor: "green",
              backgroundColor: "green",
            },
          ],
        }}
        height={400}
        options={{
          scales: {
            y: {
              ticks: {
                callback: (value) => {
                  return toMoney(value) + "đ";
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Doanh thu năm ${year}`,
              color: "black",
              font: {
                size: 18,
                family: '"Great Vibes", cursive',
                weight: "lighter",
              },
            },
            legend: {
              position: "bottom",
            },
            tooltips: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.yLabel;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default StatisticSecondSection;
