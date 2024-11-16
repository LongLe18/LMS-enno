import { Carousel } from 'antd';

const contentStyle = {
    color: '#fff',
    lineHeight: '160px',
    background: '#364d79',
};

const Slider = () => (
    <Carousel autoplay>
        <div>
            <img style={contentStyle} src={require('assets/img/landingpage/cover-ETC.png').default} alt="slider-1"/>
        </div>
        <div>
            <img style={contentStyle} src={require('assets/img/landingpage/cover-ETC-2.png').default} alt="slider-2"/>
        </div>
    </Carousel>
);
export default Slider;