import React, { useEffect,useState} from 'react';
import axios from 'axios';
import { Modal, Input, Form, Row, Col,Table,Card ,Space, Button ,message,Pagination} from 'antd';
const { confirm } = Modal;
const { TextArea } = Input;


export const CreateModal = ({ show, handleClose, refreshTable }) =>{

    const [studentRegisted, setStudentRegisted] = useState([]);
    const [studentUnregisted, setStudentUnregisted] = useState([]);
    const [totalElements,setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
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
        { title: 'Passport Number', dataIndex: 'passportNumber',key: 'passportNumber',width: '25%'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",width: '30%',
            render: (student) => <Button type="danger" onClick={() => removeStudent(student)}>Remove</Button>
        }
    ];
    const studentUnregistedColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Passport Number', dataIndex: 'passportNumber',key: 'passportNumber',width: '25%'},
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
                descriptionCreate: null,
            });
            setStudentRegisted([])
        }else{
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
        }
    // eslint-disable-next-line
    }, [show,currentPage])
                    

    return (
        <Modal
            visible={show}
            title="Create new course"
            okText= 'Create'
            onOk={form.submit}
            onCancel={handleClose}
            width={1000}
            forceRender={true}

        >
            <div style={{minHeight:"600px"}}>
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
                            <TextArea rows={3} />
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
    )
}