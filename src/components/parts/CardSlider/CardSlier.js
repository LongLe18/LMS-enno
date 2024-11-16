import React from 'react';
import './CardSlider.css';
import config from '../../../configs/index';
import { Link } from "react-router-dom";
import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import Hashids from 'hashids';

const Card = ({ ten_khoa_hoc, anh_dai_dien, khoa_hoc_id, link }) => {
    return (
        <div className="card">
            <div className="image-box">
                <Link to={link}>
                    <img src={anh_dai_dien ? config.API_URL + `${anh_dai_dien}` : require('assets/img/default.jpg').default} alt={ten_khoa_hoc} />
                </Link>
            </div>
            <div className="card-content">
                <h3 className="course-cate-title">
                    <Link to={link} style={{color: 'green'}}>{ten_khoa_hoc}</Link>
                </h3>
                {/* <p>{mo_ta}</p> */}
            </div>
        </div>
    );
};

const CardSlider = ({ courses, id, link }) => {
    const hashids = new Hashids();

    const scrollLeft = () => {
        const container = document.querySelector(`#cards-container-${id}`);
    
        const containerWidth = container.offsetWidth;
        if (containerWidth <= 480) {
            container.scrollBy({ left: -350, behavior: 'smooth' });
        } else if (containerWidth > 480 && containerWidth <= 768) {
            container.scrollBy({ left: -320, behavior: 'smooth' });
        } else if (containerWidth > 768 && containerWidth <= 1700) {
            container.scrollBy({ left: -280, behavior: 'smooth' });
        } else if (containerWidth >= 1700) {
            container.scrollBy({ left: -298, behavior: 'smooth' });
        }
    };
      
    const scrollRight = () => {
        const container = document.querySelector(`#cards-container-${id}`);
    
        const containerWidth = container.offsetWidth;
        if (containerWidth <= 480) {
            container.scrollBy({ left: 350, behavior: 'smooth' });
        } else if (containerWidth > 480 && containerWidth <= 768) {
            container.scrollBy({ left: 320, behavior: 'smooth' });
        } else if (containerWidth > 768 && containerWidth <= 1700) {
            container.scrollBy({ left: 280, behavior: 'smooth' });
        } else if (containerWidth > 1700) {
            container.scrollBy({ left: 298, behavior: 'smooth' });
        }
    };

    return (
        <div className="card-slider">
            <button className="scroll-button left" onClick={scrollLeft}><LeftOutlined style={{fontSize: 14}}/></button>
            <div className="cards-container" id={`cards-container-${id}`}>
                {courses?.map((course, index) => (
                    <Card key={index} {...course} link={link + `${hashids.encode(course.khoa_hoc_id)}`}/>
                ))}
            </div>
            <button className="scroll-button right" onClick={scrollRight}><RightOutlined style={{fontSize: 14}}/></button>
        </div>
    );
};

export default CardSlider;
