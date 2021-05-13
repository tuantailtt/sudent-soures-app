import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Button, Table, Modal } from 'antd';

const { confirm } = Modal;
function CourseList(){

    const [data, setData] = useState([]);
    const columns = [
        { title: 'Name', dataIndex: 'name',key: 'name'},
        { title: 'Description', dataIndex: 'description',key: 'description'},
        {
            title: 'Action',dataIndex: '',key: 'x',align:"center",
            render: (student,record) => (
                <div>
                    <Button type="primary" onClick={() => showDetail(record.key)}>Detail</Button>
                    <Button type="danger" onClick={() => showDeleteConfirm(student)}>Delete</Button>
                </div>)
        }
    ];

    function deleteStudent(id){
        axios.delete('/api/students/'+id)
            .then(function(response){
                console.log(response);
                let list = data.filter(item => item.key !== id);
                console.log(list);
                setData(list);
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
                console.log(student.id);
                deleteStudent(student.id);
            },
            onCancel() {
            console.log('Cancel');
            },
        });
    }

    function showDetail(key){
        console.log(key);
    }



    useEffect(() => {
        axios.get('/api/courses')
            .then(function (response) {
                console.log(response.data)
                let list = response.data.map(row => ({
                    key: row.id,
                    id: row.id,
                    name: row.name,
                    description: row.description
                }));
                setData(list);
            })
    }, []);

    return (
        <div className="App">
           <div>
                {console.log('datastate',data)}
                <Table dataSource={data} 
                columns={columns} 
                pagination={{ position: ["bottomCenter"] }}
                />
            </div>
        </div>
      );
}


export default CourseList;