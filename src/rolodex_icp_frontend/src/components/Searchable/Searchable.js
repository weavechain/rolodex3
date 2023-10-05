import React, { Component } from "react";
import cx from "classnames";
import SearchableSelected from "./SearchableSelected";
import SearchableIcons from "./SearchableIcons.js";

import "./Searchable.scss";
import SearchableOptions from "./SearchableOptions";

class Searchable extends Component {
	constructor(props) {
		super(props);
		let value = (() => {
				if (!props.multiple) {
					return props.value === 0 || props.value === "" || props.value
						? props.value
						: null;
				} else {
					return Array.isArray(props.value) ? props.value : [];
				}
			})(),
			search = (() => {
				if (props.multiple) {
					return "";
				} else {
					const option =
						typeof props.value === "string"
							? props.options.find((opt) => opt.value === value)
							: props.options.find((opt) => opt.value?.id === props.value?.id);

					return option ? option.label : "";
				}
			})();

		this.state = {
			value,
			options: props.options,
			optionsVisible: [],
			search,
			assume: "",
			multiple: props.multiple,
			disabled: props.disabled || false,
			placeholder: props.placeholder || "Search",
			notFoundText: props.notFoundText || "No result found",
			noInput: props.noInput || false,
			hideSelected: props.hideSelected || false,
			opened: false,
			arrow: {
				position: -1,
			},
			listMaxHeight: props.listMaxHeight || 140,
		};

		this.onFocus = this.onFocus.bind(this);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.options !== prevState.options) {
			const options = nextProps.options;
			const disabled = nextProps.disabled;
			const placeholder = nextProps.placeholder;
			const value = !prevState.value
				? nextProps.value
				: prevState.value !== nextProps.value
				? nextProps.value
				: prevState.value;

			let search = (() => {
				if (nextProps.multiple) return "";

				const option =
					typeof value === "string"
						? options.find((opt) => opt.value === value)
						: options.find((opt) => opt.value?.id === value?.id);
				return option?.label || "";
			})();

			return { options, value, search, disabled, placeholder };
		}

