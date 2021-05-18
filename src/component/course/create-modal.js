import React, { useEffect,useState} from 'react';
import axios from 'axios';
import { Modal, Input, Form, Row, Col,Table,Card ,Space, Button ,message} from 'antd';
const { confirm } = Modal;


export const CreateModal = ({ show, handleClose, refreshTable }) =>{

    const [studentRegisted, setStudentRegisted] = useState([]);
    const [studentUnregisted, setStudentUnregisted] = useState([]);
    const [form] = Form.useForm();
    const layout = {
        labelCol: {
          span: 7,
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
    function showCreateConfirm(value){
        confirm({
            title: 'Are you sure create new Course ?',
            content: "",
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                createCourse(value);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    function createCourse(value){
        console.log(value);
        let courseDto = {
            "name": value.nameCreate === undefined ? null : value.nameCreate,
            "description": value.descriptionCreate === undefined ? null : value.descriptionCreate,
            "students": studentRegisted.map(student => {
                return {"id":student.id}
            })
        }
        axios.post('/api/courses/',courseDto)
            .then(function(response){
                console.log(response);
                handleClose();
                message.success('Create successful');
                refreshTable();

            }).catch(function(error){
                message.error('Create failed');
            })
    }
    useEffect(() => {
        if(!show) {
            form.setFieldsValue({
                nameCreate: null,
                descriptionCreate: null
            });
        }else{
            axios.get("/api/students")
                .then(function(response){
                    let studentList = response.data.map(row => ({
                        key: row.id,
                        id: row.id,
                        name: row.name,
                        passportNumber: row.passportNumber
                    }));
                    setStudentUnregisted(studentList);
                }).catch(function(error){
                    console.log('err',error);
                });
        }
    }, [show])
                    

    return (
        <Modal
            visible={show}
            title="Edit course"
            okText= 'Create'
            onOk={form.submit}
            onCancel={handleClose}
            width={1000}
            forceRender={true}

        >
            <Form {...layout} form={form} onFinish={showCreateConfirm}>
                <Row gutter={14}>
                    <Col className="gutter-row" span={11}>
                        <Form.Item
                            name={'nameCreate'}
                            label="Name"
                            rules={[
                                {
                                    min:2,
                                    max:50,
                                    message: "Name must be between 2 and 50 characters",
                                    
                                },
                                {
                                    required: true,
                                    message: "Name is not required"
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={11}>
                        <Form.Item
                            name={'descriptionCreate'}
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