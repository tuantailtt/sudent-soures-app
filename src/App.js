import './App.css';
import 'antd/dist/antd.css';
import StudentList from './component/student/StudentList';
import RegisterCourse from './component/student/RegisterCourse';
import CourseList from './component/course/CourseList';
import RegisterStudent from './component/course/RegisterStudent';


function App() {
  return (
    <div className="App">
       <StudentList />
       {/* <CourseList /> */}
        {/* <RegisterCourse id={15}/> */}
        {/* <RegisterStudent id={4} /> */}
    </div>
  );
}

export default App;
