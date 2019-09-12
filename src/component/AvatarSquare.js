import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';

@withRouter
@translate()
@inject("store")
@observer
export default class AvatarSquare extends Component
{
    // constructor(props) 
    // {
    //     super(props);
    // }
    
    // componentDidMount()
    // {
    //    // 
    // }

    render()
    {
        // const store = this.props.store;
        const props = this.props;

        const url = props.data.base64 || "/image/h2editor.logo.png"; 
        const class_name = props.className ? "avatar-square " + props.className :  "avatar-square ";
        
        return <div className={class_name} onClick={(e)=>{if(props.onClick)props.onClick(e);}}><img src={url} alt={props.data.name} /></div>;
    }
}