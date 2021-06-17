import './App.css';
import 'antd/dist/antd.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Layout, Menu, Breadcrumb, Card} from 'antd';
import { 
  ContainerOutlined,
  UserOutlined
} from '@ant-design/icons';
import React, {useState} from 'react';
import StudentList from './component/student/StudentList';
import CourseList from './component/course/CourseList';
import Welcome from './Welcome';
import StudentDetail from './component/student/Student-detail';
import CourseInStudentDetail from './component/student/CourseInStudentDetail';

import logo from './image/logo192.png';
const { Header, Content, Footer, Sider } = Layout;


function App() {

  const [collapsed, setCollapsed] = useState(false);

  function onCollapse () {
    console.log(collapsed);
    setCollapsed(!collapsed);
  };

  

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div  className="logo"><img src={logo} alt="logo"/>Demo Application</div>
          <Menu theme="dark" defaultSelectedKeys={[]} mode="inline">
          <Menu.Item key="1">
              <Link to="/admin/welcome">Welcome</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              <Link to="/admin/students">Students</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<ContainerOutlined />}>
              <Link to="/admin/courses">Courses</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Switch>
            <Route path="/admin/welcome" exact>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Admin</Breadcrumb.Item>
                  <Breadcrumb.Item>Welcome</Breadcrumb.Item>
                </Breadcrumb>
                <Card  title="Welcome" style={{height:"780px"}}>
                  <Welcome />
                </Card>
              </Route>
              <Route path="/admin/students" exact>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Admin</Breadcrumb.Item>
                  <Breadcrumb.Item>Students</Breadcrumb.Item>
                </Breadcrumb>
                <Card  >
                  <StudentList />
                </Card>
              </Route>
              <Route path="/admin/courses" exact>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Admin</Breadcrumb.Item>
                  <Breadcrumb.Item>Cousrses</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Courses Management ">
                  <CourseList />
                </Card>
              </Route>
              <Route path="/admin/student/:id?" exact>
                <StudentDetail />
              </Route>
              <Route path="/admin/student/:studentId?/course/:courseId?" exact>
                <CourseInStudentDetail />
              </Route>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;




