import React from 'react'
import { BrowserRouter ,Switch, Route, Redirect } from 'react-router-dom'
import { useRole } from './pages/Login'

import Landing from './pages/landing'
import OrphanagesMap from './pages/orphanagesMap'
import Orphanage from './pages/Orphanage'
import CreateOrphanage from './pages/CreateOrphanage'
import Login from './pages/Login'
import DashboardPendents from './pages/Logged/DashboardPendents'
import DashboardRegistrateds from './pages/Logged/DashboardRegistrateds'
import DeleteOrphanage from './pages/Logged/DeleteOrphanage'
import UpdateOrphanage from './pages/Logged/UpdateOrphanage'
import OrphanageAprovation from './pages/Logged/OrphanageAprovation'
import SuccesRegistrate from './pages/SuccessRegistrate'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import CreateUsers from './pages/Logged/ADMIN/CreateUsers'
import Users from './pages/Logged/ADMIN/Users'

import { isAuthenticated } from './services/auth'

const PrivateRoute = ({component, ...rest}: any) => {
    const routeComponent = (props: any) => (
        isAuthenticated()
            ? React.createElement(component, props)
            : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    );
    return <Route {...rest} render={routeComponent}/>;
};

const PrivateRouteAdmin = ({component, ...rest}: any) => {
    const { role }  = useRole()

    const routeComponent = (props: any) => (
        
        isAuthenticated() && role === 'admin'
            ? React.createElement(component, props)
            : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    );
    return <Route {...rest} render={routeComponent}/>;
};

const LoginPage = ({component, ...rest}: any) => {
    const routeComponent = (props: any) => (
        isAuthenticated()
            ?   <Redirect to={{ pathname: "/dashboard/registrated", state: { from: props.location } }}/>
            :  React.createElement(component, props) 
    );
    return <Route {...rest} render={routeComponent}/>;
};


function Routes(){
 
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Landing}></Route>

                <LoginPage path='/login'component={Login}></LoginPage>
                <Route path='/forgot-my-password'component={ForgotPassword}></Route>
                <Route path='/reset-my-password'component={ResetPassword}></Route>

                <PrivateRoute path='/dashboard/pendents' component={DashboardPendents}></PrivateRoute>
                <PrivateRoute path='/dashboard/registrated' component={DashboardRegistrateds}></PrivateRoute>
                <PrivateRoute path='/orphanages/delete/:id' component={DeleteOrphanage}></PrivateRoute>
                <PrivateRoute path='/orphanages/Update/:id' component={UpdateOrphanage}></PrivateRoute>
                <PrivateRoute path='/orphanages/pending/:id' component={OrphanageAprovation}></PrivateRoute>

                <PrivateRouteAdmin path='/dashboard/create-users' component={CreateUsers}></PrivateRouteAdmin>
                <PrivateRouteAdmin path='/dashboard/users' component={Users}></PrivateRouteAdmin>
                
                <Route path='/orphanages/success' component={SuccesRegistrate}></Route>
                
                <Route path='/app' component={OrphanagesMap}></Route>

                <Route exact path='/orphanages/create' component={CreateOrphanage}></Route>
                <Route exact path='/orphanages/:id' component={Orphanage}></Route>
            </Switch>
        </BrowserRouter>
    )
}
export default Routes