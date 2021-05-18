import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Modal, Button,Row, Col, Table  ,Space, Card,message } from 'antd';
const { confirm } = Modal;


export const RegisterModal = ({ show, handleClose,student , refreshTable }) =>{

    const [coursesRegisted, setCoursesRegisted] = useState([]);
    const [coursesUnregisted, setCoursesUnregisted] = useState([]);
    const courseRegistedtColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        // { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (course) => <Button type="danger" onClick={() => removeCourse(course)}>Remove</Button>
                
        }
    ];
    const courseNotRegistedColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        // { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (course) => <Button type="primary" onClick={() => registerCourse(course)}>Register</Button>
                
        }
    ];
   
    function registerCourse(course){
        setCoursesUnregisted(coursesUnregisted.filter(element => element.id !== course.id ));
        setCoursesRegisted([...[course], ...coursesRegisted] );
    }
    function removeCourse(course){
        setCoursesRegisted(coursesRegisted.filter(element => element.id !== course.id ));
        setCoursesUnregisted([...[course], ...coursesUnregisted] );
    }
    function showSaveConfirm(student){
        confirm({
            title: 'Are you sure save this your change ?',
            content: student.name,
            okText: 'Yes',
            okType: 'primary',
            cancelText: 'No',
            onOk() {
                updateStudent();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };
    function updateStudent(){
        let studentDto = {
            "name": student.name,
            "yearOld": student.yearOld,
            "sex": student.sex==="Male"?true:student.sex==="Female"?false:null,
            "address": student.address,
            "passportNumber": student.passportNumber,
            "phoneNumber": student.phoneNumber,
            "courses": coursesRegisted.map(course => {
                return {"id":course.id}
            })
        };
        console.log(studentDto);
        axios.put("/api/students/"+student.id,studentDto)
            .then(function(response){
                console.log('success');
                handleClose();
                message.success('Update successful');
                refreshTable();
            })
            .catch(function (error) {
                message.error('Delete failed');
              })
    } 

    useEffect(() => {
        if(Object.values(student).length !== 0 && show===true) {
            setCoursesRegisted(student.courses.map(row => ({
                key: row.id,
                id: row.id,
                name: row.name,
                description: row.description
            })));
            axios.get("/api/courses")
                .then(function(response){
                    let courseList = response.data.map(row => ({
                        key: row.id,
                        id: row.id,
                        name: row.name,
                        description: row.description
                    }));
                    let coursesNotRegistedList = courseList.filter((course)=>{
                        let isIncluse = false;
                        student.courses.forEach(element => {
                            if(element.id === course.id) isIncluse=true
                        });
                        return isIncluse===false;
                    })
                    setCoursesUnregisted(coursesNotRegistedList)
                });
        }
    }, [student,show])

    return (
        <Modal
            visible={show}
            title={'Student: '+student.name }
            okText= 'Save'
            onOk={showSaveConfirm}
            onCancel={handleClose}
            width={1000}
        >
            <Row >
                <Col span={12}>
                    <Space direction="vertical">
                        <Card title="Registered Course" style={{ width: 450 }}>
                            <Table dataSource={coursesRegisted} 
                                columns={courseRegistedtColums} 
                                pagination={{ position: ["bottomCenter"] ,pageSize: 4 }}
                                scroll={{ y: 260 }}
                            />
                        </Card>
                    </Space>
                </Col>
                <Col span={12}>
                <Space direction="vertical">
                        <Card title="Unregistered Course" style={{ width: 450 }}>
                        <Table dataSource={coursesUnregisted} 
                        columns={courseNotRegistedColums} 
                        pagination={{ position: ["bottomCenter"] ,pageSize: 4 }}
                        scroll={{ y: 260 }}
                    />
                        </Card>
                    </Space>
                </Col>
            </Row>
            
        </Modal>
    )

}