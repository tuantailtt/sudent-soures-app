import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, Select, message } from 'antd';
import { CreateModal } from './create-modal';
import { EditModal } from './edit-modal';
// import { Basic } from './create-modal-formik';


const { confirm } = Modal;
const { Option } = Select;

function CourseList(){

    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [valueSearch, setValueSearch] = useState('');
    const [attributeSearch, setAttributeSearch] = useState(['name']);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [isCreateModalShown, setIsCreateModalShown] = useState(false);
    const [isEditModalShown, setIsEditModalShown] = useState(false);
    const [refresh, setRefresh] = useState(false);
    // const [isCreateFormikModalShown, setIsCreateFormikModalShown] = useState(false);
    // const handleCreateFormikModalClose = () => {
    //     setIsCreateFormikModalShown(false);
    // };
    // const showCreateFormikModal = () => {
    //     setIsCreateFormikModalShown(true);
    // }

    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (course) => (
                <div>
                    <Button type="primary" onClick={() => showEditModal(course)} style={{margin:"0px 2px 0px 2px"}}>Edit</Button>
                    <Button type="danger" onClick={() => showDeleteConfirm(course)} style={{margin:"0px 2px 0px 2px"}}>Delete</Button>
                </div>)
        }
    ];

    
    
    const handleCreateModalClose = () => {
        setIsCreateModalShown(false);
    };
    const showCreateModal = () => {
        setIsCreateModalShown(true);
    }
    
    const handleEditModalClose = () => {
        setIsEditModalShown(false);
    };
    const showEditModal = (course) => {
        setSelectedCourse(course)
        console.log('course',course)
        setIsEditModalShown(true);
    }


    

    function deleteCourse(id){
        axios.delete('/api/courses/'+id)
            .then(function(response){
                setData(data.filter(item => item.key !== id));
                setDataSource(dataSource.filter(item => item.key !== id))
                message.success('Delete successful');
            }).catch(function(error){
                message.error('Delete failed');
            })
    }
    
    function showDeleteConfirm(course) {
        confirm({
            title: 'Are you sure delete this Course?',
            content: course.name,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log(course.id);
                deleteCourse(course.id);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    }

    function handleChangeValueSearch(e){
        console.log('param',attributeSearch);
        const currValue = e.target.value;
        if(currValue !== ""){
            setValueSearch(currValue);
            filterDataSource(currValue,attributeSearch);
        }else{
            setValueSearch(currValue);
            setDataSource(data);
        }
        
    }

    function filterDataSource(value,params){
        const filteredData = data.filter((entry) =>{
            let isNotNull = false ;
            params.forEach(param => {
                if(entry[param] != null){
                    if(entry[param].toString().toLowerCase().includes(value.toLowerCase())){isNotNull = true;};
                }
            });
            return isNotNull === true;
        });
        setDataSource(filteredData);
    }

    function handleChangeSelectedAttributeSearch(params) {
        if(params[0]==null){
            setValueSearch('');
            setAttributeSearch([]);
            setDataSource(data);
        }else{
            setAttributeSearch(params);
            console.log('value',params);
            filterDataSource(valueSearch,params);
        }
    }

    function refreshTable(){
        setRefresh(!refresh);
    }

    useEffect(() => {
        axios.get('/api/courses')
            .then(function (response) {
                console.log(response.data)
                let list = response.data.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    students: row.students
                }));
                setData(list);
                setDataSource(list);
            })
    }, [refresh]);

    return (
        <div className="App">
            <div>
                <CreateModal show={isCreateModalShown} handleClose={handleCreateModalClose} refreshTable={refreshTable}/>
             <EditModal show={isEditModalShown} handleClose={handleEditModalClose} course={selectedCourse} refreshTable={refreshTable}/>
                {/* <Basic show={isCreateFormikModalShown} handleClose={handleCreateFormikModalClose} refreshTable={refreshTable}/> */}
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <Input
                            placeholder="Enter search keywords"
                            value={valueSearch}
                            onChange={(e)=>handleChangeValueSearch(e)}
                        />
                    </Col>
                    <Col className="gutter-row" span={6}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select the desired attribute"
                        defaultValue={['name']}
                        onChange={handleChangeSelectedAttributeSearch}
                    >
                        <Option value="name">Name</Option>
                        <Option value="description">Description</Option>
                    </Select>
                    </Col>
                    <Col className="gutter-row" span={4}>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Button onClick={showCreateModal} type="primary">Create</Button>
                        {/* <Button onClick={showCreateFormikModal}>Createformik</Button> */}
                    </Col>
                </Row>
            </div>
           <div>
                <Table dataSource={dataSource} 
                columns={columns} 
                pagination={{ position: ["bottomCenter"], pageSize: 8}}
                />
            </div>
        </div>
      );
}


export default CourseList;