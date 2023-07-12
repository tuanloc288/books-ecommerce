import { multipleColor } from '../others/utils'
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2'
import { useEffect, useState } from 'react';
ChartJS.register(...registerables);

const BarChart = ({title, label , data, about, showLegend, color, height, width}) => {
    const [colorList, setColorList] = useState([]);

    useEffect(() => {
        if(label.length !== 0)
            setColorList(multipleColor(label.length))
    }, [label])

    return (
        <div>
            {
                colorList.length !== 0 ? (
                    <Bar
                        data={{
                            labels: label, 
                            datasets: [{
                                label: about,
                                data,
                                backgroundColor: color ? color : colorList
                            }] 
                        }}
                        height={height ? height : 300}
                        width={width ? width: 400}
                        options={{
                            maintainAspectRatio: false,
                            plugins:{
                                title: {
                                    display: true,
                                    text: title
                                },
                                legend: {
                                    display: showLegend
                                },
                                tooltips: {
                                    callbacks: {
                                       label: function(tooltipItem) {
                                              return tooltipItem.yLabel;
                                       }
                                    }
                                }
                            }       
                        }}
                    />
                ) : <div className='loader'></div>
            }
        </div>
    )
}

export default BarChart