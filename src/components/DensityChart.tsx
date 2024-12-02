import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const kernelDensityEstimation = (x: number[], data: number[], bandwidth: number) => {
    const gaussianKernel = (u: number) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);

    return x.map((xi) =>
        data.reduce((sum, di) => sum + gaussianKernel((xi - di) / bandwidth), 0) /
        (data.length * bandwidth)
    );
};

const DensityChart = () => {
    const numbers = [1.2, 1.2, 1.2, 1.2, 1.2, 2.5, 3.1, 4.7, 5.8, 6.3, 7.9, 8.1, 9.6, 10.4];

    const xMin = Math.min(...numbers);
    const xMax = Math.max(...numbers);
    const step = 0.1;
    const xRange = Array.from({ length: Math.ceil((xMax - xMin) / step) + 1 }, (_, i) => xMin + i * step);

    const bandwidth = 0.5;
    const densities = kernelDensityEstimation(xRange, numbers, bandwidth);

    const data = {
        labels: xRange.map((x) => x.toFixed(1)),
        datasets: [
            {
                label: "Density",
                data: densities,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Kernel Density Estimation (KDE)",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Value",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Density",
                },
            },
        },
    };

    return <>
        <div className="w-3/5 mx-auto">
            <Line data={data} options={options} />
        </div>
    </>
};

export default DensityChart;
