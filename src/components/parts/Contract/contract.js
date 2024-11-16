import React, { useEffect } from "react";
import './css/contract.css';

// redux
import * as contactAction from '../../../redux/actions/contact';
import { useSelector, useDispatch } from "react-redux";

const Contract = (props) => {
    const dispatch = useDispatch();

    const contacts = useSelector(state => state.contact.list.result);

    useEffect(() => {
        dispatch(contactAction.getCONTACTs());
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="float-contact">
            {contacts.status === 'success' && contacts.data.map((item, index) => {
                if (index <= 3) {
                    return (
                        <div key={index}>  
                            <button className={item.mo_ta}>
                                <a href={item.mo_ta === 'HOTLINE' ? 'tel:' + item.link_lien_ket : item.link_lien_ket}>{item.mo_ta}</a>
                            </button>
                        </div>
                    )
                }
                return null;
            })}
            
        </div>
    )
};

export default Contract;