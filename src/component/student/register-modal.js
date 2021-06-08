import React, { useEffect, useState} from 'react';
import axios from 'axios';
import { Modal, Button,Row, Col, Table  ,Space, Card,message ,Pagination} from 'antd';
const { confirm } = Modal;


export const RegisterModal = ({ show, handleClose,student , refreshTable }) =>{

    const [coursesRegisted, setCoursesRegisted] = useState([]);
    const [coursesUnregisted, setCoursesUnregisted] = useState([]);
    const [totalElements,setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const courseRegistedtColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        // { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center", width: '30%',
            render: (course) => <Button type="danger" onClick={() => removeCourse(course)}  style={{width:"90px"}}>Unregister</Button>
                
        }
    ];
    const courseNotRegistedColums = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        // { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",width: '30%',
            render: (course) => {
                let isIncluse = false;
                coursesRegisted.forEach(e => {
                    if(e.id === course.id){
                        isIncluse = true;
                    }
                })
                if(isIncluse===true){
                    return <Button type="danger" onClick={() => removeCourse(course)} style={{width:"90px"}}>Unregister</Button>
                }else{
                    return <Button type="primary" onClick={() => registerCourse(course)}  style={{width:"90px"}}>Register</Button>         
                }
            }
                
        }
    ];
   
    function registerCourse(course){
        setCoursesRegisted([...[course], ...coursesRegisted] );
    }
    function removeCourse(course){
        setCoursesRegisted(coursesRegisted.filter(element => element.id !== course.id ));
    }

    function currentPageChange(current, pageSize){
        setCurrentPage(current)
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
                return {"id":course.id,"paid":course.paid === null || course.paid === undefined ? false: course.paid}
            })
        };
        console.log('stuDto',studentDto);
        axios.put("/api/students/"+student.id,studentDto)
            .then(function(response){
                handleClose();
                message.success('Update successful');
                refreshTable();
            })
            .catch(function (error) {
                message.error('Delete failed');
              })
    } 

    useEffect(()=>{
        if(Object.values(student).length !== 0 && show===true){
            setCoursesRegisted(student.courses.map(row => ({
                key: row.id,
                id: row.id,
                name: row.name,
                description: row.description,
                paid: row.paid
            })));
        }
        setCurrentPage(1);
    },[student,show])

    useEffect(() => {
        if(Object.values(student).length !== 0 && show===true) {
            axios.get("/api/coursesPage",{
                params:{
                    pageNo:currentPage - 1,
                    pageSize:4
                }
            }).then(function(response){
                    setTotalElements(response.data.totalElements);
                    setCurrentPage(response.data.number);
                    let courseList = response.data.courseDtoList.map(row => ({
                        key: row.id,
                        id: row.id,
                        name: row.name,
                        description: row.description
                    }));
                    setCoursesUnregisted(courseList)
                });
        }
    }, [student,show,currentPage])



    return (
        <Modal
            visible={show}
            title={'Course management of student: '+ student.name }
            okText= 'Save'
            onOk={showSaveConfirm}
            onCancel={handleClose}
            width={1000}
        >
            <div style={{height:"500px"}}>
            <Row >
                <Col span={12}>
                    <Space direction="vertical">
                        <Card title="Registered Course" style={{ width: 450 }}>
                            <Table 
                                dataSource={coursesRegisted} 
                                columns={courseRegistedtColums} 
                                pagination={{ position: ["bottomCenter"] ,pageSize: 4,size:"default",}}
                                scroll={{ y: 260 }}
                                
                            />
                        </Card>
                    </Space>
                </Col>
                <Col span={12}>
                    <Space direction="vertical">
                        <Card title="Unregistered Course" style={{ width: 450 }}>
                        <Table 
                            dataSource={coursesUnregisted} 
                            columns={courseNotRegistedColums} 
                            pagination={{ hideOnSinglePage: true }}
                            scroll={{ y: 260 }}
                        />
                        <Pagination
                            style={{marginTop:"16px",marginBottom:"16px",textAlign:"center"}}
                            current={currentPage}
                            pageSize= {4}
                            total={totalElements}
                            onChange={currentPageChange}
                        />
                        </Card>
                    </Space>
                </Col>
            </Row>
            </div>
        </Modal>
    )

}