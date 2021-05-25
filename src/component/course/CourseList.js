import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Input, Row, Col, Select, message ,Pagination} from 'antd';
import { FolderAddOutlined} from '@ant-design/icons';
import { CreateModal } from './create-modal';
import { EditModal } from './edit-modal';


const { confirm } = Modal;
const { Option } = Select;

function CourseList(){

    const [data, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [columnSearch, setColumnSearch] = useState(["name"]);
    const [selectedCourse, setSelectedCourse] = useState({});
    const [isCreateModalShown, setIsCreateModalShown] = useState(false);
    const [isEditModalShown, setIsEditModalShown] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [valueSearch, setValueSearch] = useState('');
    const [totalElements,setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(8);
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState(["id,descend"])
    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name',sorter: {multiple: 1,}, width: '30%'},
        { title: 'Description', dataIndex: 'description',key: 'description',sorter: {multiple: 1,}, width: '50%'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center", width: '20%',
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
                deleteCourse(course.id);
            },
            onCancel() {
            },
        });
    }

    function handleChangeValueSearch(e){
        if (e.key === 'Enter') {
            setCurrentPage(1);
            setRefresh(!refresh);
          }
    }
    function handleChangeAndSetValueSearch(e){
        setValueSearch(e.target.value);
        if(e.target.value === ""){
            setCurrentPage(1);
            setRefresh(!refresh);
        }
    }

   

    function handleChangeSelectedAttributeSearch(params) {
        setColumnSearch(params);
        setRefresh(!refresh);
    }

    function refreshTable(){
        setCurrentPage(1);
        setRefresh(!refresh);
    }
    function pageSizeChange(current, pageSize) {
        setPageSize(pageSize);
        setRefresh(!refresh);
    }
    function currentPageChange(current, pageSize){
        setCurrentPage(current)
        setRefresh(!refresh);
    }

    function onChange(pagination, filters, sorter, extra) {
        let sortArr =[];
        if( Array.isArray(sorter)){
            sortArr = sorter.map(e => e.field+","+e.order)
            setSort(sortArr);
        }else if(sorter.order === undefined){
            setSort(["id,descend"]);
        }else{
            sortArr =[sorter.field+","+sorter.order]
                setSort(sortArr);
        }
        setRefresh(!refresh);
    }

    useEffect(() => {
        let params = new URLSearchParams();
        params.append("pageNo",currentPage-1);
        params.append("pageSize",pageSize);
        params.append("searchValue",valueSearch);
        sort.forEach(e => {
            params.append("sort",e);
        });
        columnSearch.forEach(e => {
            params.append("columnSearch",e);
        })
        let request = {
            params: params
        };
        axios.get('/api/coursesPage',request).then(function (response) {
                setTotalElements(response.data.totalElements);
                setPageSize(response.data.size);
                setCurrentPage(response.data.number);
                let list = response.data.courseDtoList.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    students: row.students
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
             <EditModal show={isEditModalShown} handleClose={handleEditModalClose} course={selectedCourse} refreshTable={refreshTable}/>
                <Row gutter={16}>
                    <Col className="gutter-row" span={4}></Col>
                    <Col className="gutter-row" span={2} style={{marginTop: "4px"}}>Search keywords:</Col>
                    <Col className="gutter-row" span={4}>
                        <Input
                            placeholder="Enter search keywords"
                           onKeyDown={(e)=>handleChangeValueSearch(e)}
                           onChange={handleChangeAndSetValueSearch}
                        />
                    </Col>
                    <Col className="gutter-row" span={2} style={{marginTop: "4px"}}>Search attribute: </Col>
                    <Col className="gutter-row" span={6}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please select the desired attribute"
                        defaultValue={columnSearch}
                        onChange={handleChangeSelectedAttributeSearch}
                    >
                        <Option value="name">Name</Option>
                        <Option value="description">Description</Option>
                    </Select>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <Button onClick={showCreateModal} type="primary"><FolderAddOutlined />Create</Button>
                    </Col>
                </Row>
            </div>
            <br></br>
           <div>
                <Table 
                    dataSource={dataSource} 
                    columns={columns} 
                    size="small"
                    pagination={{ 
                        hideOnSinglePage: true
                    }}
                    onChange={onChange}
                />
                <br />
                <Pagination
                    showSizeChanger
                    pageSizeOptions= {[6,8,10]}
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


export default CourseList;