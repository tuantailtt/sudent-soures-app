import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, Form } from 'antd';
const { confirm } = Modal;

function RegisterStudent(props){

    const [course , setCourse] = useState({});
    const [studentsRegisted, setStudentRegisted] = useState([]);
    const [studentUnregisted, setStudentUnregisted] = useState([]);
    const [form] = Form.useForm();

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 16,
        },
    };
    const studentRegistedtColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Passport Number', dataIndex: 'passportNumber',key: 'passportNumber'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (student) => <Button type="danger" onClick={() => showRemoveConfirm(student)}>Remove</Button>
        }
    ];
    const studentUnregistedtColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Passport Number', dataIndex: 'passportNumber',key: 'passportNumber'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (student) => <Button type="primary" onClick={() => showRegiterConfirm(student)}>Register</Button>
        }
    ];
    function showRegiterConfirm(student){
        confirm({
            title: 'Are you sure delete this student from ?'+course.name,
            content: student.name,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                registerStudent(student);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    function showRemoveConfirm(student){
        confirm({
            title: 'Are you sure register this student for ?'+course.name,
            content: student.name,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                removeStudent(student);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    };
    function registerStudent(student){
        setStudentUnregisted(studentUnregisted.filter(element => element.id !== student.id ));
        setStudentRegisted([...[student], ...studentsRegisted] );
    }
    function removeStudent(student){
        setStudentRegisted(studentsRegisted.filter(element => element.id !== student.id ));
        setStudentUnregisted([...[student], ...studentUnregisted] );
    }

    function showSaveConfirm(course){
        confirm({
            title: 'Are you sure save this your change ?',
            content: course.name,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                updateCourse(course);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    };
    function updateCourse(course){
        let courseDto = {
            "name": course.name,
            "description": course.description,
            "students": studentsRegisted.map(student => {
                return {"id":student.id}
            })
        };
        console.log(courseDto);
        axios.put("/api/courses/"+props.id,courseDto)
            .then(function(response){
                console.log(response);
            })
            .catch(function (error) {
                alert(error);
              })
    }
    
    useEffect(()=>{
        axios.get("/api/courses/"+props.id)
            .then(function(response){
                console.log('course',response.data);
                setCourse(response.data);
                form.setFieldsValue({
                    name: response.data.name,
                    description: response.data.description,
                });
                let studentRegistedList = response.data.students.map(row=>({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    passportNumber: row.passportNumber
                }))
                setStudentRegisted(studentRegistedList);
                axios.get("/api/students")
                    .then(function(response){
                        let studentList = response.data.map(row => ({
                            key: row.id,
                            id: row.id,
                            name: row.name,
                            passportNumber: row.passportNumber
                        }));
                        let studentUnregistedList = studentList.filter((std) =>{
                            let isIncluse = false;
                                studentRegistedList.forEach(element => {
                            if(element.id === std.id) isIncluse=true
                        });
                        return isIncluse===false;
                        })
                        setStudentUnregisted(studentUnregistedList);
                    }).catch(function(error){
                        console.log('err',error);
                    })
            }).catch(function(error){
                console.log('err',error);
            })
    },[props.id]);

    return (
        <div>
             <Form 
                {...layout} 
                form={form}
                onFinish={showSaveConfirm}
            >
                <Row gutter={14}>
                    <Col className="gutter-row" span={9}></Col>
                    <Col className="gutter-row" span={6}>
                        <Form.Item 
                            name={'name'}
                            label="Name"
                            rules={[
                            {
                                required: true,
                            },]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name={'description'}
                            label="Description"
                        >
                            <Input />
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Save</Button>
                    </Col>
                    <Col className="gutter-row" span={9}></Col>
                </Row>
                
                <Row >
                    <Col span={12}>
                        <h2>Registered Course</h2>
                        <Table dataSource={studentsRegisted} 
                            columns={studentRegistedtColums} 
                            pagination={{ position: ["bottomCenter"] ,pageSize: 5 }}
                        />
                    </Col>
                    <Col span={12}>
                        <h2>Unregistered Course</h2>
                        <Table dataSource={studentUnregisted} 
                            columns={studentUnregistedtColums} 
                            pagination={{ position: ["bottomCenter"] ,pageSize: 5 }}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
export default RegisterStudent;