import React from "react";
import { NavItem, NavLink } from "reactstrap";
import { Link } from "react-router-dom";
import cx from "classnames";

import s from "./TabsWidget.module.scss";

const TabsWidget = ({ tabs = [], className = "" }) => {
	return (
		<div className={cx(s.root, className)}>
			{tabs.map((tab, index) => (
				<NavItem
					className={cx(s.tab, { [s.activeTab]: tab.isActive })}
					key={index}
				>
					{tab.url ? (
						<Link to={tab.url}>{tab.name}</Link>
					) : tab.onClick ? (
						<NavLink onClick={tab.onClick}>{tab.name}</NavLink>
					) : (
						<NavLink>{tab.name}</NavLink>
					)}
				</NavItem>
			))}
		</div>
	);
};

export default TabsWidget;
