import { Route, Switch } from "react-router-dom";
import routes from "./routes";
import { Layout } from 'antd';

const { Content } = Layout;

const AuthLayout = (props) => {
    return(
        <Layout className="app-auth">
            <Content>
                <Switch>
                    {routes.map((prop, key) => {
                        return (
                        <Route
                            path={prop.path}
                            component={prop.component}
                            key={key}
                        />
                        );
                    })}
                </Switch>
            </Content>
            
        </Layout>
    )
}

export default AuthLayout;