		return null;
	}

	componentDidMount() {
		let component = this.container,
			findParent = (e) => {
				if (!e || !e.parentNode) {
					return false;
				}
				if (e === component) {
					return true;
				}
				return findParent(e.parentNode);
			};

		this.documentClick = (e) => {
			if (this.state.opened) {
				if (!findParent(e.target)) this.onBlur();
			}
		};
		document.addEventListener("click", this.documentClick);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.documentClick);
	}

	afterChange = () => {
		let { value } = this.state;
		this.props.onSelect && this.props.onSelect(value);
	};

	onBlur = () => {
		let { value, options, arrow, multiple } = this.state;
		arrow.position = -1;
		let obj = {
			optionsVisible: [],
			assume: false,
			opened: false,
			arrow,
			search: "",
		};
		if (!multiple) {
			let option =
				typeof value === "string"
					? options.find((opt) => opt.value === value)
					: options.find((opt) => opt.value?.id === value?.id);

			obj.search = option ? option.label : "";
		}
		this.setState(obj);
	};

	onFocus() {
		let { disabled } = this.state;
		if (disabled) return;
		this.input && this.input.focus();
		this.setState({
			opened: true,
			optionsVisible: this.getOptionsVisible({
				ignoreSearch: true,
			}),
		});
	}

	select = (option, isActive) => {
		let { value, multiple } = this.state;
		let changed = false;

		if (option.disabled) return;

		if (!multiple) {
			if (value !== option.value) changed = true;
			value = option.value;
		} else {
			if (isActive) {
				changed = true;
				value = value.filter((v) => v !== option.value);
			} else {
				if (value.indexOf(option.value) < 0) {
					value.push(option.value);
					changed = true;
				}
			}
		}

		this.setState(
			{
				value,
			},
			() => {
				if (!multiple) this.onBlur();
				if (changed) this.afterChange();
			}
		);
	};

	keyDown = (e) => {
		let { assume = "", arrow, search, optionsVisible, opened } = this.state;
		if (opened && (e.keyCode === 9 || e.keyCode === 13) && assume) {
			e.preventDefault();
			this.select(assume);
		}

		if ((!opened && e.keyCode === 13) || e.keyCode === 40 || e.keyCode === 38) {
			e.preventDefault();
			this.onFocus();
		}

		if (e.keyCode === 27 || (e.keyCode === 13 && !assume && opened)) {
			e.preventDefault();
			this.onBlur();
		}

		if (e.keyCode === 40 && optionsVisible.length) {
			e.preventDefault();
			if (arrow.position < optionsVisible.length - 1) {
				arrow.position++;
			} else {
				arrow.position = 0;
			}
			let assume = optionsVisible[arrow.position];
			search = assume.label.slice(0, search.length);
			this.setState(
				{
					search,
					arrow,
					assume,
				},
				this.scrollList
			);
		}

		if (e.keyCode === 38 && optionsVisible.length) {
			e.preventDefault();
			if (arrow.position <= 0) {
				arrow.position = optionsVisible.length - 1;
			} else {
				arrow.position--;
			}
			let assume = optionsVisible[arrow.position];
			search = assume.label.slice(0, search.length);
			this.setState(
				{
					search,
					arrow,
					assume,
				},
				this.scrollList
			);
		}
	};

	onChange = (event) => {
		let { arrow, optionsVisible } = this.state;
		let value = event.target.value;

		arrow.position = -1;
		this.setState(
			{
				search: value,
				arrow,
				opened: true,
			},
			() => {
				const match = optionsVisible.find(
					(option) => option.label.toLowerCase() === value.toLowerCase()
				);
				if (match) {
					this.select(match);
				} else {
					this.sort();
				}
			}
		);
	};

	scrollList() {
		let { list } = this,
			{ arrow } = this.state,
			target = ".searchable__list__item--" + arrow.position;
		if (list) {
			let item = list.querySelector(target);
			item && item.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}

	getOptionsVisible({ ignoreSearch = false } = {}) {
		let { hideSelected, multiple, value, options, search } = this.state,
			result = options.filter((option) => {
				return ignoreSearch
					? option
					: option.label.toLowerCase().indexOf(search.toLowerCase()) >= 0;
			});
		if (hideSelected) {
			if (!multiple) {
				result = result.filter((option) => {
					return option.value !== value;
				});
			} else {
				result = result.filter((option) => {
					return value.indexOf(option.value) < 0;
				});
			}
		}
		return result;
	}

	sort() {
		let { search } = this.state,
			firsts = [],
			seconds = [],
			options = this.getOptionsVisible();
		if (search) {
			options = options.sort((a, b) => {
				return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
			});
			seconds = options.filter((item) => {
				return item.label.toLowerCase().indexOf(search.toLowerCase()) === 0;
			});
			firsts = seconds.filter((item) => {
				return item.label.indexOf(search) === 0;
			});
			seconds = seconds.filter((item) => {
				return item.label.indexOf(search) !== 0;
			});
			options = options.filter((item) => {
				return item.label.toLowerCase().indexOf(search.toLowerCase()) !== 0;
			});
			options = [...firsts, ...seconds, ...options];
		}
		this.setState(
			{
				optionsVisible: options,
			},
			() => {
				this.findAssumption();
			}
		);
	}

	findAssumption() {
		let { optionsVisible, search } = this.state,
			result = false,
			assume = optionsVisible.find((item) => {
				return item.label.indexOf(search) === 0;
			}),
			assumeLower = optionsVisible.find((item) => {
				return item.label.toLowerCase().indexOf(search.toLowerCase()) === 0;
			});
		if (search && (assume || assumeLower)) result = assume || assumeLower;

		this.setState({
			assume: result,
		});
	}

	onSearchClick = () => {
		let { noInput, opened } = this.state;

		let action = !noInput ? this.onFocus : opened ? this.onBlur : this.onFocus;
		action();
	};

	toggleSearch = (e) => {
		let { opened } = this.state;

		e.stopPropagation();
		let action = opened ? this.onBlur : this.onFocus;
		action();
	};

	render() {
		let {
			search,
			value,
			multiple,
			disabled,
			options,
			optionsVisible,
			noInput,
			assume,
			opened,
			placeholder,
			arrow,
			listMaxHeight,
			notFoundText,
		} = this.state;

		return (
			<div
				className={[
					"searchable",
					this.props.className,
					opened ? "searchable--active" : "",
					disabled ? "searchable--disabled" : "",
					multiple ? "searchable--multiple" : "",
					multiple ? "searchable--multiple" : "",
					this.props.hasDarkTheme ? "dark" : "",
				].join(" ")}
				ref={(node) => (this.container = node)}
			>
				<div className="searchable__controls" onClick={this.onSearchClick}>
					<div className="searchable__controls__list-input">
						{multiple ? (
							<SearchableSelected
								selected={value}
								options={this.state.options}
								itemsType={this.props.itemsType}
							/>
						) : null}

						{multiple && noInput && !value.length && (
							<div className="searchable__controls__placeholder">
								{placeholder}
							</div>
						)}
						<div
							className={cx(
								"searchable__controls__input",
								multiple && noInput ? "searchable__controls__input--hidden" : ""
							)}
						>
							<input
								type="text"
								value={search}
								placeholder={!assume ? placeholder : ""}
								onChange={this.onChange}
								onKeyDown={this.keyDown}
								ref={(node) => (this.input = node)}
								readOnly={noInput}
								disabled={disabled}
							/>

							{assume && (
								<span className="searchable__controls__input__assume">
									{assume.label.split("").map((char, index) => {
										return (
											<span
												key={char + index}
												className={[
													"searchable__controls__input__assume__char",
													char === char.toUpperCase()
														? "searchable__controls__input__assume__char--upper"
														: "searchable__controls__input__assume__char--lower",
													index <= search.length - 1
														? "searchable__controls__input__assume__char--hidden"
														: "",
												].join(" ")}
											>
												{index <= search.length - 1 ? search[index] : char}
											</span>
										);
									})}
								</span>
							)}
						</div>
					</div>
					{options && options.length === 1 ? null : (
						<div
							className="searchable__controls__arrow"
							onClick={this.toggleSearch}
						>
							{SearchableIcons["arrow"]}
						</div>
					)}
				</div>

				<SearchableOptions
					value={value}
					multiple={multiple}
					opened={opened}
					options={optionsVisible}
					arrow={arrow}
					listMaxHeight={listMaxHeight}
					notFoundText={notFoundText}
					showRadios={this.props.showRadios}
					onSelect={this.select}
				/>
			</div>
		);
	}
}

export default Searchable;
