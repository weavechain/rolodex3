import React from "react";

export default function FooterIcon({
	color = "#909090",
	width = 24,
	height = 24,
}) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="footerIcon" clipPath="url(#clip0_7_1238)">
				<path
					id="Vector"
					d="M7.2 17.6C8.96731 17.6 10.4 16.1673 10.4 14.4C10.4 12.6326 8.96731 11.2 7.2 11.2C5.43269 11.2 4 12.6326 4 14.4C4 16.1673 5.43269 17.6 7.2 17.6Z"
					fill={color}
				/>
				<path
					id="Vector_2"
					d="M14.8 20C15.9046 20 16.8 19.1046 16.8 18C16.8 16.8954 15.9046 16 14.8 16C13.6955 16 12.8 16.8954 12.8 18C12.8 19.1046 13.6955 20 14.8 20Z"
					fill={color}
				/>
				<path
					id="Vector_3"
					d="M15.1999 13.6C17.8509 13.6 19.9999 11.451 19.9999 8.8C19.9999 6.14903 17.8509 4 15.1999 4C12.5489 4 10.3999 6.14903 10.3999 8.8C10.3999 11.451 12.5489 13.6 15.1999 13.6Z"
					fill={color}
				/>
			</g>
			<defs>
				<clipPath id="clip0_7_1238">
					<rect width="24" height="24" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
