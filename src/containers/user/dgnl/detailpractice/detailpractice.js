import React from "react";
import { useParams } from 'react-router-dom';

import Hashids from "hashids";
import HeaderDetailPage from './headerdetail/headerdetail';
import  BodyDetailPage from './bodydetail/bodydetail';

import { Container } from "reactstrap";
const PracticeDetailPage = () => {
    let id = useParams(); // { id: '1' }
    const hashids = new Hashids();
    return (
        <>
            <div className="section section-navbars">
                <Container >
                    <HeaderDetailPage id={hashids.decode(id.id)}></HeaderDetailPage>
                    <br/>
                    <BodyDetailPage id={hashids.decode(id.id)} idCourse={hashids.decode(id.idCourse)}></BodyDetailPage>
                </Container>
            </div>
        </>
    )

}

export default PracticeDetailPage;