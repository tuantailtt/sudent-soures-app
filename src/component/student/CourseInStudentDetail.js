import axios from 'axios';
import React,{useState, useEffect} from 'react';
import {Breadcrumb, Card,Row, Col ,Collapse,Tag,Button,Table,message,Modal} from 'antd';
import {useParams} from "react-router-dom";
const { Panel } = Collapse;
const { confirm } = Modal;

function CourseInStudentDetail(){
    const [course,setCourse]=useState({});
    const [student,setStudent]=useState({});
    const [account, setAccount]= useState({});
    const [contentHtml, setContentHtml] = useState("");
    const [refresh, setRefresh]=useState(false);

    let { studentId, courseId } = useParams();
    const chapterColums = [
        { title: 'ID', dataIndex: 'id',key: 'id', width: '20%'},
        { title: 'Name', dataIndex: 'name',key: 'name', width: '80%',},
    ];

    async function showPaymentConfirm(studentId,courseId){
        confirm({
          title: 'Are you sure pay this course?',
          content: "",
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: async () => {
            // payment(studentId,courseId);
            return new Promise(async (resolve, reject) => {
              await payment(studentId,courseId);
              setTimeout(reject , 0);
            }).catch(() => {});
          },
          onCancel() {
          },
      });
      }
    
    async function payment (studenId, courseId) {
       await axios.get('/api/students/'+studenId+'/payment/'+courseId)
          .then(function(response){
            let msg = response.data.split(":");
            if(msg[0]==="success"){
              message.success(msg[1]);
              setRefresh(!refresh);
            }else{
              message.error(msg[1]);
            };
          })
      }

    useEffect(()=>{
        axios.get('/api/courses/'+courseId)
            .then(function(response){
                setCourse(response.data);
            })
        axios.get('/api/students/'+studentId)
            .then(function(response){
              setStudent(response.data);
            })
       
        
    },[studentId,courseId])

    useEffect(()=>{
        axios.get('/api/accounts/student/'+studentId)
            .then(function(response){
            setAccount(response.data);
            })
        axios.get('/api/students/'+studentId+'/course/'+courseId)
        .then(function(response){
            if(response.data !== ""){
                setContentHtml((
                    <Table 
                    dataSource={response.data.map(row => ({
                      key: row.id,
                      id: row.id,
                      name: row.name,
                    }))} 
                    columns={chapterColums} 
                    pagination={{ position: ["bottomCenter"] ,pageSize: 4,size:"default",}}
                    scroll={{ y: 400}}
                  />
                ))
            }else{
                setContentHtml ((
                <div style={{textAlign:"center"}}>
                    <Button type="primary" onClick={()=>showPaymentConfirm(studentId,courseId)}>Pay to access course content</Button>
                </div>
                )) ;
            }
        })
// eslint-disable-next-line           
    },[refresh])


    return (
        <div>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Admin</Breadcrumb.Item>
        <Breadcrumb.Item>Student</Breadcrumb.Item>
        <Breadcrumb.Item>{studentId}</Breadcrumb.Item>
        <Breadcrumb.Item>Course</Breadcrumb.Item>
        <Breadcrumb.Item>{courseId}</Breadcrumb.Item>
      </Breadcrumb>
      <Card title={student.name+' ( Account: '+account.name+', Balance: '+account.balance+' )'}>
      <Collapse defaultActiveKey={['1','2']} >
        <Panel header="Course information" key="1">
          <Row>
            <Col span={1} style={{marginRight:"5px"}}><label><Tag color="magenta">Name:</Tag> </label></Col>
            <Col span={4} style={{borderRight:"1px solid",marginRight:"5px"}}><label>{course.name}</label></Col>
            <Col span={2} style={{marginRight:"5px"}}><label><Tag color="magenta">Description:</Tag> </label></Col>
            <Col span={13} style={{borderRight:"1px solid",marginRight:"5px"}}><label> {course.description}</label></Col>
            <Col span={3} style={{borderRight:"1px solid",marginRight:"5px"}}><label><Tag color="magenta">Cost:</Tag> {course.cost}</label></Col>
          </Row>
        </Panel>
        <Panel header="Content course" key="2">
         {contentHtml}
        </Panel>
      </Collapse>
      </Card>
    </div>
    )
}
export default CourseInStudentDetail;