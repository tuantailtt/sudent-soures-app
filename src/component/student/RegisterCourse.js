import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, Select,Form, InputNumber } from 'antd';
const { confirm } = Modal;



function RegisterCourse(props){

    const [student , setStudent] = useState({});
    const [coursesRegisted, setCoursesRegisted] = useState([]);
    const [coursesNotRegisted, setCoursesNotRegisted] = useState([]);
    const [form] = Form.useForm();
    
    
    
    const layout = {
        labelCol: {
          span: 7,
        },
        wrapperCol: {
          span: 17,
        },
    };
    const courseRegistedtColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (course) => <Button type="danger" onClick={() => showRemoveConfirm(course)}>Remove</Button>
                
        }
    ];
    const courseNotRegistedColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (course) => <Button type="primary" onClick={() => showRegiterConfirm(course)}>Register</Button>
                
        }
    ];
    function showRegiterConfirm(course){
        confirm({
            title: 'Are you sure register this course for ?'+student.name,
            content: course.name,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                registerCourse(course);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    };
    function showRemoveConfirm(course){
        confirm({
            title: 'Are you sure delete this course from ?'+student.name,
            content: course.name,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                removeCourse(course);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    };
    function registerCourse(course){
        setCoursesNotRegisted(coursesNotRegisted.filter(element => element.id !== course.id ));
        setCoursesRegisted([...[course], ...coursesRegisted] );
    }
    function removeCourse(course){
        setCoursesRegisted(coursesRegisted.filter(element => element.id !== course.id ));
        setCoursesNotRegisted([...[course], ...coursesNotRegisted] );
    }

   
    function showSaveConfirm(student){
        confirm({
            title: 'Are you sure save this your change ?',
            content: student.name,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                updateStudent(student);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    };
    function updateStudent(student){
        let studentDto = {
            "name": student.name,
            "yearOld": student.yearOld,
            "sex": student.sex==="1"?true:student.sex==="0"?false:null,
            "address": student.address,
            "passportNumber": student.passportNumber,
            "phoneNumber": student.phoneNumber,
            "courses": coursesRegisted.map(course => {
                return {"id":course.id}
            })
        };
        console.log(studentDto);
        axios.put("/api/students/"+props.id,studentDto)
            .then(function(response){
                console.log(response);
            })
            .catch(function (error) {
                alert(error);
              })
    }

    useEffect(() => {
        axios.get("/api/students/"+props.id)
        .then(function (response) {
            console.log('student',response.data);
            form.setFieldsValue({
                name: response.data.name,
                yearOld: response.data.yearOld,
                sex: response.data.sex===true?"1":response.data.sex===false?"0":"",
                passportNumber: response.data.passportNumber,
                phoneNumber:response.data.phoneNumber,
                address:response.data.address
            })
            setStudent({
                name: response.data.name,
                passportNumber: response.data.passportNumber,
                yearOld: response.data.yearOld,
                sex: response.data.sex===true?"1":"0",
                phoneNumber: response.data.phoneNumber,
                address: response.data.address
            });
            let courseRegistedList = response.data.courses.map(row => ({
                key: row.id,
                id: row.id,
                name: row.name,
                description: row.description
            }));
            setCoursesRegisted(courseRegistedList);
            axios.get("/api/courses")
                .then(function(response){
                    console.log('courses',response.data);
                    let courseList = response.data.map(row => ({
                        key: row.id,
                        id: row.id,
                        name: row.name,
                        description: row.description
                    }));
                    let coursesNotRegistedList = courseList.filter((course)=>{
                        let isIncluse = false;
                        courseRegistedList.forEach(element => {
                            if(element.id === course.id) isIncluse=true
                        });
                        return isIncluse===false;
                    })
                    setCoursesNotRegisted(coursesNotRegistedList)
                })
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
                    <Col className="gutter-row" span={8}>
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
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Form.Item
                            name={'yearOld'}
                            label="Age"
                            rules={[
                            {
                                type: 'number',
                                min: 0,
                                max: 150,
                            },]}
                        >
                            <InputNumber  />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                            name={'phoneNumber'}
                            label="Phone Number"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={14}>
                    <Col className="gutter-row" span={8}> 
                        <Form.Item
                            name={'passportNumber'}
                            label="Passport Number"
                            rules={[
                            {
                                required: true,
                            },]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Form.Item 
                            name={'sex'}
                            label="Sex"
                        >
                            <Select 
                            options={[
                                { label: 'Female', value: '0' },
                                { label: 'Male', value: '1' }
                            ]} 
                            />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Form.Item
                                name={'address'}
                                label="Address"
                            >
                                <Input />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={4}>
                        <Button type="primary" htmlType="submit">Save</Button>
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                        <h2>Registered Course</h2>
                        <Table dataSource={coursesRegisted} 
                            columns={courseRegistedtColums} 
                            pagination={{ position: ["bottomCenter"] ,pageSize: 5 }}
                        />
                    </Col>
                    <Col span={12}>
                        <h2>Unregistered Course</h2>
                        <Table dataSource={coursesNotRegisted} 
                            columns={courseNotRegistedColums} 
                            pagination={{ position: ["bottomCenter"] ,pageSize: 5 }}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
export default RegisterCourse;
