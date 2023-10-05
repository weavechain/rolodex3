import React, { useEffect, useState } from "react";
import cx from "classnames";
import s from "./CompanyWidget.module.scss";

import CheckboxWidget from "../../../../components/CheckboxWidget/CheckboxWidget";
import ConfidentialComputingDialog from "../../../../components/ConfidentialComputingDialog/ConfidentialComputingDialog";
import ToggleWidget from "../../../../components/ToggleWidget/ToggleWidget";

export default function CompanyWidget({ data = {}, updateModel = () => {} }) {
	const [isComputational, setIsComputational] = useState(false);
	const [show, setShow] = useState(true);

	useEffect(() => {
		setShow(!!data.show);
		setIsComputational(!!data.compute);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	// ------------------------------------- METHODS -------------------------------------
	const updateComputation = () => {
		updateModel({ ...(data || {}), compute: !isComputational });
	};

	const toggleShow = (isVisible) => {
		updateModel({ ...(data || {}), show: isVisible });
	};

	return !data.value ? null : (
		<div className={s.root}>
			<div className={s.sectionHeader}>
				<div className={s.title}>Company</div>
				<ToggleWidget isVisible={show} onToggle={toggleShow} />
			</div>

			<div
				className={cx(s.sectionText, s.blue, {
					[s.restricted]: !show,
				})}
			>
				{data.value}
			</div>

			{show ? null : (
				<div className={s.computation}>
					<CheckboxWidget
						checked={isComputational}
						onChange={updateComputation}
						label={"Make available for Confidential Compute"}
					/>
					<ConfidentialComputingDialog />
				</div>
			)}
		</div>
	);
}
