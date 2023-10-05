import React from "react";
import DatePicker from "react-datepicker";
import moment from "moment";

import s from "./DateTimePicker.module.scss";

const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";

export default function DateTimePicker({
	selecteDate,
	onChange = () => {},
	placeholderText = "YYYY-MM-DD",
	dateFormat = "yyyy-MM-dd",
	showTimeSelect = false,
	title = "",
	note = "",
	inline,
}) {
	const selected = selecteDate ? moment(selecteDate).toDate() : null;
	const date_format = dateFormat || DATE_FORMAT;

	return (
		<div className={s.root}>
			{title ? <p className={s.title}>{title}</p> : null}
			<DatePicker
				className="form-control"
				selected={selected}
				placeholderText={placeholderText}
				onChange={(date) =>
					onChange(date ? moment(date).format(DATE_FORMAT) : "")
				}
				//maxDate={addDays(new Date(), 5)}
				timeInputLabel="Time:"
				showTimeSelect={showTimeSelect}
				dateFormat={date_format}
				timeFormat="p"
				timeIntervals={5}
				inline={inline}
			/>
			{note ? <p className={s.note}>{note}</p> : null}
		</div>
	);
}
