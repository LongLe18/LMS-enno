import React from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import routes from "./routes";
import IndexHeader from '../../../components/parts/Headers/IndexHeader';
import Contract from 'components/parts/Contract/contract';
import Footer from "components/parts/Footers/Footer";

function UserLayout(props){
    const mainPanel = React.useRef();
    const location = useLocation();

    React.useEffect(() => {
        mainPanel.current.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        document.getElementById('fb-root').classList.add('show');
    }, [location]);

    return(
        <div ref={mainPanel}>
            <IndexHeader {...props}/>
            <Contract {...props} />
            
            <Switch>    
            {routes.map((prop, key) => {
                return (
                <Route
                    path={prop.path}
                    render={prop.render}
                    key={Number(key)}
                />
                );
            })}
            </Switch>
            <Footer />
        </div>
    )
}

export default UserLayout;