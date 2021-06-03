import React, { useEffect,useState} from 'react';
import axios from 'axios';
import { Modal, Row, Col,Table,Card ,Space, Button ,message,Pagination} from 'antd';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const { confirm } = Modal;


export const CreateModal = ({ show, handleClose, refreshTable }) =>{

    const [studentRegisted, setStudentRegisted] = useState([]);
    const [studentUnregisted, setStudentUnregisted] = useState([]);
    const [totalElements,setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    
    const studentRegistedColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Passport Number', dataIndex: 'passportNumber',key: 'passportNumber',width: '28%'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",width: '30%',
            render: (student) => <Button type="danger" onClick={() => removeStudent(student)}>Remove</Button>
        }
    ];
    const studentUnregistedColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Passport Number', dataIndex: 'passportNumber',key: 'passportNumber',width: '28%'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",width: '30%',
            render: (student) => {
                let isInclude = false;
                studentRegisted.forEach(e => {
                    if(e.id === student.id){
                        isInclude = true;
                    }
                })
                if(isInclude===true){
                    return <Button type="danger" onClick={() => removeStudent(student)} style={{width:"90px"}}>Unregister</Button>
                }else{
                    return <Button type="primary" onClick={() => registerStudent(student)}  style={{width:"90px"}}>Register</Button>         
                }
            }
        }
    ];

    function currentPageChange(current, pageSize){
        setCurrentPage(current)
    }
    function registerStudent(student){
        setStudentRegisted([...[student], ...studentRegisted] );
    }
    function removeStudent(student){
        setStudentRegisted(studentRegisted.filter(element => element.id !== student.id ));
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
            },
        });
    };

    function createCourse(value){
        console.log(value);
        let courseDto = {
            "name": value.name === "" ? null : value.name,
            "description": value.description === "" ? null : value.description,
            "cost":value.cost ===""? null:value.cost,
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
        axios.get("/api/studentsPage",{
            params:{
                pageNo:currentPage - 1,
                pageSize:4
            }
        }).then(function(response){
                setTotalElements(response.data.totalElements);
                setCurrentPage(response.data.number);
                let studentList = response.data.studentDtoList.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    passportNumber: row.passportNumber
                }));
                setStudentUnregisted(studentList);
            }).catch(function(error){
                console.log('err',error);
            });
    // eslint-disable-next-line
    }, [currentPage])
                    

    return (
        <Formik
            enableReinitialize
            initialValues={{ name: "", description: "",cost:0 }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .min(2, 'Name must be between 2 and 50 characters')
                    .max(50, 'Name must be between 2 and 50 characters')
                    .required('Required'),
                description: Yup.string()
                    .max(254, 'Age must be at most 254 characters'),
                cost: Yup.number()
                    .min(0, "Cost must be at least 0"),
            })}
            onSubmit={(values, { setSubmitting,resetForm}) => {
                setTimeout(() => {
                showCreateConfirm(values);
                setSubmitting(false);
                resetForm({
                    values:{ name: "", description:'' ,cost:0}
                })
                }, 200);
            }}
        >
            {formik => (
                <Modal
                    visible={show}
                    title="Create new course"
                    okText= 'Create'
                    onOk={formik.handleSubmit}
                    onCancel={handleClose}
                    width={1000}
                    forceRender={true}
        
                >
                    <div style={{minHeight:"600px"}}>
                    <Form >
                        <Row className="ant-form-item">
                            <Col span={2} className="ant-form-item-label"><label htmlFor="name" className="ant-form-item-required">Name </label></Col>
                            <Col span={5}>
                                <Field name="name" type="text" className="ant-input"/>
                                <ErrorMessage name="name" component="div" className="ant-form-item-explain ant-form-item-explain-error"/>
                            </Col>
                            <Col span={2} className="ant-form-item-label"><label htmlFor="cost" className="ant-form-item-required">Cost </label></Col>
                            <Col span={4}>
                                <Field name="cost" type="number" className="ant-input"/>
                                <ErrorMessage name="cost" component="div" className="ant-form-item-explain ant-form-item-explain-error"/>
                            </Col>
                            <Col span={3} className="ant-form-item-label"><label htmlFor="name">Description </label></Col>
                            <Col span={7}>
                                <Field name="description" component="textarea" className="ant-input"/>
                                <ErrorMessage name="description" component="div" className="ant-form-item-explain ant-form-item-explain-error"/>
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
                                        size="small"
                                    />
                                </Card>
                            </Space>
                        </Col>
                        <Col span={12}>
                            <Space direction="vertical">
                                <Card title="Unregistered Student" style={{ width: 450 }}>
                                    <Table 
                                        dataSource={studentUnregisted} 
                                        columns={studentUnregistedColums} 
                                        pagination={{ hideOnSinglePage: true }}
                                        scroll={{ y: 260 }}
                                        size="small"
                                    />
                                    <Pagination
                                        style={{marginTop:"16px",marginBottom:"16px",textAlign:"center"}}
                                        current={currentPage}
                                        pageSize= {4}
                                        total={totalElements}
                                        onChange={currentPageChange}
                                        size="small"
                                    />
                                </Card>
                            </Space>
                        </Col>
                    </Row>
                    </Form>
                    </div>
                </Modal>
            )}
        </Formik>
    )

}