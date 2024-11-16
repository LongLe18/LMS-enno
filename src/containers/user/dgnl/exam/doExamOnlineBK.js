



import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Row, Progress, Tooltip } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import './css/ExamDetailDGTD.scss';

const { Header, Sider, Content } = Layout;

export default function Component() {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [items, setItems] = useState([
    { id: "1", content: "từ hóa" },
    { id: "2", content: "tia X" },
    { id: "3", content: "hạt từ" },
    { id: "4", content: "vật lý" },
    { id: "5", content: "kim la bàn" },
    { id: "6", content: "mẫu hướng" },
  ])
  const [dropTarget, setDropTarget] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // hàm xử lý đánh dấu câu hỏi
  const handleMarkQuestion = () => {

  }

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className='header-dgtd'>
        <h5 >ĐỀ TRẢI NGHIỆM ĐÁNH GIÁ TƯ DUY BÁCH KHOA NĂM 2025</h5>
        <h6 style={{marginBottom: 0, fontWeight: 700}}>Phần thi: Tư duy toán học (60 phút)</h6>
      </Header>
      <Layout>
        <Content className='body-dgtd'>
          <Card title="Câu 1" 
            extra={
              <Tooltip title="Đánh dấu câu hỏi">
                <Button shape="circle" icon={<BookOutlined />} onClick={() => handleMarkQuestion()}/>
              </Tooltip>
            } 
            style={{ width: '100%', borderRadius: 8 }}
          >
            <p>Cho hàm số y = f(x) có đồ thị là đường cong ở hình bên.</p>
            {/* Replace with actual graph component or image */}
            <div style={{ background: '#f0f0f0', height: 200, marginBottom: 16, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              [Graph Placeholder]
            </div>
            <p>Kéo thả các đáp án vào vị trí thích hợp:</p>
            <div class="solution">
              <div class="text-center list-item paragraph-components">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="solution-fill-item inline-block box-text"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, item.id)}
                    aria-label={`Draggable item: ${item.content}`}
                  >
                    <div>{item.content}</div>
                  </div>
                ))}
              </div>
            </div>
            
          </Card>
          <Row style={{marginTop: 16}} align={'middle'}>
            <Button type="primary" className='btn-chinh' style={{ marginRight: 12 }} >Câu trước</Button>
            <Button type="primary" className='btn-chinh' style={{ marginRight: 12 }} >Câu tiếp</Button>
            <h6 style={{marginBottom: 0}}>Thời gian làm câu hiện tại: <b>{formatTime(timeLeft)}</b></h6>
          </Row>
        </Content>
        <Sider width={500} className='list-question-side'>
          <div style={{ padding: 16 }}>
            <h6>Thời gian còn lại: <b>{formatTime(timeLeft)}</b></h6> 
          </div>
          <Row style={{ padding: 16, paddingTop: 0 }} justify={'center'}>
            <Button type="primary" style={{ marginBottom: 16, marginRight: 12, background: '#ff6a00', borderColor: '#ff6a00', width: '25%', borderRadius: 20 }}>Nộp bài</Button>
            <Button type='primary' className='btn-chinh' style={{ marginBottom: 16, marginRight: 12, width: '25%' }}>Tạm dừng</Button>
          </Row>
          <Row align={'middle'} style={{ padding: 16, paddingTop: 0 }}>
            <h6 style={{margin: 0}}>Chỉ thị màu sắc: </h6>
            <button className='a-tag' style={{borderRadius: 8, marginLeft: 6}}>0</button>
            <button className='a-tag selected' style={{borderRadius: 8, marginLeft: 6}}>0</button>
            <button className='a-tag marked' style={{borderRadius: 8, marginLeft: 6}}>0</button>
          </Row>
          <div className='list-question-area'>
            {[...Array(40)].map((_, index) => (
              <button className={`a-tag ${currentQuestion === index + 1 ? 'selected' : ''}`}
                key={index} 
                style={{ margin: '4px' }}
                onClick={() => setCurrentQuestion(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div style={{ padding: 16 }}>
            <h6>Bạn đã hoàn thành 0/40</h6> 
            <Progress percent={(10/40) * 100} />
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
}