import { useEffect, useRef } from "react";

const MetamaskCheckHelper = ({ triggered }) => {
	let downloadTriggeredRef = useRef(triggered);

	useEffect(() => {
		downloadTriggeredRef.current = triggered;
	}, [triggered]);

	useEffect(() => {
		if (!window.ethereum) {
			window.addEventListener("focus", onFocus);
		}

		return () => {
			window.removeEventListener("focus", onFocus);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onFocus = () => {
		// If the user triggered metamask download
		if (downloadTriggeredRef.current) {
			window.location.reload();
		}
	};

	return null;
};

export default MetamaskCheckHelper;
