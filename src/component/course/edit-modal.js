import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Modal, Input, Form,Row, Col,Table,Card ,Space, Button, message,Pagination} from 'antd';
const { confirm } = Modal;
const { TextArea } = Input;


export const EditModal = ({ show, handleClose, course, refreshTable }) => {

    const [studentRegisted, setStudentRegisted] = useState([]);
    const [studentUnregisted, setStudentUnregisted] = useState([]);
    const [totalElements,setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
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
    
    function registerStudent(student){
        setStudentRegisted([...[student], ...studentRegisted] );
    }
    function removeStudent(student){
        setStudentRegisted(studentRegisted.filter(element => element.id !== student.id ));
    }

    function currentPageChange(current, pageSize){
        setCurrentPage(current)
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

    useEffect(()=>{
        if(Object.values(course).length !== 0 && show===true){
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
        }
        setCurrentPage(1);
    // eslint-disable-next-line
    },[course,show])

    useEffect(() => {
        if(Object.values(course).length !== 0 && show===true){
            axios.get("/api/studentsPage",{
                params:{
                    pageNo:currentPage - 1,
                    pageSize:4
                }
            })
                .then(function(response){
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
        }else{
            form.setFieldsValue({
                name: null,
                description:  null
            });
        }
    // eslint-disable-next-line
    },[course,show,currentPage]);
    
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
            <div style={{height:"560px"}}>
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
                            rules={[
                                {
                                    max:254,
                                    message:"Description should have at most 254 characters"
                                },]}
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