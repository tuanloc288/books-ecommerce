import { useEffect } from "react";
import { useSelector } from "react-redux";
import StatisticFirstSection from "./StatisticFirstSection";
import "./statisticManagement.css";
import StatisticSecondSection from "./StatisticSecondSection";
import StatisticThirdSection from "./StatisticThirdSection";

const StatisticManagement = () => {

  const month = useSelector(state => state.statisticMgmt.month)

  useEffect(() => {

  }, [month])

  return (
    <div className="panel-container">
      <div className="panel-title">Quản lý thống kê</div>
      <div className="panel-content">
        <div id="statistic-container">
          <div id="statistic-left-section">
            <div style={{
              textAlign: 'center',
              fontSize: 18,
            }}> Thống kê sơ bộ tháng {month}/{new Date().getFullYear()} so với tháng {month - 1 <= 0 ? 12 : month - 1}/{month - 1 <= 0 ? new Date().getFullYear() - 1 : new Date().getFullYear()} </div>
            <StatisticFirstSection/>
            <StatisticSecondSection/>
          </div>
          <div id="statistic-right-section">
            <StatisticThirdSection/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticManagement;
