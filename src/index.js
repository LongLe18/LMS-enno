import { Provider } from 'react-redux';
import * as ReactDOMClient from 'react-dom/client';

import store from 'redux/store';

// styles
import "bootstrap/scss/bootstrap.scss";
import "assets/scss/paper-kit.scss?v=1.3.0";
import "assets/scss/paper-dashboard.scss?v=1.3.0";
import "assets/demo/demo.css?v=1.3.0";
import "assets/demo/demoAdmin.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import 'antd/dist/antd.css';
import "@ant-design/flowchart/dist/index.css"

import App from './App';
import { AuthProvider } from 'context/AuthProvider';

const root = ReactDOMClient.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <AuthProvider>
            <App /> 
        </AuthProvider>
    </Provider>)
