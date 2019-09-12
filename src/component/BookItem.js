import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { Button  } from "@blueprintjs/core";

@withRouter
@translate()
@inject("store")
@observer
export default class BookItem extends Component
{
    // constructor(props) 
    // {
    //     super(props);
    // }
    
    // componentDidMount()
    // {
    //    // 
    // }

    // componentDidUpdate(prevProps)
    // {
    //     if (this.props.data !== prevProps.data) 
    //     {
           
    //     }
    // }
    
    render()
    {
        const item = this.props.data;
        if( !item ) return null;

        return <li onClick={()=>this.props.history.push('/read/'+encodeURIComponent(item.bookurl) )}>
            <span>{item.name}</span>
            <Button icon="chevron-right" minimal={true} />
        </li>;
    }
}