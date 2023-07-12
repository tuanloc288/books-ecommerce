import { Chart as ChartJS, registerables } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { multipleColor } from "../../others/utils";
ChartJS.register(...registerables);

const StatisticThirdSection = () => {
  const warehouseList = useSelector(
    (state) => state.getWarehouses.warehousesList
  );
  const year = useSelector((state) => state.statisticMgmt.pieYear);
  const [chartData, setChartData] = useState([]);
  const colorList = multipleColor(12);

  useEffect(() => {
    setDataChange(year);
  }, [year]);

  useEffect(() => {
    return () => {
      setDataChange(new Date().getFullYear());
    };
  }, []);

  const setDataChange = (year) => {
    let perMonth = [];

    for (let i = 0; i < 12; i++) {
      perMonth[i] = 0;
    }
    for (let i in warehouseList) {
      let d = new Date(warehouseList[i].createdAt.split(" -- ")[0]);
      if (d.getFullYear() === parseInt(year)) {
        perMonth[d.getMonth()] += warehouseList[i].totalAmount;
      }
    }
    setChartData(perMonth);
  };

  return (
    <div style={{
      height: 625,
      width: '100%'
    }}>
      <Pie
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
              label: ``,
              data: chartData,
              borderColor: colorList,
              backgroundColor: colorList,
            },
          ],
        }}
        height={600}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Chi phí nhập hàng năm ${year}`,
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
          },
        }}
      />
    </div>
  );
};

export default StatisticThirdSection;
