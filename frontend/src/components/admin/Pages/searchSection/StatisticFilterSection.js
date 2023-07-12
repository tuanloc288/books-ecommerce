import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import statisticMgmtSlice from "../../../../reducers/componentsReducer/statisticMgmt/statisticMgmtSlice";

const StatisticFilterSection = () => {
  const [yearList, setYearList] = useState([]);
  const [input, setInput] = useState({
    month: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
    year: new Date().getFullYear(),
    pieYear: new Date().getFullYear(),
  });
  const dispatch = useDispatch();

  useEffect(() => {
    let year = new Date().getFullYear();
    let list = [];
    for (let i = year; i >= year - 5; i--) {
      list.push(i);
    }
    setYearList(list);

    return () => {
      dispatch(statisticMgmtSlice.actions.setMonth(new Date().getMonth() + 1));
      dispatch(statisticMgmtSlice.actions.setYear(new Date().getFullYear()));
      dispatch(statisticMgmtSlice.actions.setPieYear(new Date().getFullYear()));
    };
  }, []);

  const handleChange = async (type, value) => {
    switch (type) {
      case "basic": {
        dispatch(statisticMgmtSlice.actions.setMonth(value.split("-")[1]));
        setInput(() => ({
          ...input,
          month: value,
        }));
        break;
      }
      case "chart": {
        dispatch(statisticMgmtSlice.actions.setYear(value));
        setInput(() => ({
          ...input,
          year: value,
        }));
        break;
      }
      default: {
        dispatch(statisticMgmtSlice.actions.setPieYear(value));
        setInput(() => ({
          ...input,
          pieYear: value,
        }));
        break;
      }
    }
  };

  return (
    <>
      <div className="management-filter-section">
        <div className="search-by-object">
          <div className="sub-title"> Thống kê tháng:</div>
          <input
            type="month"
            name="basic"
            min="2021-01"
            value={input.month}
            className='statistic-filter-select'
            onChange={(e) => {
              handleChange(e.target.name, e.target.value);
            }}
          />
        </div>

        <div className="search-by-object">
          <div className="sub-title">
            Thống kê năm:
            <select
              className='statistic-filter-select'
              name="chart"
              value={input.year}
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
            >
              {yearList.map((value) => {
                return (
                  <option key={value} defaultValue={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="search-by-object">
          <div className="sub-title">
            Chi phí nhập hàng năm:
            <select
              className='statistic-filter-select'
              name="pie"
              value={input.pieYear}
              onChange={(e) => {
                handleChange(e.target.name, e.target.value);
              }}
            >
              {yearList.map((value) => {
                return (
                  <option key={value} defaultValue={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="search-btn-section">
        <button
          className="management-filter-btn"
          onClick={() => {
            dispatch(
              statisticMgmtSlice.actions.setMonth(new Date().getMonth() + 1)
            );
            dispatch(
              statisticMgmtSlice.actions.setYear(new Date().getFullYear())
            );
            dispatch(
              statisticMgmtSlice.actions.setPieYear(new Date().getFullYear())
            );
            setInput({
              month: `${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
              year: new Date().getFullYear(),
              pieYear: new Date().getFullYear(),
            });
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default StatisticFilterSection;
