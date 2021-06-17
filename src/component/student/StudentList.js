import axios from 'axios';
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import { Button, Table, Modal, Input, Row, Col, Select, message,Pagination,Space,Card   } from 'antd';
// eslint-disable-next-line
import { UserAddOutlined,SearchOutlined} from '@ant-design/icons';
import { Formik, Field, Form } from 'formik';
import { CreateModal } from './create-modal';
import { EditModal } from './edit-modal';
import { RegisterModal } from './register-modal';
import {Link} from "react-router-dom";

const { confirm } = Modal;
// eslint-disable-next-line
const { Option } = Select;


function StudentList() {

    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState({});
    const [isCreateModalShown, setIsCreateModalShown] = useState(false);
    const [isEditModalShown, setIsEditModalShown] = useState(false);
    const [isRegisterModalShown, setIsRegisterModalShown] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [totalElements,setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [sorting, setSorting] = useState(['id:descend'])
    const [nameSearch,setNameSearch]=useState('');
    const [ageSearch,setAgeSearch]=useState('');
    const [sexSearch,setSexSearch]=useState('');
    const [addressSearch,setAddressSearch]=useState('');
    const [passportSearch,setPassportSearch]=useState('');
    const [phoneSearch,setPhoneSearch]=useState('');

    const columns = [
        { title: 'Name', dataIndex: '',key: 'name', sorter: {multiple: 1,},width: '15%',
            // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            //     <div style={{ padding: 8 }}>
            //     <Input
            //         placeholder={`Search name`}
            //         value={selectedKeys[0]}
            //         onChange={e => {setSelectedKeys(e.target.value ? [e.target.value] : [])}}
            //         onPressEnter={() => handleNameSearch(selectedKeys,confirm)}
            //         style={{ marginBottom: 8, display: 'block' }}
            //     />
            //     <Space>
            //         <Button
            //         type="primary"
            //         onClick={() => handleNameSearch(selectedKeys, confirm)}
            //         icon={<SearchOutlined />}
            //         size="small"
            //         style={{ width: 90 }}
            //         >
            //         Search
            //         </Button>
            //         <Button onClick={() => handleNameSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
            //         Reset
            //         </Button>
            //     </Space>
            //     </div>
            // ),
            // filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            render: (student) =>(
                <Link to={`/admin/student/${student.id}`}>{student.name}</Link>
            )
        }, 
        { title: 'Age', dataIndex: 'yearOld',key: 'yearOld',sorter: { multiple: 2,}, width: '5%', align:"center" ,
            // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            //     <div style={{ padding: 8 }}>
            //     <Input
            //         placeholder={`Search name`}
            //         value={selectedKeys[0]}
            //         onChange={e => {setSelectedKeys(e.target.value ? [e.target.value] : [])}}
            //         onPressEnter={() => handleAgeSearch(selectedKeys,confirm)}
            //         style={{ marginBottom: 8, display: 'block' }}
            //         type="number"
            //     />
            //     <Space>
            //         <Button
            //         type="primary"
            //         onClick={() => handleAgeSearch(selectedKeys, confirm)}
            //         icon={<SearchOutlined />}
            //         size="small"
            //         style={{ width: 90 }}
            //         >
            //         Search
            //         </Button>
            //         <Button onClick={() => handleAgeSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
            //         Reset
            //         </Button>
            //     </Space>
            //     </div>
            // ),
            // filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        { title: 'Sex', dataIndex: 'sex', key: 'sex',sorter: { multiple: 3,}, width: '5%', align:"center",
            // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            //     <div style={{ padding: 8 }}>
            //     {/* <Input
            //         placeholder={`Search name`}
            //         value={selectedKeys[0]}
            //         onChange={e => {setSelectedKeys(e.target.value ? [e.target.value] : [])}}
            //         onPressEnter={() => handleAgeSearch(selectedKeys,confirm)}
            //         style={{ marginBottom: 8, display: 'block' }}
            //         type="number"
            //     /> */}
            //     <Select
            //         style={{ marginBottom: 8, display: 'block' }}
            //         value={selectedKeys[0]}
            //         onChange={e => {setSelectedKeys( e !==""? [e]:[])}}
            //     >
            //         <Option value=""></Option>
            //         <Option value="1">Male</Option>
            //         <Option value="0">Female</Option>
            //     </Select>
            //     <Space>
            //         <Button
            //         type="primary"
            //         onClick={() => handleSexSearch(selectedKeys, confirm)}
            //         icon={<SearchOutlined />}
            //         size="small"
            //         style={{ width: 90 }}
            //         >
            //         Search
            //         </Button>
            //         <Button onClick={() => handleSexSearchReset(clearFilters)} size="small" style={{ width: 90 }} >
            //         Reset
            //         </Button>
            //     </Space>
            //     </div>
            // ),
        },
        { title: 'Address', dataIndex: 'address',key: 'address',sorter: { multiple: 4,},
            // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            //     <div style={{ padding: 8 }}>
            //     <Input
            //         placeholder={`Search name`}
            //         value={selectedKeys[0]}
            //         onChange={e => {setSelectedKeys(e.target.value ? [e.target.value] : [])}}
            //         onPressEnter={() => handleAddressSearch(selectedKeys,confirm)}
            //         style={{ marginBottom: 8, display: 'block' }}
            //     />
            //     <Space>
            //         <Button
            //         type="primary"
            //         onClick={() => handleAddressSearch(selectedKeys, confirm)}
            //         icon={<SearchOutlined />}
            //         size="small"
            //         style={{ width: 90 }}
            //         >
            //         Search
            //         </Button>
            //         <Button onClick={() => handleAddressSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
            //         Reset
            //         </Button>
            //     </Space>
            //     </div>
            // ),
            // filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        { title: 'Passport number', dataIndex: 'passportNumber',key: 'passportNumber',sorter: { multiple: 5,}, width: '10%',
            // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            //     <div style={{ padding: 8 }}>
            //     <Input
            //         placeholder={`Search name`}
            //         value={selectedKeys[0]}
            //         onChange={e => {setSelectedKeys(e.target.value ? [e.target.value] : [])}}
            //         onPressEnter={() => handlePassportSearch(selectedKeys,confirm)}
            //         style={{ marginBottom: 8, display: 'block' }}
            //     />
            //     <Space>
            //         <Button
            //         type="primary"
            //         onClick={() => handlePassportSearch(selectedKeys, confirm)}
            //         icon={<SearchOutlined />}
            //         size="small"
            //         style={{ width: 90 }}
            //         >
            //         Search
            //         </Button>
            //         <Button onClick={() => handlePassportSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
            //         Reset
            //         </Button>
            //     </Space>
            //     </div>
            // ),
            // filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        { title: 'Phone number',dataIndex: 'phoneNumber',key: 'phoneNumber',sorter: { multiple: 6,}, width: '10%',
            // filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            //     <div style={{ padding: 8 }}>
            //     <Input
            //         placeholder={`Search name`}
            //         value={selectedKeys[0]}
            //         onChange={e => {setSelectedKeys(e.target.value ? [e.target.value] : [])}}
            //         onPressEnter={() => handlePhoneSearch(selectedKeys,confirm)}
            //         style={{ marginBottom: 8, display: 'block' }}
            //     />
            //     <Space>
            //         <Button
            //         type="primary"
            //         onClick={() => handlePhoneSearch(selectedKeys, confirm)}
            //         icon={<SearchOutlined />}
            //         size="small"
            //         style={{ width: 90 }}
            //         >
            //         Search
            //         </Button>
            //         <Button onClick={() => handlePhoneSearchReset(clearFilters)} size="small" style={{ width: 90 }}>
            //         Reset
            //         </Button>
            //     </Space>
            //     </div>
            // ),
            // filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        },
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center", width: '20%',
            render: (student) => (
                <div>
                    <Button type="primary" onClick={() => showEditModal(student)}  style={{margin:"0px 2px 0px 2px"}}>Edit</Button>
                    <Button type="default" onClick={() => showRegisterModal(student)} style={{margin:"0px 2px 0px 2px"}}>Courses</Button>
                    <Button type="danger" onClick={() => showDeleteConfirm(student)}  style={{margin:"0px 2px 0px 2px"}}>Delete</Button>
                </div>)
        }
    ];
    
    // const handleNameSearch = (selectedKeys, confirm) => {
    //     confirm();
    //     setNameSearch(selectedKeys[0] === undefined?"":selectedKeys[0]);
    //     setRefresh(!refresh)
    // };
    // const handleNameSearchReset = clearFilters => {
    //     clearFilters();
    //     setNameSearch("");
    //     setRefresh(!refresh)
    // };
    // const handleAddressSearch = (selectedKeys, confirm) => {
    //     confirm();
    //     setAddressSearch(selectedKeys[0] === undefined?"":selectedKeys[0]);
    //     setRefresh(!refresh)
    // };
    // const handleAddressSearchReset = clearFilters => {
    //     clearFilters();
    //     setAddressSearch("");
    //     setRefresh(!refresh)
    // };
    // const handlePassportSearch = (selectedKeys, confirm) => {
    //     confirm();
    //     setPassportSearch(selectedKeys[0] === undefined?"":selectedKeys[0]);
    //     setRefresh(!refresh)
    // };
    // const handlePassportSearchReset = clearFilters => {
    //     clearFilters();
    //     setPassportSearch("");
    //     setRefresh(!refresh)
    // };
    // const handlePhoneSearch = (selectedKeys, confirm) => {
    //     confirm();
    //     setPhoneSearch(selectedKeys[0] === undefined?"":selectedKeys[0]);
    //     setRefresh(!refresh)
    // };
    // const handlePhoneSearchReset = clearFilters => {
    //     clearFilters();
    //     setPhoneSearch("");
    //     setRefresh(!refresh)
    // };
    // const handleAgeSearch = (selectedKeys, confirm) => {
    //     confirm();
    //     setAgeSearch(selectedKeys[0] === undefined?"":selectedKeys[0]);
    //     setRefresh(!refresh)
    // };
    // const handleAgeSearchReset = clearFilters => {
    //     clearFilters();
    //     setAgeSearch("");
    //     setRefresh(!refresh)
    // };
    // const handleSexSearch = (selectedKeys, confirm) => {
    //     confirm();
    //     setSexSearch(selectedKeys[0] === undefined?"":selectedKeys[0] );
    //     setRefresh(!refresh)
    // };
    // const handleSexSearchReset = clearFilters => {
    //     clearFilters();
    //     setSexSearch("");
    //     setRefresh(!refresh)
    // };

    const handleSearch = values =>{
            setNameSearch(values.name);
        setSexSearch(values.sex === "male" ? 1 : values.sex === "female" ? 0 : "");
        setAgeSearch(values.yearOld);
        setAddressSearch(values.address);
        setPassportSearch(values.passportNumber);
        setPhoneSearch(values.phoneNumber);
        setRefresh(!refresh);
    }
    const handleResetSearch = () =>{
        setNameSearch("");
        setSexSearch("");
        setAgeSearch("");
        setAddressSearch("");
        setPassportSearch("");
        setPhoneSearch("");
        setRefresh(!refresh);

    }

    const handleCreateModalClose = () => {
        setIsCreateModalShown(false);
    };
    const showCreateModal = () => {
        setIsCreateModalShown(true);
    }
    
    const handleEditModalClose = () => {
        setIsEditModalShown(false);
    };
    const showEditModal = (student) => {
        setSelectedStudent(student)
        setIsEditModalShown(true);
    }
    const handleRegisterModalClose = () => {
        setIsRegisterModalShown(false);
    };
    const showRegisterModal = (student) => {
        setSelectedStudent(student)
        setIsRegisterModalShown(true);
    }

    function deleteStudent(id){
        axios.delete('/api/students/'+id)
            .then(function(response){
                setData(data.filter(item => item.key !== id));
                setDataSource(dataSource.filter(item => item.key !== id))
                message.success('Delete successful');
            }).catch(function(error){
                message.error('Delete successful');
            })
    }
    
    function showDeleteConfirm(student) {
        confirm({
            title: 'Are you sure delete this student?',
            content: student.name,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteStudent(student.id);
            },
            onCancel() {
            },
        });
    }

    
   
    function pageSizeChange(current, pageSize) {
        setPageSize(pageSize);
        setRefresh(!refresh);
    }
    function currentPageChange(current, pageSize){
        setCurrentPage(current)
        setRefresh(!refresh);
    }



    function refreshTable(){
        setCurrentPage(1);
        setRefresh(!refresh);
    }

    function onChange(pagination, filters, sorter, extra) {
        let sortArr =[];
        if( Array.isArray(sorter)){
            sortArr = sorter.map(e => e.columnKey+":"+e.order)
            setSorting(sortArr);
        }else if(sorter.order === undefined){
            setSorting(["id:descend"]);
        }else{
            sortArr =[sorter.columnKey+":"+sorter.order]
                setSorting(sortArr);
        }
        setRefresh(!refresh);
    }
    
    useEffect(() => {
        let params = new URLSearchParams();
        params.append("searching","name:"+nameSearch+",address:"+addressSearch+",passportNumber:"+passportSearch+",phoneNumber:"+phoneSearch+",yearOld:"+ageSearch+",sex:"+sexSearch);
        // params.append("searching","name:"+nameSearch);
        // params.append("searching","address:"+addressSearch);
        // params.append("searching","passportNumber:"+passportSearch);
        // params.append("searching","phoneNumber:"+phoneSearch);
        // params.append("searching","yearOld:"+ageSearch);
        // params.append("searching","sex:"+sexSearch);
        params.append("pageNo",currentPage-1);
        params.append("pageSize",pageSize);
        sorting.forEach(e =>{
            params.append("sorting",e);
        })
        let request = {
            params: params
        };
        axios.get('/api/studentsPage', request)
            .then(function (response) {
                setTotalElements(response.data.totalElements);
                setPageSize(response.data.size);
                setCurrentPage(response.data.number);
                let list = response.data.studentDtoList.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    yearOld: row.yearOld,
                    sex: row.sex===true?"Male":row.sex===false?"Female":"",
                    passportNumber: row.passportNumber,
                    phoneNumber: row.phoneNumber,
                    address: row.address,
                    courses: row.courses
                }));
                setData(list);
                setDataSource(list);
            })
        // eslint-disable-next-line
        }, [refresh]);
    
  return (
        <div className="App">
        <div>
            <CreateModal show={isCreateModalShown} handleClose={handleCreateModalClose} refreshTable={refreshTable}/>
            <EditModal show={isEditModalShown} handleClose={handleEditModalClose} student={selectedStudent} refreshTable={refreshTable}/>
            <RegisterModal show={isRegisterModalShown} handleClose={handleRegisterModalClose} student={selectedStudent} refreshTable={refreshTable}/>
            <h3 style={{textAlign:"left"}}>Search Criteria</h3>
            <Card >
                <Formik
                    enableReinitialize
                    initialValues={{ name: "", yearOld: "", sex:"",address:'',passportNumber:'',phoneNumber:'' }}
                    
                    onSubmit={(values, { setSubmitting}) => {
                        setTimeout(() => {
                        handleSearch(values);
                        setSubmitting(false);
                        }, 0);
                    }}
                    // onReset={(values)=>{
                    //     handleResetSearch(values);
                    // }}
                   

                >
                    {formik => (
                        <Form >
                            <Row className="ant-form-item">
                                <Col span={2} className="ant-form-item-label"><label htmlFor="name" >Name </label></Col>
                                <Col span={5}>
                                    <Field name="name" type="text" className="ant-input"/>
                                </Col>
                                <Col span={2} className ="ant-form-item-label"><label htmlFor="yearOld" >Age </label></Col>
                                <Col span={5} >
                                    <Field name="yearOld" type="number" className="ant-input"/>
                                </Col>
                                <Col span={2} className="ant-form-item-label"><label htmlFor="sex">Sex </label></Col>
                                <Col span={5}>
                                    <Field name="sex" as="select" className="ant-input" >
                                        <option value=""></option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </Field>
                                </Col>
                               
                            </Row>
                            <Row className="ant-form-item">
                                <Col span={2} className ="ant-form-item-label"><label htmlFor="address">Address </label></Col>
                                <Col span={5}>
                                    <Field name="address" type="text" className="ant-input" />
                                </Col>
                                <Col span={2} className ="ant-form-item-label"><label htmlFor="passportNumber">Passport number </label></Col>
                                <Col span={5}>
                                    <Field name="passportNumber" type="text" className="ant-input" />
                                </Col>
                                <Col span={2} className ="ant-form-item-label"><label htmlFor="phoneNumber">Phone number </label></Col>
                                <Col span={5}>
                                    <Field name="phoneNumber" type="text" className="ant-input" />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Button type="primary" style={{margin:"4px"}}  onClick={formik.handleSubmit}>Search</Button>
                                    <Button style={{margin:"4px"}} onClick={()=>{formik.handleReset();handleResetSearch()}}>Clear</Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                    
                </Formik>
            </Card>
            <Row gutter={16} style={{margin:"4px"}}>
                <Col className="gutter-row" span={18}></Col>
               
                <Col className="gutter-row" span={6}>
                    <Button type="primary" onClick={showCreateModal}><UserAddOutlined />Create</Button>
                </Col>
            </Row>
            <Table dataSource={dataSource} 
                columns={columns} 
                pagination={{ 
                    hideOnSinglePage: true
                }}
                size="small"
                onChange={onChange}
            />
            <br></br>
            <Pagination
                    showSizeChanger
                    pageSizeOptions= {[8, 10, 12]}
                    onShowSizeChange={pageSizeChange}
                    current={currentPage}
                    pageSize= {pageSize}
                    total={totalElements}
                    onChange={currentPageChange}
                />
        </div>
    </div>
  );
}


export default StudentList;