import React from "react";
// reactstrap components
import './css/progressbar.css';

const ProgressBar = ({bgcolor,progress,height}) => {
     
    const Parentdiv = {
        height: height,
        width: '60%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
        marginTop: 50,
        marginBottom: 50,
        marginLeft: 30,
        marginRight: 30
      }
      
      const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: bgcolor,
        borderRadius:40,
        textAlign: 'right'
      }
      
      const progresstext = {
        padding: 10,
        color: 'black',
        fontWeight: 600
      }
        
    return (
      <div style={Parentdiv} className="Parentdiv">
          <div style={Childdiv}>
              <span style={progresstext}>{`${progress}%`}</span>
          </div>
        </div>
    )
}

export default ProgressBar;