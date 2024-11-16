import React from 'react';
import { Carousel } from 'antd';

const CarouselCustom = () => {

  return (
    <Carousel autoplay style={{marginBottom: 12, height: '100%'}}>
      <div>
        <img src={require('assets/img/banner1.png').default} alt='banner1' style={{borderRadius: 8}}/>
      </div>
      {/* <div>
        <img src={require('assets/img/banner3.jpg').default} alt='banner1' style={{borderRadius: 8}}/>
      </div> */}
    </Carousel>
  );
};

export default CarouselCustom;