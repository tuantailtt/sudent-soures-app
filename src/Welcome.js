import React from 'react';
import { Row, Col } from 'antd';
import logoReact from './image/logo192.png';
import logoSpringBoot from './image/logoSpringBoot.png';
import plus from './image/plus.jpg';


function Welcome() {
  
  return (
    <div>
      <Row style={{marginTop:"50px"}}>
        <Col span={6}></Col>
        <Col span={5} style={{textAlign:"center"}}>
          <img src={logoSpringBoot} alt="Logo Spring Boot"/>
          <h2>Java Spring Boot</h2>
          <span>Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications that you can "just run".</span>
        </Col>
        <Col span={2} style={{textAlign:"center"}}>
          <img src={plus} alt="Plus" style={{height:"50px",marginTop:"80px"}}/>
        </Col>
        <Col span={5} style={{textAlign:"center"}}>
          <img src={logoReact} alt="Logo React"/>
          <h2>ReactJS</h2>
          <span>React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.</span>
        </Col>
        <Col span={6}></Col>
      </Row>
      <br></br>
      <br></br>
      <br></br>
      <Row>
        <Col span={6}></Col>
        <Col span={12} >
          <div style={{textAlign:"center"}}>
            <h1>Welcome to the Demo Application is based Java Spring Boot (Server) and ReactJS (Client)</h1>
          </div>
          <p style={{textAlign:"center"}}>Description:</p>
          <ul style={{marginLeft:"15%"}}>
            <li>A student can register many courses, and a course can be registered by many students.</li>
            <li>
              Application has function list:
              <ul>
                <li>List all students (pagination, search, advance search)</li>
                <li>List all courses (pagination, search, advance search)</li>
                <li>Register courses</li>
              </ul>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}
export default Welcome; 
