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
  DesktopOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import React, {useState} from 'react';
import StudentList from './component/student/StudentList';
import CourseList from './component/course/CourseList';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;



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
          <div className="logo" />
          <br></br>
          <br></br>
          <br></br>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<UserOutlined />}>
              <Link to="/admin/students">Students</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              <Link to="/admin/courses">Courses</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route path="/admin/students">
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Admin</Breadcrumb.Item>
                  <Breadcrumb.Item>Students</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Students Management" >
                  <StudentList />
                </Card>
              </Route>
              <Route path="/admin/courses">
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Admin</Breadcrumb.Item>
                  <Breadcrumb.Item>Cousrses</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Courses Management ">
                  <CourseList />
                </Card>
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
