import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import s from "./Charts.module.scss";

const COLORS = ["#52E8CD", "#17AD92", "#F5FAFE", "#97F1E1"];
const RADIAN = Math.PI / 180;

function SimplePieChart({ title, pieData }) {

	// ------------------------------------- METHODS -------------------------------------
	const renderCustomizedLabel = (item) => {
		const { cx, cy, midAngle, innerRadius, outerRadius, name, value, index } =
			item;

		const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
		const x = cx + radius * Math.cos(-midAngle * RADIAN) * 0.7;
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		const useWhite = COLORS[index] === "#17AD92";

		return (
			<>
				<text
					x={x}
					y={y}
					fill={useWhite ? "white" : "#1a1c21"}
					textAnchor={x > cx ? "start" : "end"}
					stroke="none"
					dominantBaseline="central"
					className="recharts-text recharts-pie-label-text"
				>
					{name}
				</text>
				<text
					x={x}
					y={y + 15}
					fill={useWhite ? "white" : "#1a1c21"}
					textAnchor={x > cx ? "start" : "end"}
					stroke="none"
					className={useWhite ? "recharts-percent bg" : "recharts-percent"}
				>
					{`${value.toFixed(0)}%`}
				</text>
			</>
		);
	};

	return !pieData ? null : (
		<div className={s.root}>
			<div className={s.title}>{title}</div>

			<ResponsiveContainer width="100%">
				<PieChart>
					<Pie
						height={250}
						data={pieData}
						cx="50%"
						cy="50%"
						outerRadius={140}
						innerRadius="40%"
						nameKey="name"
						dataKey="value"
						labelLine={false}
						stroke=""
						//fill="#17AD92"
						label={renderCustomizedLabel}
					>
						{pieData.map((entry, index) => (
							<Cell key={entry} label="sdfsdf" fill={COLORS[index % COLORS.length]} />
						))}
					</Pie>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}

export default React.memo(SimplePieChart);