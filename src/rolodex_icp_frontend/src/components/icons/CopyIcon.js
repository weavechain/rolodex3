import React from "react";

export default function CopyIcon({
	color = "#78909c",
	width = 25,
	height = 24,
}) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 25 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M19.25 3H20C20.3978 3 20.7794 3.15804 21.0607 3.43934C21.342 3.72064 21.5 4.10218 21.5 4.5V21C21.5 21.3978 21.342 21.7794 21.0607 22.0607C20.7794 22.342 20.3978 22.5 20 22.5H5C4.60218 22.5 4.22064 22.342 3.93934 22.0607C3.65804 21.7794 3.5 21.3978 3.5 21V4.5C3.5 4.10218 3.65804 3.72064 3.93934 3.43934C4.22064 3.15804 4.60218 3 5 3H5.75"
				stroke={color}
				strokeWidth="2.5"
				strokeMiterlimit="10"
				strokeLinecap="square"
			/>
			<path
				d="M16.25 1.5H8.75V4.5H16.25V1.5Z"
				stroke={color}
				strokeWidth="2"
				strokeMiterlimit="10"
				strokeLinecap="square"
			/>
		</svg>
	);
}
