import React from "react";

export default function PencilIcon({
	color = "#78909C",
	width = 14,
	height = 14,
}) {
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g id="pencil 1" clipPath="url(#clip0_726_546)">
				<g id="Group">
					<path
						id="Vector"
						d="M8.35803 2.72534L11.2747 5.64201"
						stroke={color}
						strokeWidth="1.16667"
						strokeMiterlimit="10"
					/>
					<path
						id="Vector_2"
						d="M4.66663 12.2501L1.16663 12.8334L1.74996 9.33341L9.57479 1.50858C9.79358 1.28986 10.0903 1.16699 10.3996 1.16699C10.709 1.16699 11.0057 1.28986 11.2245 1.50858L12.4915 2.77558C12.7102 2.99436 12.833 3.29105 12.833 3.60041C12.833 3.90977 12.7102 4.20646 12.4915 4.42524L4.66663 12.2501Z"
						stroke={color}
						strokeWidth="1.16667"
						strokeMiterlimit="10"
						strokeLinecap="square"
					/>
				</g>
			</g>
			<defs>
				<clipPath id="clip0_726_546">
					<rect width="14" height="14" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
