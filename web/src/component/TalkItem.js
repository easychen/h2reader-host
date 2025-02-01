import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { translate } from 'react-i18next';
import AvatarSquare from '../component/AvatarSquare';
import ImageZoom from 'react-medium-image-zoom';
import ReactMarkdown from 'react-markdown';

function LinkRenderer(props) 
{
    return <a href={props.href} target="_blank">{props.children}</a>
}

function ImageZoomed( props )
{
    return <ImageZoom  
    image={{ src: props.src , className:"imginbox" }} 
    />
}

@withRouter
@translate()
@inject("store")
@observer
export default class TalkItem extends Component
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
        const store = this.props.store;
        const props = this.props;

        if( !props.data ) return null;

        const talk = props.data;
        const role = props.roles.filter( item => item.id == talk.role_id )[0];
        const role_class = talk.role_ismain ? " role main " : " role notmain";

        // console.log( "role" , props.roles );
        
        return talk.type == 'role' 
            ?
                
                <div className={"talk-list-item-ro"+role_class} data-id={talk.id}>
                <div className="avatarside">
                    <AvatarSquare data={role} className="s48"/>
                </div>
                <div className="contentside">
                    <div className="name">{role.name}</div>
                    <div className="text"><ReactMarkdown source={talk.text} renderers={{link: LinkRenderer,image:ImageZoomed}}/></div>
                </div>
                
                </div>
            :
            <div className="talk-list-item-ro aside" ><div className="aside-text"><ReactMarkdown source={talk.text} renderers={{link: LinkRenderer,image:ImageZoomed}}/></div></div>;
    }
}