import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toMoney } from "../../../others/utilsAPI";
import statisticMgmtSlice from "../../../../reducers/componentsReducer/statisticMgmt/statisticMgmtSlice";

const StatisticFirstSection = () => {
  const list = useSelector((state) => state.statisticMgmt.firstSectionList);
  const month = useSelector((state) => state.statisticMgmt.month);
  const billsList = useSelector((state) => state.getBills.billsList);
  const billDetailList = useSelector((state) => state.getBills.billDetailList);
  const warehouseList = useSelector(
    (state) => state.getWarehouses.warehousesList
  );
  const [compare, setCompare] = useState({
    quantity: 0,
    revenue: 0,
    import: 0,
    profit: 0,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    setDataForBasic(month);
  }, [month]);

  useEffect(() => {
    if (Object.keys(list).length !== 0) {
      let quantity = Math.floor(
        (list.current?.totalSales * 100) / list.previous?.totalSales
      );
      let revenue = Math.floor(
        (list.current?.revenueSales * 100) / list.previous?.revenueSales
      );
      let totalImport = Math.floor(
        (list.current?.totalImport * 100) / list.previous?.totalImport
      );
      let profit = Math.floor(
        (list.current?.profit * 100) /
          (list.previous?.profit < 0
            ? list.previous?.profit * -1
            : list.previous?.profit)
      );
      setCompare({
        quantity: quantity !== Infinity ? quantity : "Không xác định",
        revenue: revenue !== Infinity ? revenue : "Không xác định",
        import: totalImport !== Infinity ? totalImport : "Không xác định",
        profit: profit !== Infinity ? profit : "Không xác định",
      });
    }
  }, [list]);

  useEffect(() => {
    return () => {
      dispatch(statisticMgmtSlice.actions.setMonth(new Date().getMonth() + 1));
      setDataForBasic(new Date().getMonth() + 1);
    };
  }, []);

  const setDataForBasic = (month) => {
    let pMonth = {
      totalSales: 0,
      revenueSales: 0,
      totalImport: 0,
      profit: 0,
    };
    let cMonth = {
      totalSales: 0,
      revenueSales: 0,
      totalImport: 0,
      profit: 0,
    };
    month = month - 1;
    let month1 = month - 1 < 0 ? 11 : month - 1;
    let year = new Date().getFullYear();
    let year1 =
    month - 1 < 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
    console.log(year1);
    for (let i in warehouseList) {
      let d = new Date(warehouseList[i].createdAt.split(" -- ")[0]);
      if(isNaN(d)){ 
        let temp = warehouseList[i].createdAt.split(" -- ")[0]
        let date = temp.split('/')[1] + '/' + temp.split('/')[0] + '/' + temp.split('/')[2]
        d = new Date(date)
      }
      if (d.getMonth() === month && d.getFullYear() === year) {
        cMonth.totalImport += warehouseList[i].totalAmount;
      } else if (d.getMonth() === month1 && year1 === d.getFullYear()) {
        pMonth.totalImport += warehouseList[i].totalAmount;
      }
    }
    for (let i in billsList) {
      let d = new Date(billsList[i].orderDate.split(" -- ")[0]);
      let quantity = 0;
      for (let y in billDetailList[billsList[i].billID]) {
        quantity += billDetailList[billsList[i].billID][y].quantity;
      }
      if (d.getMonth() === month && d.getFullYear() === year) {
        cMonth.totalSales += quantity;
        cMonth.revenueSales += billsList[i].totalAmount;
      } else if (d.getMonth() === month1 && year1 === d.getFullYear()) {
        pMonth.totalSales += quantity;
        pMonth.revenueSales += billsList[i].totalAmount;
      }
    }
    pMonth.profit = pMonth.revenueSales - pMonth.totalImport;
    cMonth.profit = cMonth.revenueSales - cMonth.totalImport;
    dispatch(
      statisticMgmtSlice.actions.setFirstSection({
        previous: pMonth,
        current: cMonth,
      })
    );
  };

  return (
    <div id="statistic-left-top-section">
      <div className="statistic-left-top-div">
        <div className="statistic-left-top-div-left">
          <div className="statistic-left-top-div-title">Số sách đã bán</div>
          <div className="statistic-left-top-div-number">
            {list.current?.totalSales}
          </div>
        </div>
        <div className="statistic-left-top-div-revenue">
          {typeof compare.quantity !== "string" ? (
            compare.quantity > 100 ? (
              <>
                <img
                  src="../../images/trendUp.png"
                  alt="revenue"
                  className="revenue-img"
                />
                <div className="revenue-green">
                  {" "}
                  +{compare.quantity - 100}%{" "}
                </div>
              </>
            ) : (
              <>
                <img
                  src="../../images/trendDown.png"
                  alt="revenue"
                  className="revenue-img"
                />
                <div className="revenue-red"> -{100 - compare.quantity}% </div>
              </>
            )
          ) : (
            <>
              <img
                src="../../images/trendUp.png"
                alt="revenue"
                className="revenue-img"
              />
              <div className="revenue-green"> ~~ </div>
            </>
          )}
        </div>
      </div>

      <div className="statistic-left-top-div">
        <div className="statistic-left-top-div-left">
          <div className="statistic-left-top-div-title">Doanh thu bán ra</div>
          <div className="statistic-left-top-div-number">
            {toMoney(list.current?.revenueSales)}đ
          </div>
        </div>
        <div className="statistic-left-top-div-revenue">
          {typeof compare.revenue !== "string" ? (
            compare.revenue > 100 ? (
              <>
                <img
                  src="../../images/trendUp.png"
                  alt="revenue"
                  className="revenue-img"
                />
                <div className="revenue-green"> +{compare.revenue - 100}% </div>
              </>
            ) : (
              <>
                <img
                  src="../../images/trendDown.png"
                  alt="revenue"
                  className="revenue-img"
                />
                <div className="revenue-red"> -{100 - compare.revenue}% </div>
              </>
            )
          ) : (
            <>
              <img
                src="../../images/trendUp.png"
                alt="revenue"
                className="revenue-img"
              />
              <div className="revenue-green"> ~~ </div>
            </>
          )}
        </div>
      </div>

      <div className="statistic-left-top-div">
        <div className="statistic-left-top-div-left">
          <div className="statistic-left-top-div-title">Chi phí nhập kho</div>
          <div className="statistic-left-top-div-number">
            {toMoney(list.current?.totalImport)}đ
          </div>
        </div>
        <div className="statistic-left-top-div-revenue">
          {typeof compare.import !== "string" ? (
            compare.import > 100 ? (
              <>
                <img
                  src="../../images/trendDown.png"
                  alt="revenue"
                  className="revenue-img"
                />
                <div className="revenue-red"> +{compare.import - 100}% </div>
              </>
            ) : (
              <>
                <img
                  src="../../images/trendUp.png"
                  alt="revenue"
                  className="revenue-img"
                />
                <div className="revenue-green"> -{100 - compare.import}% </div>
              </>
            )
          ) : (
            <>
              <img
                src="../../images/trendDown.png"
                alt="revenue"
                className="revenue-img"
              />
              <div className="revenue-red"> ~~ </div>
            </>
          )}
        </div>
      </div>

      <div className="statistic-left-top-div">
        <div className="statistic-left-top-div-left">
          <div className="statistic-left-top-div-title">Lợi nhuận</div>
          <div className="statistic-left-top-div-number">
            {toMoney(list.current?.profit)}đ
          </div>
        </div>
        <div className="statistic-left-top-div-revenue">
          {typeof compare.profit !== "string" ? (
            list.current?.profit > list.previous?.profit ? (
              <>
                <img
                  src="../../images/trendUp.png"
                  alt="revenue"
                  className="revenue-img"
                />
              </>
            ) : (
              <>
                <img
                  src="../../images/trendDown.png"
                  alt="revenue"
                  className="revenue-img"
                />
              </>
            )
          ) : (
            <>
              <img
                src="../../images/trendUp.png"
                alt="revenue"
                className="revenue-img"
              />
              <div className="revenue-green"> ~~ </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticFirstSection;
