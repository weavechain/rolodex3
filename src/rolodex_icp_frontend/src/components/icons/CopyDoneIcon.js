import React from "react";

export default function CopyDoneIcon({
	color = "#1CD0AF",
	width = 24,
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
				d="M18.75 3H19.5C19.8978 3 20.2794 3.15804 20.5607 3.43934C20.842 3.72064 21 4.10218 21 4.5V21C21 21.3978 20.842 21.7794 20.5607 22.0607C20.2794 22.342 19.8978 22.5 19.5 22.5H4.5C4.10218 22.5 3.72064 22.342 3.43934 22.0607C3.15804 21.7794 3 21.3978 3 21V4.5C3 4.10218 3.15804 3.72064 3.43934 3.43934C3.72064 3.15804 4.10218 3 4.5 3H5.25"
				stroke={color}
				strokeWidth="2.5"
				strokeMiterlimit="10"
				strokeLinecap="square"
			/>
			<path
				d="M15.75 1.5H8.25V4.5H15.75V1.5Z"
				stroke={color}
				strokeWidth="2"
				strokeMiterlimit="10"
				strokeLinecap="square"
			/>
			<path
				d="M7.5 14.25L9.75 16.5L16.5 9.75"
				stroke={color}
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinecap="square"
			/>
		</svg>
	);
}
