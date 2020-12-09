import React from 'react';
import Chart from 'chart.js';

const BarChart = props => {
    let canvasRef = React.useRef(null);
    let labelsUpvote = Object.keys(props.upvotes);
    let valuesUpvote = Object.values(props.upvotes);
    let valuesDownvote = Object.values(props.downvotes);

    React.useEffect(() => {
        if(canvasRef.current) {
            new Chart(canvasRef.current, {
                type: "bar",
                data: {
                    labels: labelsUpvote,
                    datasets: [
                        {
                            label: 'Upvote',
                            data: valuesUpvote,
                            backgroundColor: "aqua"
                        },
                        {
                            label: 'Downvote',
                            data: valuesDownvote,
                            backgroundColor: "yellow"
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        fontColor: "black",
                        fontFamily: "arial",
                        text: "Reaction data for the last five days",
                        fontSize: "23"
                    }
                }
            });
        }
    });

    return (<canvas ref={canvasRef}/>)
}

export default BarChart;