import React, { useState } from "react";

import { NavLink } from "react-router-dom";

const Submenu = (props) => {
    const [subnav, setSubnav] = useState(false);

    const showSubnav =  () => setSubnav(!subnav);
    // verifies if routeName is the one active (in browser input)
    const activeRoute = (routeName) => {
        return props.prop.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    };

    return (
        <>
            <li className={ activeRoute(props.item.path) + (props.item.pro ? " active-pro" : "")} style={{display: props.item.hide ? "none" : "", width:"95%"}}>
                <NavLink
                    to={props.item.path}
                    className="nav-link nav-class"
                    activeClassName="active" onClick={props.item.sub && showSubnav}
                >
                    <i className={props.item.icon} style={{fontSize: "16px"}}/>
                    <p className="font-weight-5" style={{width: "60%"}}>{props.item.name}</p>
                    {props.item.sub && subnav 
                    ? <i className="nc-icon nc-minimal-up" style={{fontSize: "14px"}}></i>
                    : props.item.sub
                    ? <i className="nc-icon nc-minimal-down" style={{fontSize: "14px"}}></i>
                    : null}
                </NavLink>
                {subnav && props.item.sub.map((item, index) => {
                    return (
                        <ul key={index}>
                            <NavLink
                                to={item.path}
                                className="nav-link nav-class white-text"
                                activeClassName="active"
                            >
                                <i className={item.icon} style={{fontSize: "16px"}}/>
                                <p className="font-weight-4" style={{width: "60%"}}>{item.name}</p>
                            </NavLink>
                        </ul>
                    )
                })}
            </li>
        </>
    )
}

export default Submenu;