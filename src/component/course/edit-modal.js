import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Modal, Input, Form,Row, Col,Table,Card ,Space, Button, message} from 'antd';
const { confirm } = Modal;


export const EditModal = ({ show, handleClose, course, refreshTable }) => {

    const [studentRegisted, setStudentRegisted] = useState([]);
    const [studentUnregisted, setStudentUnregisted] = useState([]);
    const [form] = Form.useForm();

    const layout = {
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 17,
        },
    };
    const studentRegistedColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Passport Number', dataIndex: 'passportNumber',key: 'passportNumber'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (student) => <Button type="danger" onClick={() => removeStudent(student)}>Remove</Button>
        }
    ];
    const studentUnregistedColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Passport Number', dataIndex: 'passportNumber',key: 'passportNumber'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (student) => <Button type="primary" onClick={() => registerStudent(student)}>Register</Button>
        }
    ];
    
    function registerStudent(student){
        setStudentUnregisted(studentUnregisted.filter(element => element.id !== student.id ));
        setStudentRegisted([...[student], ...studentRegisted] );
    }
    function removeStudent(student){
        setStudentRegisted(studentRegisted.filter(element => element.id !== student.id ));
        setStudentUnregisted([...[student], ...studentUnregisted] );
    }

    function showSaveConfirm(value){
        confirm({
            title: 'Are you sure save this your changed ?',
            content: "",
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                updateCourse(value);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    function updateCourse(value){
        let courseDto = {
            "name": value.name === undefined ? null : value.name,
            "description": value.description === undefined ? null : value.description,
            "students": studentRegisted.map(student => {
                return {"id":student.id}
            })
        };
        console.log(courseDto);
        axios.put("/api/courses/"+course.id,courseDto)
            .then(function(response){
                console.log(response);
                handleClose();
                message.success('Update successful');
                refreshTable()
            })
            .catch(function (error) {
                message.error('Update failed');
              })
    }
    useEffect(() => {
        if(Object.values(course).length !== 0){
            console.log('c',course)
            form.setFieldsValue({
                name: course.name,
                description: course.description
            });
            setStudentRegisted(course.students.map(row=>({
                key: row.id,
                id: row.id,
                name: row.name,
                passportNumber: row.passportNumber
            })));
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
                            course.students.forEach(element => {
                        if(element.id === std.id) isIncluse=true
                    });
                    return isIncluse===false;
                    })
                    setStudentUnregisted(studentUnregistedList);
                }).catch(function(error){
                    console.log('err',error);
                });
        }else{
            form.setFieldsValue({
                name: null,
                description:  null
            });
        }
       
    },[course]);
    
    return (
        
        <Modal
            visible={show}
            title="Edit course"
            okText= 'Save'
            onOk={form.submit}
            onCancel={handleClose}
            width={1000}
            forceRender={true}

        >
            <Form 
                {...layout} 
                form={form} 
                onFinish={showSaveConfirm}
            > 
                <Row gutter={14}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name={'name'}
                            label="Name"
                            rules={[
                            {
                                min:2,
                                required: true,
                            },]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            name={'description'}
                            label="Description"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row >
                <Col span={12}>
                    <Space direction="vertical">
                        <Card title="Registered Student" style={{ width: 450 }}>
                            <Table dataSource={studentRegisted} 
                                columns={studentRegistedColums} 
                                pagination={{ position: ["bottomCenter"] ,pageSize: 4 }}
                                scroll={{ y: 260 }}
                            />
                        </Card>
                    </Space>
                </Col>
                <Col span={12}>
                <Space direction="vertical">
                        <Card title="Unregistered Student" style={{ width: 450 }}>
                        <Table dataSource={studentUnregisted} 
                        columns={studentUnregistedColums} 
                        pagination={{ position: ["bottomCenter"] ,pageSize: 4 }}
                        scroll={{ y: 260 }}
                    />
                        </Card>
                    </Space>
                </Col>
            </Row>
                
            </Form>

        </Modal>
    )

}