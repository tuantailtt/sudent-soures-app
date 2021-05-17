import './App.css';
import 'antd/dist/antd.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Layout, Menu, Breadcrumb,Space,Card} from 'antd';
import { 
  DesktopOutlined,
  PieChartOutlined,
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
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              <Link to="/students">Students management</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              <Link to="/courses">Courses management</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Switch>
              <Route path="/students">
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Admin</Breadcrumb.Item>
                  <Breadcrumb.Item>Students</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Students management" >
                  <StudentList />
                </Card>
              </Route>
              <Route path="/courses">
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Admin</Breadcrumb.Item>
                  <Breadcrumb.Item>Cousrses</Breadcrumb.Item>
                </Breadcrumb>
                <Card title="Courses management">
                  <CourseList />
                </Card>
              </Route>
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
      {/* <div className="App">
          <nav>
            <ul>
              <li>
                <Link to="/students">Students management</Link>
              </li>
              <li>
                <Link to="/courses">Courses management</Link>
              </li>
            </ul>
          </nav>
          <Switch>
            <Route path="/students">
              <StudentList />
            </Route>
            <Route path="/courses">
              <CourseList />
            </Route>
          </Switch>
      </div> */}
    </Router>
  );
}

export default App;
